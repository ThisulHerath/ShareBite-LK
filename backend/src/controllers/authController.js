const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const createToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
const userPayload = (user, token) => ({ token, user: { id: user._id, name: user.name, email: user.email } })

const register = async (req, res, next) => {
  try {
    const name = req.body.name?.trim()
    const email = req.body.email?.trim().toLowerCase()
    const { password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    if (await User.exists({ email })) return res.status(409).json({ message: 'An account with that email already exists.' })
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) })
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
    const user = await User.findById(req.userId).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found.' })
    return res.json({ user })
  } catch (error) { next(error) }
}

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new passwords are required.' })
    if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters.' })

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
    await Promise.all([
      Listing.deleteMany({ sharedBy: req.userId }),
      Listing.updateMany({ reservedBy: req.userId }, { $set: { reservedBy: null, status: 'available' } }),
      User.deleteOne({ _id: req.userId }),
    ])
    return res.json({ message: 'Account deleted successfully.' })
  } catch (error) { next(error) }
}

module.exports = { changePassword, deleteAccount, getCurrentUser, login, register }
