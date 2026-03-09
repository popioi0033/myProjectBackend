const pool = require('../db')
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

const getOfficers = async ({ page = 1, limit = 10, search = '' } = {}) => {
  try {
    const pageNum = parseInt(page) 
    const limitNum = parseInt(limit)  
    const offset = (pageNum - 1) * limitNum
    const keyword = `%${search}%`

    const [result, countResult] = await Promise.all([
      pool.query(
        `SELECT id, officer_code, name, email, institute, job_position, phone, role
         FROM officers
         WHERE name ILIKE $1 OR email ILIKE $1 OR officer_code ILIKE $1
         ORDER BY id DESC
         LIMIT $2 OFFSET $3`,
        [keyword, limitNum, offset]
      ),
      pool.query(
        `SELECT COUNT(*) FROM officers
         WHERE name ILIKE $1 OR email ILIKE $1 OR officer_code ILIKE $1`,
        [keyword]
      )
    ])

    const total = parseInt(countResult.rows[0].count)

    return {
      data: result.rows,
      pagination: {
        total,
        page: pageNum, 
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    }
  } catch (err) {
    throw err
  }
}

module.exports = { createOfficer, getOfficers }