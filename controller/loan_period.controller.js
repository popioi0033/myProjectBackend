
const { createLoanPeriod, getLoanPeriods, getActiveLoanPeriod, updateLoanPeriod } = require('../service/loan_period.service')
const createLoanPeriodController = async (req, res, next) => {
    try {
        const officerId = req.user.userId
        const result = await createLoanPeriod(req.body, officerId)
        res.status(201).json({ result })
    } catch (err) {
        next(err)
    }
}

const getLoanPeriodsController = async (req, res, next) => {
    try {
        const result = await getLoanPeriods()
        res.status(200).json({ data: result })
    } catch (err) {
        next(err)
    }
}

const getActiveLoanPeriodController = async (req, res, next) => {
    try {
        const result = await getActiveLoanPeriod()
        res.status(200).json({ data: result })
    } catch (err) {
        next(err)
    }
}

const updateLoanPeriodController = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await updateLoanPeriod(id, req.body)
        res.status(200).json({ result })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createLoanPeriodController,
    getLoanPeriodsController,
    getActiveLoanPeriodController,
    updateLoanPeriodController
}