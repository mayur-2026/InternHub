import { describe, it, expect } from 'vitest'
import {
  calculateLearningStreak,
  formatDateInTimezone,
  getPreviousDateString,
  getNextDateString,
} from '../utils/streak'

describe('Learning Streak Calculation & Timezone Precision Engine', () => {
  const IST = 'Asia/Kolkata'

  describe('7-Day Simulated Calendar Sequence (Expected User Behavior)', () => {
    // Day 1: 2026-10-25
    // Day 2: 2026-10-26
    // Day 3: 2026-10-27
    // Day 4: 2026-10-28 (Missed)
    // Day 5: 2026-10-29
    // Day 6: 2026-10-30
    // Day 7: 2026-10-31

    const day1Activity = '2026-10-25T10:00:00Z'
    const day2Activity = '2026-10-26T14:30:00Z'
    const day3Activity = '2026-10-27T14:00:00Z'
    const day5Activity = '2026-10-29T11:15:00Z'
    const day6Activity = '2026-10-30T16:00:00Z'
    const day7Activity = '2026-10-31T09:30:00Z'

    it('Day 1: First activity starts streak at 1', () => {
      const res = calculateLearningStreak([day1Activity], {
        referenceDate: '2026-10-25T12:00:00Z',
        timeZone: IST,
      })
      expect(res.currentStreak).toBe(1)
      expect(res.hasActivityToday).toBe(true)
      expect(res.activeDaysCount).toBe(1)
    })

    it('Day 2: Consecutive activity increments streak to 2', () => {
      const res = calculateLearningStreak([day1Activity, day2Activity], {
        referenceDate: '2026-10-26T16:00:00Z',
        timeZone: IST,
      })
      expect(res.currentStreak).toBe(2)
      expect(res.hasActivityToday).toBe(true)
    })

    it('Day 3, before completing activity: streak remains 2 (grace period)', () => {
      const res = calculateLearningStreak([day1Activity, day2Activity], {
        referenceDate: '2026-10-27T08:00:00Z', // Morning of Day 3 before learning
        timeZone: IST,
      })
      expect(res.currentStreak).toBe(2)
      expect(res.hasActivityToday).toBe(false)
    })

    it('Day 3, after completing activity: streak becomes 3', () => {
      const res = calculateLearningStreak([day1Activity, day2Activity, day3Activity], {
        referenceDate: '2026-10-27T16:00:00Z',
        timeZone: IST,
      })
      expect(res.currentStreak).toBe(3)
      expect(res.hasActivityToday).toBe(true)
    })

    it('Day 4, morning before learning: streak remains 3 based on Day 3 completion', () => {
      const res = calculateLearningStreak([day1Activity, day2Activity, day3Activity], {
        referenceDate: '2026-10-28T09:00:00Z',
        timeZone: IST,
      })
      expect(res.currentStreak).toBe(3)
      expect(res.hasActivityToday).toBe(false)
    })

    it('Day 5, without Day 4 activity: grace window expired, streak drops to 0', () => {
      // Day 4 had zero activity, now on Day 5
      const res = calculateLearningStreak([day1Activity, day2Activity, day3Activity], {
        referenceDate: '2026-10-29T08:00:00Z', // Day 5 morning
        timeZone: IST,
      })
      expect(res.currentStreak).toBe(0)
      expect(res.longestStreak).toBe(3)
      expect(res.hasActivityToday).toBe(false)
    })

    it('Day 5, after completing activity: streak restarts at 1', () => {
      const res = calculateLearningStreak([day1Activity, day2Activity, day3Activity, day5Activity], {
        referenceDate: '2026-10-29T14:00:00Z',
        timeZone: IST,
      })
      expect(res.currentStreak).toBe(1)
      expect(res.longestStreak).toBe(3)
      expect(res.hasActivityToday).toBe(true)
    })

    it('Day 6 & Day 7: Continuing daily activity reaches streak 3 with longest 3', () => {
      const allActivities = [day1Activity, day2Activity, day3Activity, day5Activity, day6Activity, day7Activity]
      const res = calculateLearningStreak(allActivities, {
        referenceDate: '2026-10-31T12:00:00Z',
        timeZone: IST,
      })
      expect(res.currentStreak).toBe(3)
      expect(res.longestStreak).toBe(3)
      expect(res.activeDaysCount).toBe(6)
    })
  })

  describe('Single-Day Activity Deduplication', () => {
    it('counts multiple activities on the same calendar day as only 1 active day', () => {
      const sameDayActivities = [
        '2026-10-30T09:00:00Z',
        '2026-10-30T11:30:00Z',
        '2026-10-30T14:15:00Z',
        '2026-10-30T18:00:00Z',
      ]
      const res = calculateLearningStreak(sameDayActivities, {
        referenceDate: '2026-10-30T20:00:00Z',
        timeZone: IST,
      })
      expect(res.currentStreak).toBe(1)
      expect(res.activeDaysCount).toBe(1)
      expect(res.distinctDates).toHaveLength(1)
      expect(res.distinctDates[0]).toBe('2026-10-30')
    })
  })

  describe('Timezone Accuracy (Asia/Kolkata vs UTC Boundaries)', () => {
    it('correctly maps 23:45 IST (18:15 UTC) to the local calendar day', () => {
      // 18:15 UTC on Oct 30 is 23:45 IST on Oct 30
      const utcTimestamp = '2026-10-30T18:15:00Z'
      const formatted = formatDateInTimezone(utcTimestamp, IST)
      expect(formatted).toBe('2026-10-30')
    })

    it('correctly maps 00:15 IST (18:45 UTC previous day) to the next local calendar day', () => {
      // 18:45 UTC on Oct 30 is 00:15 IST on Oct 31
      const utcTimestamp = '2026-10-30T18:45:00Z'
      const formatted = formatDateInTimezone(utcTimestamp, IST)
      expect(formatted).toBe('2026-10-31')
    })

    it('preserves streak across the IST midnight boundary', () => {
      const lateNightActivity = '2026-10-30T18:15:00Z' // Oct 30, 23:45 IST
      const postMidnightActivity = '2026-10-30T18:45:00Z' // Oct 31, 00:15 IST (next day in IST!)

      const res = calculateLearningStreak([lateNightActivity, postMidnightActivity], {
        referenceDate: '2026-10-31T06:00:00Z', // Oct 31 morning IST
        timeZone: IST,
      })
      expect(res.currentStreak).toBe(2)
      expect(res.activeDaysCount).toBe(2)
      expect(res.distinctDates).toEqual(['2026-10-31', '2026-10-30'])
    })
  })

  describe('Month, Year, and Leap Year Boundaries', () => {
    it('rolls back calendar dates smoothly across month boundary (Nov 01 -> Oct 31)', () => {
      expect(getPreviousDateString('2026-11-01')).toBe('2026-10-31')
      expect(getNextDateString('2026-10-31')).toBe('2026-11-01')
    })

    it('steps accurately across leap year leap day (Mar 01, 2024 -> Feb 29, 2024)', () => {
      expect(getPreviousDateString('2024-03-01')).toBe('2024-02-29')
      expect(getPreviousDateString('2024-02-29')).toBe('2024-02-28')
    })

    it('steps accurately across non-leap year (Mar 01, 2026 -> Feb 28, 2026)', () => {
      expect(getPreviousDateString('2026-03-01')).toBe('2026-02-28')
    })

    it('steps accurately across year boundary (Jan 01, 2027 -> Dec 31, 2026)', () => {
      expect(getPreviousDateString('2027-01-01')).toBe('2026-12-31')
      expect(getNextDateString('2026-12-31')).toBe('2027-01-01')
    })

    it('calculates continuous streak across year transition', () => {
      const dec30 = '2026-12-30T10:00:00Z'
      const dec31 = '2026-12-31T10:00:00Z'
      const jan01 = '2027-01-01T10:00:00Z'

      const res = calculateLearningStreak([dec30, dec31, jan01], {
        referenceDate: '2027-01-01T14:00:00Z',
        timeZone: IST,
      })
      expect(res.currentStreak).toBe(3)
      expect(res.longestStreak).toBe(3)
    })
  })

  describe('Edge Cases & Resilient Fallbacks', () => {
    it('returns 0 streak for empty activity list without throwing', () => {
      const res = calculateLearningStreak([])
      expect(res.currentStreak).toBe(0)
      expect(res.activeDaysCount).toBe(0)
      expect(res.hasActivityToday).toBe(false)
      expect(res.lastActiveDate).toBeNull()
    })

    it('filters out null, undefined, or invalid timestamp strings gracefully', () => {
      const dirtyData = [null, undefined, 'invalid-date-string', '2026-10-31T10:00:00Z']
      const res = calculateLearningStreak(dirtyData, {
        referenceDate: '2026-10-31T12:00:00Z',
        timeZone: IST,
      })
      expect(res.currentStreak).toBe(1)
      expect(res.activeDaysCount).toBe(1)
    })
  })
})
