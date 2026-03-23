const express = require('express')
const db = require('./db')
const router = express.Router()

router.put('/:id', (req, res) => {

    const id = req.params.id
    const { number, address } = req.body

    const query = 'UPDATE suppliers SET number = ?, address = ? WHERE id = ?'

    db.query(query, [number, address, id], (error, result) => {

        if (error) {
            console.log("Database Error:", error)
            return res.status(500).json({ message: "Database error" })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Supplier not found" })
        }

        return res.json({
            message: "Supplier updated successfully",
            updatedId: id
        })
    })
})

module.exports = router
