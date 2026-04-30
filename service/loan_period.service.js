const pool = require('../db')

const createLoanPeriod = async (data, officerId) => {
    try {
        const { name, academicYear, semester, startDate, endDate } = data 

        const result = await pool.query(
            `INSERT INTO loan_period (name, academic_year, semester, start_date, end_date, created_by)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [name, academicYear, semester, startDate, endDate, officerId]  
        )

        return result.rows[0]
    } catch (err) {
        throw err
    }
}

const deleteLoanPeriod = async (id) => {
    try {
        const result = await pool.query(
            `DELETE FROM loan_period WHERE id = $1 RETURNING *`,
            [id]
        )

        if (result.rows.length === 0) throw new Error('Loan period not found')

        return result.rows[0]
    } catch (err) {
        throw err
    }
}

const getLoanPeriods = async () => {
    try {
        const result = await pool.query(
            `SELECT 
                lp.*,
                o.name AS created_by_name
             FROM loan_period lp
             LEFT JOIN officers o ON lp.created_by = o.id
             ORDER BY lp.created_at DESC`
        )

        return result.rows
    } catch (err) {
        throw err
    }
}

const getActiveLoanPeriod = async () => {
    try {
        const result = await pool.query(
            `SELECT * FROM loan_period
             WHERE NOW() BETWEEN start_date AND end_date
             ORDER BY created_at DESC
             LIMIT 1`
        )

        return result.rows[0] || null
    } catch (err) {
        throw err
    }
}

const updateLoanPeriod = async (id, data) => {
    try {
        const { name, startDate, endDate } = data

        const result = await pool.query(
            `UPDATE loan_period
             SET name = COALESCE($1, name),
                 start_date = COALESCE($2, start_date),
                 end_date = COALESCE($3, end_date)
             WHERE id = $4
             RETURNING *`,
            [name, startDate, endDate, id]
        )

        if (result.rows.length === 0) throw new Error('Loan period not found')

        return result.rows[0]
    } catch (err) {
        throw err
    }
}

const getNotifications = async () => {
    try {
        const result = await pool.query(
            `SELECT 
                lr.id AS request_id,
                s.first_name,
                s.last_name,
                s.student_code,
                lp.name AS period_name,
                lp.end_date,
                rs.name_th AS status,
                EXTRACT(DAY FROM lp.end_date - NOW()) AS days_remaining
            FROM loan_request lr
            JOIN students s ON lr.student_id = s.id
            JOIN loan_period lp ON lr.loan_period_id = lp.id
            JOIN request_status rs ON lr.status_id = rs.id
            WHERE rs.code NOT IN ('APPROVED', 'REJECTED')
            AND lp.end_date > NOW()
            AND lp.end_date <= NOW() + INTERVAL '3 days'
            ORDER BY lp.end_date ASC`
        )

        return result.rows
    } catch (err) {
        throw err
    }
}

module.exports = {
    createLoanPeriod,
    deleteLoanPeriod,
    getLoanPeriods,
    getActiveLoanPeriod,
    updateLoanPeriod,
    getNotifications
}