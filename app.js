require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

const errorMiddleware = require('./middleware/error.middleware')
const mainRoute = require('./route/index.route')

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true  
}))
app.use(cookieParser())
app.use(express.json())

// API routes
app.use('/api', mainRoute)

// error handler
app.use(errorMiddleware)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})