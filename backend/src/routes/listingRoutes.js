const express = require('express')
const { createListing, getListings, reserveListing } = require('../controllers/listingController')
const requireAuth = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', getListings)
router.post('/', requireAuth, createListing)
router.patch('/:id/reserve', requireAuth, reserveListing)

module.exports = router
