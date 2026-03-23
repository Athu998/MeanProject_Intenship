const express = require('express')
const db = require('./db')
const router = express.Router()

router.get('/', (req, res) => {

const query = `
SELECT 
    DATE(ls.login_time) AS login_date,
    e.EmpId,
    e.name,
    e.username,
    e.designation,
    e.department,
    ls.login_time,
    ls.logout_time,

    -- WORKING MINUTES
    CASE 
        WHEN ls.logout_time IS NULL AND ls.break_start_time IS NULL
        THEN ls.duration_minutes + 
             TIMESTAMPDIFF(MINUTE, ls.last_login_time, NOW())

        WHEN ls.logout_time IS NULL AND ls.break_start_time IS NOT NULL
        THEN ls.duration_minutes

        ELSE ls.duration_minutes
    END AS working_minutes,

    -- BREAK MINUTES
    CASE
        WHEN ls.logout_time IS NULL AND ls.break_start_time IS NOT NULL
        THEN ls.break_minutes + 
             TIMESTAMPDIFF(MINUTE, ls.break_start_time, NOW())

        ELSE ls.break_minutes
    END AS total_break_minutes

FROM login_sessions ls
INNER JOIN employee e 
    ON ls.employee_id = e.EmpId
ORDER BY login_date DESC, ls.login_time DESC
`;
    db.query(query, (err, results) => {

        if (err) {
            console.log("Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
           console.log("RESULTS:", results)
        return res.status(200).json(results);
    });
});
module.exports=router