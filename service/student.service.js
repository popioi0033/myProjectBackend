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

const getStd = async ({ page = 1, limit = 10, search = '' } = {}) => {
    try {
        const pageNum = parseInt(page)
        const limitNum = parseInt(limit)
        const offset = (pageNum - 1) * limitNum
        const keyword = `%${search}%`

        const [result, countResult] = await Promise.all([
            pool.query(
                `SELECT 
                    s.id,
                    s.student_code, 
                    s.first_name, 
                    s.last_name, 
                    s.email, 
                    s.phone,
                    f.name AS faculty_name
                FROM students s
                JOIN faculties f ON s.faculty_id = f.id
                WHERE s.first_name ILIKE $1 
                   OR s.last_name ILIKE $1 
                   OR s.student_code ILIKE $1
                   OR s.email ILIKE $1
                ORDER BY s.id DESC
                LIMIT $2 OFFSET $3`,
                [keyword, limitNum, offset]
            ),
            pool.query(
                `SELECT COUNT(*) 
                FROM students s
                WHERE s.first_name ILIKE $1 
                   OR s.last_name ILIKE $1 
                   OR s.student_code ILIKE $1
                   OR s.email ILIKE $1`,
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
module.exports = {
    addStudent,
    getStd 
}