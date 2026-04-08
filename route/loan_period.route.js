const express = require('express');
const router = express.Router();
const {createLoanPeriodController,
    getActiveLoanPeriodController,
    getLoanPeriodsController,
    updateLoanPeriodController
} = require('../controller/loan_period.controller');

const authMiddlewere = require('../middleware/auth.middleware');

router.post('/', authMiddlewere, createLoanPeriodController)
router.get('/', getLoanPeriodsController)
router.get('/active', getActiveLoanPeriodController)
router.put('/:id', authMiddlewere, updateLoanPeriodController)

module.exports = router