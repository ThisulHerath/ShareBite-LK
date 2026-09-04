const express = require('express')
const { changePassword, deleteAccount, getCurrentUser, login, register } = require('../controllers/authController')
const requireAuth = require('../middleware/authMiddleware')

const router = express.Router()
router.post('/register', register)
router.post('/login', login)
router.get('/me', requireAuth, getCurrentUser)
router.patch('/password', requireAuth, changePassword)
router.delete('/account', requireAuth, deleteAccount)
module.exports = router
