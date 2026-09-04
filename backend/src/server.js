require('dotenv').config()
const cors = require('cors')
const express = require('express')
const connectDatabase = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const listingRoutes = require('./routes/listingRoutes')

const app = express()
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')
app.use(cors({ origin: allowedOrigins }))
app.use(express.json())
app.get('/api/health', (req, res) => res.json({ message: 'API is running.' }))
app.use('/api/auth', authRoutes)
app.use('/api/listings', listingRoutes)
app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({
    message: 'Something went wrong. Please try again.',
    ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
  })
})

const port = process.env.PORT || 5000
connectDatabase()
  .then(() => app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`)))
  .catch((error) => { console.error(error.message); process.exit(1) })
