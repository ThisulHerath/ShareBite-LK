const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const createToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
const districts = ['Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya']
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const strongPassword = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/
const userPayload = (user, token) => ({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || 'recipient',
    district: user.district || '',
    createdAt: user.createdAt,
  },
})

const register = async (req, res, next) => {
  try {
    const name = req.body.name?.trim()
    const email = req.body.email?.trim().toLowerCase()
    const { password } = req.body
    const role = req.body.role === 'donor' ? 'donor' : 'recipient'
    const district = req.body.district?.trim() || ''
    if (!name || !email || !password || !district) return res.status(400).json({ message: 'Name, email, password, and district are required.' })
    if (name.length < 2 || name.length > 60) return res.status(400).json({ message: 'Name must be between 2 and 60 characters.' })
    if (!emailPattern.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' })
    if (!strongPassword.test(password)) return res.status(400).json({ message: 'Password must be 8–72 characters and include a letter and a number.' })
    if (!districts.includes(district)) return res.status(400).json({ message: 'Choose a valid Sri Lankan district.' })
    if (await User.exists({ email })) return res.status(409).json({ message: 'An account with that email already exists.' })
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role, district })
    return res.status(201).json(userPayload(user, createToken(user._id.toString())))
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase()
    const { password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' })
    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Email or password is incorrect.' })
    return res.json(userPayload(user, createToken(user._id.toString())))
  } catch (error) { next(error) }
}

const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user || await User.findById(req.userId).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found.' })
    return res.json({ user: userPayload(user).user })
  } catch (error) { next(error) }
}

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new passwords are required.' })
    if (!strongPassword.test(newPassword)) return res.status(400).json({ message: 'New password must be 8–72 characters and include a letter and a number.' })

    const user = await User.findById(req.userId)
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) return res.status(401).json({ message: 'Current password is incorrect.' })
    user.password = await bcrypt.hash(newPassword, 12)
    await user.save()
    return res.json({ message: 'Password changed successfully.' })
  } catch (error) { next(error) }
}

const deleteAccount = async (req, res, next) => {
  try {
    const { password, confirmation } = req.body
    if (!password || confirmation !== 'DELETE') return res.status(400).json({ message: 'Enter your password and type DELETE to confirm.' })

    const user = await User.findById(req.userId)
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Password is incorrect.' })

    const Listing = require('../models/Listing')
    const listingsWithUserRes = await Listing.find({ 'reservations.user': req.userId })
    for (const item of listingsWithUserRes) {
      const userRes = item.reservations.filter((r) => r.user?.toString() === req.userId)
      const restored = userRes.reduce((sum, r) => sum + (r.portions || 0), 0)
      item.reservations = item.reservations.filter((r) => r.user?.toString() !== req.userId)
      item.remainingPortions = Math.min(item.totalPortions || item.portions, (item.remainingPortions || 0) + restored)
      item.portions = item.remainingPortions
      item.status = 'available'
      if (item.reservations.length === 0) item.reservedBy = null
      await item.save()
    }

    await Promise.all([
      Listing.deleteMany({ sharedBy: req.userId }),
      Listing.updateMany({ reservedBy: req.userId }, { $set: { reservedBy: null, status: 'available' } }),
      User.deleteOne({ _id: req.userId }),
    ])
    return res.json({ message: 'Account deleted successfully.' })
  } catch (error) { next(error) }
}

module.exports = { changePassword, deleteAccount, getCurrentUser, login, register }
