const pool = require('../db')

const addStudent = async (data) => {
    try {

        const { studentCode, firstName, lastName, email, phone, facultyCode } = data

        const faculty = await pool.query(
            `SELECT id FROM faculties WHERE code = $1`,
            [facultyCode]
        )

        if (faculty.rows.length === 0) {
            throw new Error('Faculty not found')
        }

        const facultyId = faculty.rows[0].id

        const result = await pool.query(
            `
            INSERT INTO students 
            (student_code, first_name, last_name, email, phone, faculty_id)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *
            `,
            [studentCode, firstName, lastName, email, phone, facultyId]
        )

        return result.rows[0]

    } catch (error) {
        throw error
    }
}

module.exports = {
    addStudent
}