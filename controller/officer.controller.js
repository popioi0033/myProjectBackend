// modules/officer/officer.controller.js
const { createOfficer } = require('../model/model.layer/officer.model.layer')

const create = async (req, res, next) => {
  try {
    const officer = await createOfficer(req.body)
    res.status(201).json(officer)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  create
}
