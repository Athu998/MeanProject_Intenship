const express = require('express');
const db = require('./db');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', (req, res) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const query = `
            UPDATE login_sessions
            SET 
                break_minutes = break_minutes +
                    IFNULL(TIMESTAMPDIFF(SECOND, break_start_time, NOW()) / 60, 0),
                break_start_time = NULL,
                last_login_time = NOW()
            WHERE employee_id = ?
            AND login_date = CURDATE()
            AND break_start_time IS NOT NULL
        `;

        db.query(query, [userId], (err, result) => {

            if (err) {
                console.error("Continue SQL Error:", err);
                return res.status(500).json({ message: "Continue error" });
            }

            if (result.affectedRows === 0)
    return res.json({ message: "No active break session" });

            res.json({ message: "Work resumed" });

        });

    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
});
module.exports = router;