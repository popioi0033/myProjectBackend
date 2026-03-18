const pool = require('../db')

const addStudent = async (data) => {
    try {

        const { studentCode, firstName, lastName, email, phone, facultyCode, gpax, branch, year } = data

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
            (student_code, first_name, last_name, email, phone, faculty_id, gpax, branch, year)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *
            `,
            [studentCode, firstName, lastName, email, phone, facultyId, gpax, branch, year]
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

const getLoanRequest = async ({ page = 1, limit = 10, search = '', status = '' } = {}) => {
    try {
        const pageNum = parseInt(page)
        const limitNum = parseInt(limit)
        const offset = (pageNum - 1) * limitNum
        const keyword = `%${search}%`
        const statusCodes = status ? status.split(',') : ['PENDING', 'REVIEWING']
        const mainPlaceholders = statusCodes.map((_, i) => `$${i + 4}`).join(',')
        const countPlaceholders = statusCodes.map((_, i) => `$${i + 2}`).join(',')

        const [result, countResult] = await Promise.all([
            pool.query(
                `SELECT 
                    lr.id,
                    lr.academic_year,
                    lr.semester,
                    lr.create_at,
                    s.student_code,
                    s.first_name,
                    s.last_name,
                    s.email,
                    s.phone,
                    s.year,
                    s.branch,
                    s.gpax,
                    f.name AS faculty_name,
                    o.name AS officer_name,
                    rs.name_th AS status,
                    rs.code AS status_code
                FROM loan_request lr
                JOIN students s ON lr.student_id = s.id
                JOIN faculties f ON s.faculty_id = f.id
                JOIN officers o ON lr.officer_id = o.id
                JOIN request_status rs ON lr.status_id = rs.id
                WHERE (s.first_name ILIKE $1 OR s.last_name ILIKE $1 OR s.student_code ILIKE $1)
                AND rs.code IN (${mainPlaceholders})
                ORDER BY 
                    CASE rs.code
                        WHEN 'PENDING' THEN 1
                        WHEN 'REVIEWING' THEN 2
                        WHEN 'APPROVED' THEN 3
                        WHEN 'REJECTED' THEN 4
                    END,
                    lr.create_at DESC
                LIMIT $2 OFFSET $3`,
                [keyword, limitNum, offset, ...statusCodes]
            ),
            pool.query(
                `SELECT COUNT(*) 
                FROM loan_request lr
                JOIN students s ON lr.student_id = s.id
                JOIN request_status rs ON lr.status_id = rs.id
                WHERE (s.first_name ILIKE $1 OR s.last_name ILIKE $1 OR s.student_code ILIKE $1)
                AND rs.code IN (${countPlaceholders})`,
                [keyword,...statusCodes]
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

const updateStatus = async (requestId, officerId, action) => {
    try {
        const current = await pool.query(
            `SELECT rs.code 
             FROM loan_request lr
             JOIN request_status rs ON lr.status_id = rs.id
             WHERE lr.id = $1`,
            [requestId]
        )

        if (current.rows.length === 0) {
            throw new Error('Request not found')
        }

        const currentCode = current.rows[0].code

        // flow ปกติ
        const flow = {
            'PENDING': 'REVIEWING',
            'REVIEWING': 'APPROVED',
        }

        // กำหนด next status
        let nextCode

        if (action === 'reject') {
            // reject ได้แค่ตอน PENDING หรือ REVIEWING เท่านั้น
            if (!['PENDING', 'REVIEWING'].includes(currentCode)) {
                throw new Error(`Cannot reject request with status ${currentCode}`)
            }
            nextCode = 'REJECTED'
        } else {
            nextCode = flow[currentCode]
            if (!nextCode) {
                throw new Error(`Cannot update status from ${currentCode}`)
            }
        }

        const nextStatus = await pool.query(
            `SELECT id FROM request_status WHERE code = $1`,
            [nextCode]
        )

        const result = await pool.query(
            `UPDATE loan_request
             SET status_id = $1, officer_id = $2
             WHERE id = $3
             RETURNING *`,
            [nextStatus.rows[0].id, officerId, requestId]
        )

        return result.rows[0]

    } catch (err) {
        throw err
    }
}

const getExportData = async ({ search = '', status = '' } = {}) => {
    try {
        const keyword = `%${search}%`
        const statusCodes = status ? status.split(',') : ['PENDING', 'REVIEWING']
        const placeholders = statusCodes.map((_, i) => `$${i + 2}`).join(',')

        const result = await pool.query(
            `SELECT 
                lr.academic_year,
                lr.semester,
                s.student_code,
                s.first_name,
                s.last_name,
                s.email,
                s.phone,
                s.year,
                s.branch,
                s.gpax,
                f.name AS faculty_name,
                o.name AS officer_name,
                rs.name_th AS status
            FROM loan_request lr
            JOIN students s ON lr.student_id = s.id
            JOIN faculties f ON s.faculty_id = f.id
            JOIN officers o ON lr.officer_id = o.id
            JOIN request_status rs ON lr.status_id = rs.id
            WHERE (s.first_name ILIKE $1 OR s.last_name ILIKE $1 OR s.student_code ILIKE $1)
            AND rs.code IN (${placeholders})
            ORDER BY 
                CASE rs.code
                    WHEN 'PENDING' THEN 1
                    WHEN 'REVIEWING' THEN 2
                    WHEN 'APPROVED' THEN 3
                    WHEN 'REJECTED' THEN 4
                END`,
            [keyword, ...statusCodes]
        )

        return result.rows

    } catch (err) {
        throw err
    }
}

module.exports = {
    addStudent,
    getStd,
    addRequest,
    getLoanRequest,
    updateStatus,
    getExportData
}