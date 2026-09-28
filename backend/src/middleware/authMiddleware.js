const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireAuth = async (req, res, next) => {
  const authorization = req.headers.authorization
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication is required.' })
  }

  try {
    const { userId } = jwt.verify(authorization.slice(7), process.env.JWT_SECRET)
    const user = await User.findById(userId).select('-password')
    if (!user) return res.status(401).json({ message: 'Your account no longer exists.' })
    req.userId = userId
    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Your session is invalid or has expired.' })
  }
}

const requireRole = (...roles) => (req, res, next) => {
  const role = req.user?.role || 'recipient'
  if (!roles.includes(role)) {
    return res.status(403).json({ message: 'Your account role does not have permission to do this.' })
  }
  next()
}

module.exports = requireAuth
module.exports.requireRole = requireRole
