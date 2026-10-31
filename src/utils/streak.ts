/**
 * InternHub Learning Streak & Activity Tracking Engine
 *
 * Production-grade consecutive day streak calculator with:
 * - Timezone awareness (defaults to Asia/Kolkata / client timezone)
 * - Calendar day stepping across month/year and leap-year boundaries
 * - Single-day deduplication (multiple learning actions on one day count as 1 active day)
 * - Active grace window (if user has not studied today, yesterday's streak is preserved until midnight)
 * - Expiration after missed day (if neither today nor yesterday had qualifying activity, streak is 0)
 * - Historical longest streak computation
 */

export interface StreakResult {
  currentStreak: number
  longestStreak: number
  activeDaysCount: number
  hasActivityToday: boolean
  lastActiveDate: string | null
  distinctDates: string[]
}

export interface StreakOptions {
  referenceDate?: Date | string | number
  timeZone?: string
}

/**
 * Resolves the active user timezone, prioritizing Asia/Kolkata if resolved timezone is UTC or unknown.
 */
export function getUserTimeZone(): string {
  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (resolved && resolved !== 'UTC') {
      return resolved
    }
    return 'Asia/Kolkata'
  } catch {
    return 'Asia/Kolkata'
  }
}

/**
 * Formats any Date, ISO string, or timestamp into a YYYY-MM-DD calendar date in the target timezone.
 * Uses the Canadian locale ('en-CA') which strictly formats dates as ISO 8601 YYYY-MM-DD.
 */
export function formatDateInTimezone(
  dateInput: Date | string | number | null | undefined,
  timeZone: string = getUserTimeZone()
): string | null {
  if (!dateInput) return null

  try {
    const date =
      typeof dateInput === 'string' || typeof dateInput === 'number'
        ? new Date(dateInput)
        : dateInput

    if (!date || isNaN(date.getTime())) {
      return null
    }

    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

    return formatter.format(date)
  } catch (err) {
    console.warn('formatDateInTimezone warning:', err)
    return null
  }
}

/**
 * Returns the YYYY-MM-DD calendar day immediately preceding the given date string.
 * Uses Date.UTC midday to safely step across month, year, and daylight savings boundaries.
 */
export function getPreviousDateString(dateStr: string): string {
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid date string format: ${dateStr}. Expected YYYY-MM-DD.`)
  }
  const [year, month, day] = parts
  const prevDate = new Date(Date.UTC(year, month - 1, day - 1, 12, 0, 0))
  return prevDate.toISOString().slice(0, 10)
}

/**
 * Returns the YYYY-MM-DD calendar day immediately following the given date string.
 */
export function getNextDateString(dateStr: string): string {
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid date string format: ${dateStr}. Expected YYYY-MM-DD.`)
  }
  const [year, month, day] = parts
  const nextDate = new Date(Date.UTC(year, month - 1, day + 1, 12, 0, 0))
  return nextDate.toISOString().slice(0, 10)
}

/**
 * Calculates current learning streak from an array of activity timestamps.
 *
 * Rules:
 * - If user has completed activity today -> streak counts consecutive days ending today.
 * - If user has not completed activity today, but DID yesterday -> streak is preserved from yesterday (grace window).
 * - If user missed yesterday and today -> streak is 0.
 * - Multiple activities on the same day only count once.
 */
export function calculateLearningStreak(
  activityTimestamps: (string | Date | number | null | undefined)[],
  options?: StreakOptions
): StreakResult {
  const timeZone = options?.timeZone || getUserTimeZone()
  const refDate = options?.referenceDate !== undefined ? options.referenceDate : new Date()

  // 1. Collect all distinct valid calendar dates (YYYY-MM-DD)
  const dateSet = new Set<string>()
  for (const item of activityTimestamps) {
    if (!item) continue
    const formatted = formatDateInTimezone(item, timeZone)
    if (formatted) {
      dateSet.add(formatted)
    }
  }

  const distinctDates = Array.from(dateSet).sort().reverse()
  const activeDaysCount = distinctDates.length
  const lastActiveDate = distinctDates[0] || null

  // 2. Identify 'today' and 'yesterday' relative to referenceDate in the target timezone
  const todayStr = formatDateInTimezone(refDate, timeZone)
  if (!todayStr) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      activeDaysCount,
      hasActivityToday: false,
      lastActiveDate,
      distinctDates,
    }
  }

  const yesterdayStr = getPreviousDateString(todayStr)
  const hasActivityToday = dateSet.has(todayStr)
  const hasActivityYesterday = dateSet.has(yesterdayStr)

  // 3. Current streak calculation
  let currentStreak = 0

  if (hasActivityToday) {
    // User was active today -> count backwards from today
    currentStreak = 1
    let checkDate = getPreviousDateString(todayStr)
    while (dateSet.has(checkDate)) {
      currentStreak += 1
      checkDate = getPreviousDateString(checkDate)
    }
  } else if (hasActivityYesterday) {
    // User has not completed today's lesson yet, but completed yesterday's -> grace window active
    currentStreak = 1
    let checkDate = getPreviousDateString(yesterdayStr)
    while (dateSet.has(checkDate)) {
      currentStreak += 1
      checkDate = getPreviousDateString(checkDate)
    }
  }

  // 4. Compute longest historical streak
  let longestStreak = 0
  for (const date of distinctDates) {
    let chain = 1
    let checkDate = getPreviousDateString(date)
    while (dateSet.has(checkDate)) {
      chain += 1
      checkDate = getPreviousDateString(checkDate)
    }
    if (chain > longestStreak) {
      longestStreak = chain
    }
  }

  return {
    currentStreak,
    longestStreak,
    activeDaysCount,
    hasActivityToday,
    lastActiveDate,
    distinctDates,
  }
}
