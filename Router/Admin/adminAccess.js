const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/:empId', (req, res) => {

    const empId = req.params.empId;

    const query = `UPDATE login_sessions
                   SET admin_override = TRUE
                   WHERE employee_id = ?
                   AND login_date = CURDATE()`;

    db.query(query, [empId], (err, result) => {

        if (err) {
            console.log("Error updating override:", err);
            return res.status(500).json({ message: "Database error" });
            alert("Error in updating the status of employee ")
        }

        res.json({
            message: "Login override granted. User can login again.",
        
        });
        

    });

});

router.get('/users',(req,res)=>{

const query = `
SELECT 
e.EmpId AS employee_id,
e.username,
l.break_minutes
FROM login_sessions l
JOIN employee e 
ON e.EmpId = l.employee_id
WHERE l.login_date = CURDATE()
`;

db.query(query,(err,result)=>{

if(err){
console.log(err);
return res.status(500).json({message:"DB error"});
}

res.json(result);

});

});

module.exports = router;