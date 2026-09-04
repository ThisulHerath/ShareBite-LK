const express = require('express')
const {
  createListing,
  updateListing,
  deleteListing,
  getListings,
  getMyListings,
  reserveListing,
  cancelReservation,
} = require('../controllers/listingController')
const requireAuth = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', getListings)
router.get('/mine', requireAuth, getMyListings)
router.post('/', requireAuth, createListing)
router.put('/:id', requireAuth, updateListing)
router.delete('/:id', requireAuth, deleteListing)
router.patch('/:id/reserve', requireAuth, reserveListing)
router.patch('/:id/cancel-reservation', requireAuth, cancelReservation)

module.exports = router
