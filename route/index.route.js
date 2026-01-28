const express = require('express')
const router = express.Router()

const officerRoute = require('../route/officer.route')

router.use('/officers', officerRoute)

module.exports = router