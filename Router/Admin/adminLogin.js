const express = require('express')
const db = require('../db')
const router = express.Router()
const jwt = require('jsonwebtoken')
router.post("/", (req,res)=>{

const {name,password} = req.body;

db.query(
"SELECT * FROM admins WHERE name=? AND password=?",
[name,password],
(err,result)=>{

if(err) return res.status(500).json({message:"Server error"});

if(result.length === 0){
return res.status(401).json({message:"Invalid credentials"});
}

res.json({
message:"Admin login success",
admin: result[0]
});
const token = jwt.sign( 
    {name:name.name},
   process.env.JWT_SECRET,
   { expiresIn: "1h" }
)

});

});
module.exports=router