const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcryptjs');

router.post('/employee-info', async (req, res) => {
    try {
        const {
            EmpId,
            name,
            phone_number,
            designation,
            department,
            initials,
            address,
            password,
            username
        } = req.body;

        const hash_password = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO employee
            (EmpId, name, phone_number, designation, department, initials, address, hash_password,username)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
        `;

        db.query(
            query,
            [
                EmpId,
                name,
                phone_number,
                designation,
                department,
                initials,
                address,
                hash_password,
                username
            ],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Database error' });
                }

                res.status(201).json({
                    message: 'Employee added successfully',
                    employeeId: EmpId
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
