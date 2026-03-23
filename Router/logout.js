const express = require('express');
const router = express.Router();
const db = require('./db');
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Invalid token format"
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        if (!userId) {
            return res.status(400).json({
                message: "Invalid token payload"
            });
        }

 const query = `
UPDATE login_sessions
SET 
    logout_time = NOW(),

    duration_minutes = duration_minutes + 
        CASE 
            WHEN break_start_time IS NULL 
            THEN TIMESTAMPDIFF(MINUTE, last_login_time, NOW())
            ELSE 0
        END,

    break_minutes = break_minutes +
        CASE 
            WHEN break_start_time IS NOT NULL
            THEN TIMESTAMPDIFF(MINUTE, break_start_time, NOW())
            ELSE 0
        END,

    break_start_time = NULL

WHERE employee_id = ?
AND login_date = CURDATE()
`;

        db.query(query, [userId], (err, result) => {

            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(400).json({
                    message: "No session found for today"
                });
            }

            return res.status(200).json({
                message: "Logout successful",
                updatedRows: result.affectedRows
            });
        });

    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }

});

module.exports = router;