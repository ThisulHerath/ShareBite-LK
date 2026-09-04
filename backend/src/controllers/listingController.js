const Listing = require('../models/Listing')

const categories = ['Meals', 'Bakery', 'Produce', 'Other']
const statuses = ['available', 'reserved']

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const sampleListings = () => {
  const hoursFromNow = (hours) => new Date(Date.now() + hours * 60 * 60 * 1000)
  return [
    { title: 'Fresh bread and pastries', description: 'Safe, same-day bakery items available after the afternoon rush.', category: 'Bakery', portions: 18, totalPortions: 18, remainingPortions: 18, district: 'Colombo', pickupAddress: 'Flower Road, Colombo 07', contactPhone: '+94112345678', availableUntil: hoursFromNow(5) },
    { title: 'Rice and curry meal packs', description: 'Vegetarian meal packs prepared today and kept safely for pickup.', category: 'Meals', portions: 12, totalPortions: 12, remainingPortions: 12, district: 'Kandy', pickupAddress: 'Peradeniya Road, Kandy', contactPhone: '+94812345678', availableUntil: hoursFromNow(6) },
    { title: 'Seasonal fruit and vegetables', description: 'Clean surplus produce including bananas, beans, and leafy greens.', category: 'Produce', portions: 25, totalPortions: 25, remainingPortions: 25, district: 'Galle', pickupAddress: 'Hirimbura Road, Galle', contactPhone: '+94912345678', availableUntil: hoursFromNow(8) },
    { title: 'Catering rice portions', description: 'Unserved catering portions from a daytime event, ready for collection.', category: 'Meals', portions: 30, totalPortions: 30, remainingPortions: 30, district: 'Jaffna', pickupAddress: 'Hospital Road, Jaffna', contactPhone: '+94212345678', availableUntil: hoursFromNow(4) },
  ]
}

const validateListing = (body) => {
  const listing = {
    title: typeof body.title === 'string' ? body.title.trim() : '',
    description: typeof body.description === 'string' ? body.description.trim() : '',
    category: typeof body.category === 'string' ? body.category.trim() : '',
    portions: Number(body.portions),
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
  const now = new Date()
  if (Number.isNaN(availableUntil.getTime()) || availableUntil <= now) {
    return { message: 'Available until must be a future time today.' }
  }

  return { listing: { ...listing, availableUntil } }
}

const formatListingDoc = (doc) => {
  const obj = doc.toObject ? doc.toObject() : { ...doc }
  const total = obj.totalPortions ?? obj.portions
  const remaining = obj.remainingPortions ?? (obj.status === 'reserved' ? 0 : obj.portions)
  return {
    ...obj,
    totalPortions: total,
    remainingPortions: remaining,
    portions: remaining,
  }
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

    const docs = await Listing.find(filter).sort({ createdAt: -1 })
    const listings = docs.map(formatListingDoc)
    return res.json({ listings })
  } catch (error) { next(error) }
}

const createListing = async (req, res, next) => {
  try {
    const { listing, message } = validateListing(req.body)
    if (message) return res.status(400).json({ message })
    const createdListing = await Listing.create({
      ...listing,
      totalPortions: listing.portions,
      remainingPortions: listing.portions,
      reservations: [],
      status: 'available',
      sharedBy: req.userId,
    })
    return res.status(201).json({ listing: formatListingDoc(createdListing) })
  } catch (error) { next(error) }
}

const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return res.status(404).json({ message: 'Listing not found.' })
    if (listing.sharedBy?.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to edit this listing.' })
    }

    const { listing: validated, message } = validateListing(req.body)
    if (message) return res.status(400).json({ message })

    // Calculate portions taking existing reservations into account
    const reservedCount = (listing.reservations || []).reduce((sum, r) => sum + (r.portions || 0), 0)
    const newTotal = validated.portions

    if (newTotal < reservedCount) {
      return res.status(400).json({
        message: `Cannot reduce total portions to ${newTotal} because ${reservedCount} portion(s) are already reserved.`,
      })
    }

    listing.title = validated.title
    listing.description = validated.description
    listing.category = validated.category
    listing.totalPortions = newTotal
    listing.remainingPortions = newTotal - reservedCount
    listing.portions = listing.remainingPortions
    listing.district = validated.district
    listing.pickupAddress = validated.pickupAddress
    listing.contactPhone = validated.contactPhone
    listing.availableUntil = validated.availableUntil
    listing.status = listing.remainingPortions === 0 ? 'reserved' : 'available'

    await listing.save()
    return res.json({ listing: formatListingDoc(listing) })
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ message: 'Listing not found.' })
    return next(error)
  }
}

const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return res.status(404).json({ message: 'Listing not found.' })
    if (listing.sharedBy?.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this listing.' })
    }

    await Listing.deleteOne({ _id: req.params.id })
    return res.json({ message: 'Listing deleted successfully.' })
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ message: 'Listing not found.' })
    return next(error)
  }
}

const getMyListings = async (req, res, next) => {
  try {
    const [sharedDocs, reservedDocs] = await Promise.all([
      Listing.find({ sharedBy: req.userId }).sort({ createdAt: -1 }),
      Listing.find({
        $or: [
          { 'reservations.user': req.userId },
          { reservedBy: req.userId },
        ],
      }).sort({ createdAt: -1 }),
    ])

    const shared = sharedDocs.map(formatListingDoc)
    const reserved = reservedDocs.map((doc) => {
      const formatted = formatListingDoc(doc)
      let userReservedCount = 0
      if (Array.isArray(doc.reservations) && doc.reservations.length > 0) {
        userReservedCount = doc.reservations
          .filter((r) => r.user?.toString() === req.userId)
          .reduce((sum, r) => sum + (r.portions || 0), 0)
      }
      if (userReservedCount === 0 && doc.reservedBy?.toString() === req.userId) {
        userReservedCount = doc.totalPortions || doc.portions
      }
      return {
        ...formatted,
        myReservedPortions: userReservedCount > 0 ? userReservedCount : formatted.portions,
      }
    })

    return res.json({ shared, reserved })
  } catch (error) { next(error) }
}

const reserveListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return res.status(404).json({ message: 'Listing not found.' })

    const now = new Date()
    if (new Date(listing.availableUntil) <= now) {
      return res.status(400).json({ message: 'This food listing has already expired.' })
    }

    if (listing.totalPortions == null) listing.totalPortions = listing.portions
    if (listing.remainingPortions == null) listing.remainingPortions = listing.status === 'reserved' ? 0 : listing.portions

    if (listing.remainingPortions <= 0 || listing.status === 'reserved') {
      return res.status(409).json({ message: 'Sorry, this listing has already been fully reserved.' })
    }

    const requestedPortions = Number(req.body.portions) > 0 ? Math.floor(Number(req.body.portions)) : 1
    if (requestedPortions > listing.remainingPortions) {
      return res.status(400).json({
        message: `Only ${listing.remainingPortions} portion${listing.remainingPortions === 1 ? '' : 's'} remaining.`,
      })
    }

    listing.remainingPortions -= requestedPortions
    listing.portions = listing.remainingPortions
    if (!Array.isArray(listing.reservations)) listing.reservations = []
    listing.reservations.push({
      user: req.userId,
      portions: requestedPortions,
      reservedAt: new Date(),
    })
    listing.reservedBy = req.userId

    if (listing.remainingPortions === 0) {
      listing.status = 'reserved'
    } else {
      listing.status = 'available'
    }

    await listing.save()
    return res.json({ listing: formatListingDoc(listing), reservedPortions: requestedPortions })
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ message: 'Listing not found.' })
    return next(error)
  }
}

const cancelReservation = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return res.status(404).json({ message: 'Listing not found.' })

    // Check if user has an active reservation
    let resIndex = -1
    if (Array.isArray(listing.reservations)) {
      resIndex = listing.reservations.findIndex((r) => r.user?.toString() === req.userId)
    }

    const legacyReserved = listing.reservedBy?.toString() === req.userId

    if (resIndex === -1 && !legacyReserved) {
      return res.status(400).json({ message: 'No active reservation found for this listing.' })
    }

    // Time check: must be >= 1 hour before availableUntil
    const now = Date.now()
    const expiryTime = new Date(listing.availableUntil).getTime()
    const timeRemainingMs = expiryTime - now
    const oneHourMs = 60 * 60 * 1000

    if (timeRemainingMs < oneHourMs) {
      return res.status(400).json({
        message: 'Reservations cannot be cancelled within the last hour before the collection deadline.',
      })
    }

    // Return portions
    let restoredPortions = 0
    if (resIndex !== -1) {
      restoredPortions = listing.reservations[resIndex].portions
      listing.reservations.splice(resIndex, 1)
    } else if (legacyReserved) {
      restoredPortions = listing.totalPortions || listing.portions
      listing.reservedBy = null
    }

    if (listing.totalPortions == null) listing.totalPortions = listing.portions
    if (listing.remainingPortions == null) listing.remainingPortions = 0

    listing.remainingPortions = Math.min(listing.totalPortions, (listing.remainingPortions || 0) + restoredPortions)
    listing.portions = listing.remainingPortions
    listing.status = 'available'

    if (listing.reservations.length === 0) {
      listing.reservedBy = null
    }

    await listing.save()
    return res.json({ message: 'Reservation cancelled successfully.', listing: formatListingDoc(listing) })
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ message: 'Listing not found.' })
    return next(error)
  }
}

module.exports = {
  createListing,
  updateListing,
  deleteListing,
  getListings,
  getMyListings,
  reserveListing,
  cancelReservation,
}
