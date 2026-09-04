/**
 * Formats the current date in YYYY-MM-DD (local time)
 */
export function getTodayDateString(d = new Date()) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Returns a human-friendly label for today's date
 */
export function getTodayFormattedLabel(d = new Date()) {
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Returns the current time in HH:mm format
 */
export function getCurrentTimeString(d = new Date()) {
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * Combines today's date with a time string (HH:mm) into a Date object or ISO string
 */
export function combineTodayWithTime(timeStr) {
  if (!timeStr) return null
  const [hours, minutes] = timeStr.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

/**
 * Checks if a time string (HH:mm) on today is in the future
 */
export function isTodayTimeInFuture(timeStr) {
  const date = combineTodayWithTime(timeStr)
  if (!date) return false
  return date.getTime() > Date.now()
}

/**
 * Computes remaining time breakdown
 */
export function getRemainingTimeBreakdown(targetDate) {
  const target = new Date(targetDate).getTime()
  const now = Date.now()
  const diffMs = target - now

  if (Number.isNaN(target) || diffMs <= 0) {
    return {
      isExpired: true,
      isLastHour: false,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      text: 'Expired',
      urgency: 'expired', // 'expired' | 'urgent' (<1h) | 'warning' (1-2h) | 'normal' (>2h)
    }
  }

  const totalSeconds = Math.floor(diffMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const isLastHour = diffMs < 60 * 60 * 1000
  const isWarning = diffMs >= 60 * 60 * 1000 && diffMs < 2 * 60 * 60 * 1000

  let text = ''
  if (hours > 0) {
    text = `${hours}h ${minutes}m left`
  } else if (minutes > 0) {
    text = `${minutes}m ${seconds}s left`
  } else {
    text = `${seconds}s left`
  }

  const urgency = isLastHour ? 'urgent' : isWarning ? 'warning' : 'normal'

  return {
    isExpired: false,
    isLastHour,
    hours,
    minutes,
    seconds,
    totalSeconds,
    text,
    urgency,
  }
}
