const Listing = require('../models/Listing')

const categories = ['Meals', 'Bakery', 'Produce', 'Other']
const statuses = ['available', 'reserved']

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const sampleListings = () => {
  const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  return [
    { title: 'Fresh bread and pastries', description: 'Safe, same-day bakery items available after the afternoon rush.', category: 'Bakery', portions: 18, district: 'Colombo', pickupAddress: 'Flower Road, Colombo 07', contactPhone: '+94112345678', availableUntil: daysFromNow(2) },
    { title: 'Rice and curry meal packs', description: 'Vegetarian meal packs prepared today and kept safely for pickup.', category: 'Meals', portions: 12, district: 'Kandy', pickupAddress: 'Peradeniya Road, Kandy', contactPhone: '+94812345678', availableUntil: daysFromNow(2) },
    { title: 'Seasonal fruit and vegetables', description: 'Clean surplus produce including bananas, beans, and leafy greens.', category: 'Produce', portions: 25, district: 'Galle', pickupAddress: 'Hirimbura Road, Galle', contactPhone: '+94912345678', availableUntil: daysFromNow(3) },
    { title: 'Catering rice portions', description: 'Unserved catering portions from a daytime event, ready for collection.', category: 'Meals', portions: 30, district: 'Jaffna', pickupAddress: 'Hospital Road, Jaffna', contactPhone: '+94212345678', availableUntil: daysFromNow(2) },
  ]
}

const validateListing = (body) => {
  const listing = {
    title: typeof body.title === 'string' ? body.title.trim() : '',
    description: typeof body.description === 'string' ? body.description.trim() : '',
    category: typeof body.category === 'string' ? body.category.trim() : '',
    portions: body.portions,
    district: typeof body.district === 'string' ? body.district.trim() : '',
    pickupAddress: typeof body.pickupAddress === 'string' ? body.pickupAddress.trim() : '',
    contactPhone: typeof body.contactPhone === 'string' ? body.contactPhone.trim() : '',
    availableUntil: body.availableUntil,
  }

  if (listing.title.length < 3 || listing.title.length > 100) return { message: 'Title must be between 3 and 100 characters.' }
  if (listing.description.length < 10 || listing.description.length > 500) return { message: 'Description must be between 10 and 500 characters.' }
  if (!categories.includes(listing.category)) return { message: 'Category must be one of: Meals, Bakery, Produce, or Other.' }
  if (!Number.isInteger(listing.portions) || listing.portions < 1 || listing.portions > 500) return { message: 'Portions must be a whole number between 1 and 500.' }
  if (!listing.district) return { message: 'District is required.' }
  if (listing.pickupAddress.length < 5 || listing.pickupAddress.length > 200) return { message: 'Pickup address must be between 5 and 200 characters.' }
  if (!/^\+?[0-9\s-]{9,15}$/.test(listing.contactPhone)) return { message: 'Enter a valid phone number (9–15 digits).' }
  const availableUntil = new Date(listing.availableUntil)
  if (Number.isNaN(availableUntil.getTime()) || availableUntil <= new Date()) return { message: 'Available until must be a future date and time.' }

  return { listing: { ...listing, availableUntil } }
}

const getListings = async (req, res, next) => {
  try {
    const status = req.query.status || 'available'
    if (!statuses.includes(status)) return res.status(400).json({ message: 'Status must be available or reserved.' })

    if (await Listing.estimatedDocumentCount() === 0) await Listing.insertMany(sampleListings())

    const filter = { status }
    if (req.query.district) filter.district = new RegExp(`^${escapeRegex(req.query.district.trim())}$`, 'i')
    if (req.query.category) {
      const category = req.query.category.trim()
      if (!categories.includes(category)) return res.status(400).json({ message: 'Category must be one of: Meals, Bakery, Produce, or Other.' })
      filter.category = category
    }
    if (req.query.search?.trim()) {
      const search = new RegExp(escapeRegex(req.query.search.trim()), 'i')
      filter.$or = [{ title: search }, { description: search }]
    }

    const listings = await Listing.find(filter).sort({ createdAt: -1 })
    return res.json({ listings })
  } catch (error) { next(error) }
}

const createListing = async (req, res, next) => {
  try {
    const { listing, message } = validateListing(req.body)
    if (message) return res.status(400).json({ message })
    const createdListing = await Listing.create({ ...listing, status: 'available', sharedBy: req.userId })
    return res.status(201).json({ listing: createdListing })
  } catch (error) { next(error) }
}

const getMyListings = async (req, res, next) => {
  try {
    const [shared, reserved] = await Promise.all([
      Listing.find({ sharedBy: req.userId }).sort({ createdAt: -1 }),
      Listing.find({ reservedBy: req.userId }).sort({ createdAt: -1 }),
    ])
    return res.json({ shared, reserved })
  } catch (error) { next(error) }
}

const reserveListing = async (req, res, next) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, status: 'available' },
      { status: 'reserved', reservedBy: req.userId },
      { new: true },
    )
    if (!listing) {
      if (await Listing.exists({ _id: req.params.id })) {
        return res.status(409).json({ message: 'Sorry, this listing has already been reserved.' })
      }
      return res.status(404).json({ message: 'Listing not found.' })
    }
    return res.json({ listing })
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ message: 'Listing not found.' })
    return next(error)
  }
}

module.exports = { createListing, getListings, getMyListings, reserveListing }
