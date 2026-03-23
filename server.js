const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require('dotenv').config()

app.use(express.static(path.join(__dirname, 'public')));

app.use('/add-Employee', require('./Router/addEmploye'));
app.use('/form', require('./Router/form'));
app.use('/dept-info', require('./Router/dept'));
app.use('/user-login', require('./Router/login'));
app.use('/admin-loin',require('./Router/adminLoigin'))
app.use('/allCustomer',require('./Router/allCustomers'))
app.use('/employeeView',require('./Router/employeeView'))
app.use('/customerView',require('./Router/customerView'))
app.use('/update-Employee',require('./Router/updateEmp'))
app.use('/update-customer',require('./Router/updateCustomer'))
app.use('/logout',require('./Router/logout'))
app.use('/userDuration',require('./Router/getUserDuration'))
app.use('/active-users', require('./Router/activeUsers'))
app.use('/break',require('./Router/break'))
app.use('/continue',require('./Router/continue'))
app.use('/daily-summary',require('./Router/daily-summary'))
app.use('/admin-login',require('./Router/Admin/adminLogin'))
app.use('/admin-chnage-access',require('./Router/Admin/adminAccess'))
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
