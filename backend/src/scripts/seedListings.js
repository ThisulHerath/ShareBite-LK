require('dotenv').config()

const mongoose = require('mongoose')
const Listing = require('../models/Listing')

const hoursFromNow = (hours) => new Date(Date.now() + hours * 60 * 60 * 1000)

const listings = [
  {
    title: 'Home-style rice & curry meal packs',
    description: 'Freshly prepared vegetarian rice, dhal curry, seasonal vegetable curry, and sambol. Packed safely after the lunch service.',
    category: 'Meals',
    portions: 18,
    district: 'Colombo',
    pickupAddress: 'Flower Road, Colombo 07',
    contactPhone: '+94112345678',
    availableUntil: hoursFromNow(4),
  },
  {
    title: 'Fresh bakery favourites',
    description: 'Same-day bread, vegetable buns, fish buns, and a small selection of pastries from our evening counter.',
    category: 'Bakery',
    portions: 24,
    district: 'Kandy',
    pickupAddress: 'Dalada Veediya, Kandy',
    contactPhone: '+94812234567',
    availableUntil: hoursFromNow(5),
  },
  {
    title: 'Tropical fruit sharing box',
    description: 'A mix of ripe bananas, papaya, pineapple, and seasonal fruit that is ready to enjoy today.',
    category: 'Produce',
    portions: 15,
    district: 'Galle',
    pickupAddress: 'Lighthouse Street, Galle Fort',
    contactPhone: '+94912234567',
    availableUntil: hoursFromNow(6),
  },
  {
    title: 'Catering chicken biryani portions',
    description: 'Unserved biryani portions from a catered event, packed for quick collection while still fresh.',
    category: 'Meals',
    portions: 30,
    district: 'Jaffna',
    pickupAddress: 'Hospital Road, Jaffna',
    contactPhone: '+94212234567',
    availableUntil: hoursFromNow(3),
  },
  {
    title: 'Garden vegetable bundle',
    description: 'Washed beans, pumpkin, leafy greens, carrots, and herbs from today’s local market delivery.',
    category: 'Produce',
    portions: 20,
    district: 'Matara',
    pickupAddress: 'Anagarika Dharmapala Mawatha, Matara',
    contactPhone: '+94412234567',
    availableUntil: hoursFromNow(8),
  },
  {
    title: 'Tea-time short eats selection',
    description: 'Fresh vegetable roti, egg rolls, cutlets, and savoury pastries prepared for this afternoon.',
    category: 'Bakery',
    portions: 16,
    district: 'Negombo',
    pickupAddress: 'Main Street, Negombo',
    contactPhone: '+94312234567',
    availableUntil: hoursFromNow(4.5),
  },
]

async function seedListings() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing.')
  await mongoose.connect(process.env.MONGODB_URI)
  await Listing.deleteMany({})
  await Listing.insertMany(listings)
  console.log(`Replaced listings with ${listings.length} fresh sample listings.`)
  await mongoose.disconnect()
}

seedListings().catch(async (error) => {
  console.error(error)
  await mongoose.disconnect()
  process.exit(1)
})

