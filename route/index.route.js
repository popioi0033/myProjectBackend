const express = require('express');
const router = express.Router();

const officerRoute = require('./officer.route');
const authRoute = require('./auth.route');
const facultyRoute = require('./faculty.route');
const studentRoute = require('./student.route')
const loanPeriodRoute = require('./loan_period.route')

router.use('/officers', officerRoute);
router.use('/login', authRoute);
router.use('/faculty',facultyRoute);
router.use('/students',studentRoute);
router.use('/loan-period', loanPeriodRoute)

module.exports = router;