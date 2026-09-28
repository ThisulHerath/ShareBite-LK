require('dotenv').config()

const cors = require('cors')
const express = require('express')

const connectDatabase = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const listingRoutes = require('./routes/listingRoutes')

const app = express()

const allowedOrigins = (process.env.CLIENT_URL || '').split(',').map((item) => item.trim()).filter(Boolean)
app.use(cors({
  origin(origin, callback) {
    if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('This origin is not allowed by CORS.'))
  },
  credentials: true,
}))

// Parse JSON request body
app.use(express.json({ limit: '100kb' }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    message: 'API is running.',
  })
})

// Authentication routes
app.use('/api/auth', authRoutes)

// Food listing routes
app.use('/api/listings', listingRoutes)

// Error handler
app.use((error, req, res, next) => {
  console.error(error)

  res.status(500).json({
    message: 'Something went wrong. Please try again.',
    ...(process.env.NODE_ENV !== 'production' && {
      error: error.message,
    }),
  })
})

// Server
const port = process.env.PORT || 5000

connectDatabase()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
