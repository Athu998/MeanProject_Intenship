const express = require('express')
const db = require('./db')
const router = express.Router()

router.get('/',(req,res)=>{
    const query = `SELECT 
    e.EmpId,
    e.name,
    e.username,
    e.designation,
    e.department,
    ls.login_time,
    
    TIMESTAMPDIFF(MINUTE, ls.login_time, NOW()) AS active_minutes

FROM login_sessions ls
INNER JOIN employee e 
    ON ls.employee_id = e.EmpId

WHERE ls.logout_time IS NULL

ORDER BY ls.login_time DESC; `

db.query(query,(err,result)=>{
    if(err){
        console.log("Opps Db Error",err)
    }
    else{
        res.json(result)
    }
})
})
module.exports=router