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
const { requireRole } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', getListings)
router.get('/mine', requireAuth, getMyListings)
router.post('/', requireAuth, requireRole('donor', 'admin'), createListing)
router.put('/:id', requireAuth, requireRole('donor', 'admin'), updateListing)
router.delete('/:id', requireAuth, requireRole('donor', 'admin'), deleteListing)
router.patch('/:id/reserve', requireAuth, requireRole('recipient', 'admin'), reserveListing)
router.patch('/:id/cancel-reservation', requireAuth, requireRole('recipient', 'admin'), cancelReservation)

module.exports = router
