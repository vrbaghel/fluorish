/**
 * Streak management utilities
 * Tracks consecutive days with completed tasks
 */

const STREAK_STORAGE_KEY = 'fluorish:careStreak'
const LAST_COMPLETION_DATE_KEY = 'fluorish:lastCompletionDate'

export type StreakData = {
  streak: number
  lastCompletionDate: string | null // ISO date string
}

/**
 * Get current streak data from localStorage
 */
export function getStreakData(): StreakData {
  const stored = localStorage.getItem(STREAK_STORAGE_KEY)
  const lastDate = localStorage.getItem(LAST_COMPLETION_DATE_KEY)
  
  if (!stored) {
    return { streak: 0, lastCompletionDate: null }
  }

  return {
    streak: parseInt(stored, 10) || 0,
    lastCompletionDate: lastDate,
  }
}

/**
 * Update streak when tasks are completed today
 * Returns the new streak count
 */
export function updateStreak(): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]

  const streakData = getStreakData()
  const lastDate = streakData.lastCompletionDate

  // If we already completed tasks today, don't update
  if (lastDate === todayStr) {
    return streakData.streak
  }

  // If last completion was yesterday, increment streak
  if (lastDate) {
    const lastCompletion = new Date(lastDate)
    lastCompletion.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (lastCompletion.getTime() === yesterday.getTime()) {
      // Consecutive day - increment streak
      const newStreak = streakData.streak + 1
      localStorage.setItem(STREAK_STORAGE_KEY, newStreak.toString())
      localStorage.setItem(LAST_COMPLETION_DATE_KEY, todayStr)
      return newStreak
    } else if (lastCompletion.getTime() < yesterday.getTime()) {
      // Streak broken - reset to 1
      localStorage.setItem(STREAK_STORAGE_KEY, '1')
      localStorage.setItem(LAST_COMPLETION_DATE_KEY, todayStr)
      return 1
    }
  }

  // First time completing tasks - start streak at 1
  localStorage.setItem(STREAK_STORAGE_KEY, '1')
  localStorage.setItem(LAST_COMPLETION_DATE_KEY, todayStr)
  return 1
}

/**
 * Calculate current streak (checking if streak should be maintained)
 * This should be called on app load to verify streak is still valid
 */
export function calculateCurrentStreak(): number {
  const streakData = getStreakData()
  
  if (!streakData.lastCompletionDate) {
    return 0
  }

  const lastDate = new Date(streakData.lastCompletionDate)
  lastDate.setHours(0, 0, 0, 0)
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // If last completion was today or yesterday, streak is still valid
  if (lastDate.getTime() === today.getTime() || lastDate.getTime() === yesterday.getTime()) {
    return streakData.streak
  }

  // Streak broken - reset
  localStorage.setItem(STREAK_STORAGE_KEY, '0')
  localStorage.setItem(LAST_COMPLETION_DATE_KEY, '')
  return 0
}

