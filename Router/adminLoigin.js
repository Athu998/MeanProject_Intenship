const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('./db')

const router = express.Router()

router.post('/', (req, res) => {

    const { name, password } = req.body

    const query = "SELECT name, adminPassword FROM adminlogin WHERE name = ?"

    db.query(query, [name], (err, result) => {

        if (err)
            return res.status(500).json({ message: "Database error" })

        if (result.length === 0)
            return res.status(401).json({ message: "Admin not found" })

        const storedPassword = result[0].adminPassword

        if (password !== storedPassword)
            return res.status(401).json({ message: "Invalid password" })

        const token = jwt.sign(
            { name, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.json({
            message: "Admin login successful",
            token
        })
    })
})

module.exports = router
