const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication is required.' })
  }

  try {
    req.userId = jwt.verify(authorization.slice(7), process.env.JWT_SECRET).userId
    next()
  } catch {
    return res.status(401).json({ message: 'Your session is invalid or has expired.' })
  }
}

module.exports = requireAuth
