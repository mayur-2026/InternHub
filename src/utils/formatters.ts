/**
 * Date and time formatting helpers using standard Intl.DateTimeFormat
 */

const standardDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
})

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
})

/**
 * Returns formatted date string: e.g. "Nov 3, 2026"
 */
export function formatDate(date: string | number | Date = new Date()): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return isNaN(d.getTime()) ? 'Recently' : standardDateFormatter.format(d)
}

/**
 * Returns formatted timestamp: e.g. "Nov 3, 2026 • 11:30 AM"
 */
export function formatTimestamp(date: string | number | Date = new Date()): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  if (isNaN(d.getTime())) return 'Recently'
  return `${standardDateFormatter.format(d)} • ${timeFormatter.format(d)}`
}

/**
 * Returns formatted month and year: e.g. "Nov 2026"
 */
export function formatMonthYear(date: string | number | Date = new Date()): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return isNaN(d.getTime()) ? 'Recently' : monthYearFormatter.format(d)
}

/**
 * Formats duration in minutes to readable hours and minutes string
 * e.g. 155 -> "2 hrs 35 mins", 45 -> "45 mins"
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} hrs ${remainingMinutes} mins`
  }
  if (hours > 0) {
    return `${hours} hrs`
  }
  return `${remainingMinutes} mins`
}

