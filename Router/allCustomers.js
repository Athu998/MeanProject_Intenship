const express = require('express');
const router = express.Router();
const db = require('./db');


router.get('/', (req, res) => {
    const query = 'SELECT * FROM suppliers';

    db.query(query, (err, results) => {
        if (err) {
            console.error("Oops Error", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: "No suppliers found" });
        }

       
        res.status(200).json(results);
    });
});

module.exports = router;