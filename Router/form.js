const express = require('express');
const router = express.Router();
const db = require('./db');


// ======================================
// ✅ GET GST STATE BY CODE
// ======================================
router.get('/state/:code', (req, res) => {
  const code = req.params.code;

  const query = `
    SELECT 
      State AS state,
      GSTStateCode AS state_code
    FROM gststatecode
    WHERE GSTStateCode = ?
  `;

  db.query(query, [code], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'DB Error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Invalid State Code' });
    }

    res.json(result[0]);
  });
});

// ======================================
// ✅ INSERT SUPPLIER
// ======================================
// ======================================
// ✅ INSERT SUPPLIER (BULK SUPPORT)
// ======================================
router.post('/submit-form', (req, res) => {

  const data = req.body;

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ message: 'No records received' });
  }

  const query = `
    INSERT INTO suppliers
    (name, contact_person, number, dept, address, location, city, state, country, state_code, status, gstno, panNo)
    VALUES ?
  `;

  const values = data.map(item => [
    item.name,
    item.contact_person,
    item.number,
    item.dept,
    item.address,
    item.location,
    item.city,
    item.state,
    item.country,
    item.state_code,
    item.status,
    item.gstno,
    item.panNo
  ]);

  db.query(query, [values], (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'DB Error' });
    }

    res.status(201).json({ message: 'Bulk Inserted Successfully' });
  });

});



module.exports = router;