const express = require('express')
const router = express.Router()
const db = require('./db')

router.get('/', (req, res) => {

    const query = "select * from employee"

    db.query(query, (err, results) => {

        if(err){
            console.log('Error in loading Data ', err)
            return res.status(500).json(err)
        }

        res.status(200).json(results)
    })
})

module.exports=router