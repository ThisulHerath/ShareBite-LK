const mongoose = require('mongoose')

const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing. Add it to your .env file.')
  }

  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')
}

module.exports = connectDatabase
