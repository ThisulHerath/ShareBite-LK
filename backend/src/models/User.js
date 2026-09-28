const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['donor', 'recipient', 'admin'],
      default: 'recipient',
      index: true,
    },
    district: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
)

module.exports = mongoose.model('User', userSchema)
