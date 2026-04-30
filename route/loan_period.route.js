const express = require('express');
const router = express.Router();
const {createLoanPeriodController,
    deleteLoanPeriodController,
    getActiveLoanPeriodController,
    getLoanPeriodsController,
    updateLoanPeriodController,
    getNotificationsController
} = require('../controller/loan_period.controller');

const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, createLoanPeriodController)
router.delete('/:id', authMiddleware, deleteLoanPeriodController)
router.get('/', getLoanPeriodsController)
router.get('/active', getActiveLoanPeriodController)
router.put('/:id', authMiddleware, updateLoanPeriodController)
router.get('/notifications',getNotificationsController)

module.exports = router