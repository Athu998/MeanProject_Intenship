const express = require('express')
const db = require('./db')
const router = express.Router()

router.put('/:id', (req, res) => {

  const id = req.params.id
  const { name, phone_number, department } = req.body

  const query = `
    UPDATE employee
    SET name = ?, phone_number = ?, department = ?
    WHERE EmpId = ?
  `

  db.query(query, [name, phone_number, department, id], (err, result) => {
    if (err) {
      console.log("SQL ERROR:", err)   
      return res.status(500).json({ message: "Update failed", error: err })
    }

    console.log("RESULT:", result)     

    res.json({ message: "Employee updated successfully" })
  })
})
module.exports = router