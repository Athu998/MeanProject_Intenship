const express = require('express');
const router = express.Router();
const db = require('./db'); 

router.get('/dept-info', (req, res) => {
  const query = 'SELECT * FROM dep';

  db.query(query, (err, result) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(200).json(result); 
  });
});

module.exports = router;
