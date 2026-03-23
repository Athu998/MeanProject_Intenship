const express = require("express");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/", (req, res) => {
    const {
        username,
        password
    } = req.body;

    const query = `
        SELECT EmpId, username, hash_password
        FROM employee
        WHERE username = ?
    `;

    db.query(query, [username], async (err, result) => {
        if (err) return res.status(500).json({
            message: "Database error"
        });

        if (result.length === 0)
            return res.status(401).json({
                message: "User not found"
            });

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.hash_password);

        if (!isMatch) return res.status(401).json({
            message: "Invalid password"
        });

        const sessionCheckQuery = `
SELECT 
SUM(duration_minutes) AS duration,
SUM(break_minutes) AS breakTime,
MAX(admin_override) AS admin_override
FROM login_sessions
WHERE employee_id = ?
AND login_date = CURDATE()
`;

       db.query(sessionCheckQuery, [user.EmpId], (err, sessionResult) => {

    if (err) {
        return res.status(500).json({ message: "Session check error" });
    }

    const duration = sessionResult[0].duration;
    const breakTime = sessionResult[0].breakTime;
    const override = sessionResult[0].admin_override;

    // if session already exists
    if (duration !== null) {

        const dur = duration || 0;
        const brk = breakTime || 0;
        const ov = override || false;

        if (brk >= 60 && !ov) {
            return res.status(403).json({
                message: "Daily break limit exceeded. Login not allowed.",
            });
        }

        if (dur >= 650) {
            return res.status(403).json({
                message: "Shift completed. Login not allowed.",
            });
        }

        db.query(
            `UPDATE login_sessions
             SET last_login_time = NOW()
             WHERE employee_id = ?
             AND login_date = CURDATE()`,
            [user.EmpId]
        );

    } else {

        // create new session
        db.query(
            `INSERT INTO login_sessions
            (employee_id, login_date, login_time, last_login_time, duration_minutes, break_minutes, admin_override)
            VALUES (?, CURDATE(), NOW(), NOW(), 0, 0, FALSE)`,
            [user.EmpId]
        );

    }

    const token = jwt.sign(
        { id: user.EmpId },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({
        message: "Login successful",
        token: token,
        username: user.username,
    });

});
    });
});

module.exports = router;