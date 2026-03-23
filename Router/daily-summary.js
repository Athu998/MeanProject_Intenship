const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', (req, res) => {

    const query = `
        SELECT 
    ls.login_date,
    e.EmpId,
    e.username,

    MIN(ls.login_time) AS first_login,
    MAX(ls.logout_time) AS last_logout,

    SUM(ls.duration_minutes) AS total_work_minutes,
    SUM(ls.break_minutes) AS total_break_minutes,

    CASE 
    WHEN SUM(CASE WHEN ls.logout_time IS NULL THEN 1 ELSE 0 END) > 0
    THEN 'Active'
    ELSE 'Logged Out'
END AS status

FROM login_sessions ls
JOIN employee e 
    ON e.EmpId = ls.employee_id

GROUP BY ls.login_date, e.EmpId, e.username
ORDER BY ls.login_date DESC;
    `;

    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });

        res.json(result);
    });

});

module.exports = router;