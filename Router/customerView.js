const express = require('express');
const db = require('./db');
const router = express.Router();

router.get('/', (req, res) => {
  const query = "SELECT * FROM suppliers";

  db.query(query, (err, data) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(data);
  });
});

module.exports = router;
