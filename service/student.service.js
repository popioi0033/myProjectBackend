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

const addRequest = async (data) => {
    try {
        const { studentId, academicYear, semester, officerId } = data

        const status = await pool.query(
            `SELECT id FROM request_status WHERE code = $1`,
            ['PENDING']
        )

        if (status.rows.length === 0) {
            throw new Error('Status not found')
        }

        const statusId = status.rows[0].id

        const result = await pool.query(
            `
            INSERT INTO loan_request
            (student_id, academic_year, semester, officer_id, status_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [studentId, academicYear, semester, officerId, statusId]
        )

        return result.rows[0]

    } catch (err) {
        throw err
    }
}

const getLoanRequest = async ({ page = 1, limit = 10, search = '' } = {}) => {
    try {
        const pageNum = parseInt(page)
        const limitNum = parseInt(limit)
        const offset = (pageNum - 1) * limitNum
        const keyword = `%${search}%`

        const [result, countResult] = await Promise.all([
            pool.query(
                `SELECT 
                    lr.id,
                    lr.academic_year,
                    lr.semester,
                    lr.create_at,
                    s.first_name,
                    s.last_name,
                    s.student_code,
                    o.name AS officer_name,
                    rs.name_th AS status,
                    rs.code AS status_code
                FROM loan_request lr
                JOIN students s ON lr.student_id = s.id
                JOIN officers o ON lr.officer_id = o.id
                JOIN request_status rs ON lr.status_id = rs.id
                WHERE s.first_name ILIKE $1
                   OR s.last_name ILIKE $1
                   OR s.student_code ILIKE $1
                ORDER BY lr.create_at DESC
                LIMIT $2 OFFSET $3`,
                [keyword, limitNum, offset]
            ),
            pool.query(
                `SELECT COUNT(*)
                FROM loan_request lr
                JOIN students s ON lr.student_id = s.id
                WHERE s.first_name ILIKE $1
                   OR s.last_name ILIKE $1
                   OR s.student_code ILIKE $1`,
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
    getStd,
    addRequest,
    getLoanRequest  
}