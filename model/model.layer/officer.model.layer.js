// modules/officer/officer.model.js
const prisma = require('../../config/prisma')

const createOfficer = (data) => {
  return prisma.officer.create({
    data: {
      officerCode: data.officerCode,
      name: data.name,
      email: data.email,
      institute: data.institute,
      jobPosition: data.jobPosition,
      phone: data.phone,
      role: data.role
    }
  })
}

module.exports = {
  createOfficer
}
