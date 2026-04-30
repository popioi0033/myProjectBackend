
const { createLoanPeriod,deleteLoanPeriod , getLoanPeriods, getActiveLoanPeriod, updateLoanPeriod ,getNotifications} = require('../service/loan_period.service')
const createLoanPeriodController = async (req, res, next) => {
    try {
        const officerId = req.user.userId
        const result = await createLoanPeriod(req.body, officerId)
        res.status(201).json({ result })
    } catch (err) {
        next(err)
    }
}

const deleteLoanPeriodController = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await deleteLoanPeriod(id)
        res.status(200).json({ result })
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

const getNotificationsController = async (req, res, next) => {
    try {
        const result = await getNotifications()
        res.status(200).json({ data: result })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createLoanPeriodController,
    deleteLoanPeriodController,
    getLoanPeriodsController,
    getActiveLoanPeriodController,
    updateLoanPeriodController,
    getNotificationsController 
}