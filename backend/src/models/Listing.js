const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 500 },
    category: { type: String, required: true, enum: ['Meals', 'Bakery', 'Produce', 'Other'] },
    portions: { type: Number, required: true, min: 1, max: 500 },
    district: { type: String, required: true, trim: true },
    pickupAddress: { type: String, required: true, trim: true, minlength: 5, maxlength: 200 },
    contactPhone: { type: String, required: true, trim: true },
    availableUntil: { type: Date, required: true },
    status: { type: String, enum: ['available', 'reserved'], default: 'available' },
    sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Listing', listingSchema)
