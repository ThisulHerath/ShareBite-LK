const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 500 },
    category: { type: String, required: true, enum: ['Meals', 'Bakery', 'Produce', 'Other'] },
    portions: { type: Number, required: true, min: 1, max: 500 },
    totalPortions: {
      type: Number,
      min: 1,
      max: 500,
      default: function () {
        return this.portions
      },
    },
    remainingPortions: {
      type: Number,
      min: 0,
      max: 500,
      default: function () {
        return this.portions
      },
    },
    reservations: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        portions: { type: Number, required: true, min: 1 },
        reservedAt: { type: Date, default: Date.now },
      },
    ],
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

listingSchema.pre('save', function () {
  if (this.totalPortions == null) this.totalPortions = this.portions
  if (this.remainingPortions == null) this.remainingPortions = this.portions
})

module.exports = mongoose.model('Listing', listingSchema)
