const pool = require('../../db')
const bcrypt = require('bcrypt')

const createOfficer = async (data) => {
  try {
    const {
      officerCode,
      name,
      username,
      password,
      email,
      institute,
      jobPosition,
      phone,
      role
    } = data

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `
      INSERT INTO officers 
      (officer_code, name, username, password, email, institute, job_position, phone, role)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id, officer_code, name, username, email, role
      `,
      [
        officerCode,
        name,
        username,
        hashedPassword,
        email,
        institute,
        jobPosition,
        phone,
        role
      ]
    )

    return result.rows[0]
  } catch (err) {
    throw err
  }
}

module.exports = { createOfficer }
