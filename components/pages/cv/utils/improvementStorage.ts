/**
 * Utilities for storing and managing CV improvement descriptions in localStorage
 */

export interface ImprovementDescription {
  userDescription: string
  selected: boolean
  usedInCV: boolean
  timestamp: number
}

export interface PositionImprovements {
  timestamp: number
  positionTitle: string
  companyName: string
  positionHash: string
  improvements: { [improvementDescription: string]: ImprovementDescription }
}

const STORAGE_KEY = 'cv-improvements'

/**
 * Generate a hash for a position to use as storage key
 */
export function generatePositionHash(positionDetails: string, companyName?: string): string {
  const content = `${positionDetails}-${companyName || ''}`
  // Simple hash function
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString()
}

/**
 * Get all stored position improvements
 */
export function getAllPositionImprovements(): { [positionHash: string]: PositionImprovements } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Error reading improvements from localStorage:', error)
    return {}
  }
}

/**
 * Get improvements for a specific position
 */
export function getPositionImprovements(positionHash: string): PositionImprovements | null {
  const allImprovements = getAllPositionImprovements()
  return allImprovements[positionHash] || null
}

/**
 * Save improvements for a position
 */
export function savePositionImprovements(
  positionHash: string,
  positionDetails: string,
  companyName: string,
  improvements: { [improvementDescription: string]: ImprovementDescription }
): void {
  try {
    const allImprovements = getAllPositionImprovements()

    allImprovements[positionHash] = {
      timestamp: Date.now(),
      positionTitle: extractPositionTitle(positionDetails),
      companyName,
      positionHash,
      improvements
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allImprovements))
  } catch (error) {
    console.error('Error saving improvements to localStorage:', error)
  }
}

/**
 * Update a specific improvement description
 */
export function updateImprovementDescription(
  positionHash: string,
  improvementKey: string,
  userDescription: string,
  selected: boolean = true
): void {
  try {
    const allImprovements = getAllPositionImprovements()

    if (!allImprovements[positionHash]) {
      return
    }

    if (!allImprovements[positionHash].improvements[improvementKey]) {
      allImprovements[positionHash].improvements[improvementKey] = {
        userDescription: '',
        selected: false,
        usedInCV: false,
        timestamp: Date.now()
      }
    }

    allImprovements[positionHash].improvements[improvementKey] = {
      ...allImprovements[positionHash].improvements[improvementKey],
      userDescription,
      selected,
      timestamp: Date.now()
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allImprovements))
  } catch (error) {
    console.error('Error updating improvement description:', error)
  }
}

/**
 * Mark improvements as used in CV
 */
export function markImprovementsAsUsed(
  positionHash: string,
  improvementKeys: string[]
): void {
  try {
    const allImprovements = getAllPositionImprovements()

    if (!allImprovements[positionHash]) {
      return
    }

    improvementKeys.forEach(key => {
      if (allImprovements[positionHash].improvements[key]) {
        allImprovements[positionHash].improvements[key].usedInCV = true
      }
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allImprovements))
  } catch (error) {
    console.error('Error marking improvements as used:', error)
  }
}

/**
 * Get selected improvements with descriptions for a position
 */
export function getSelectedImprovementsWithDescriptions(positionHash: string): Array<{
  improvement: string
  description: string
}> {
  const positionData = getPositionImprovements(positionHash)
  if (!positionData) return []

  return Object.entries(positionData.improvements)
    .filter(([_, data]) => data.selected && data.userDescription.trim().length > 0)
    .map(([improvement, data]) => ({
      improvement,
      description: data.userDescription.trim()
    }))
}

/**
 * Clean up old position data (older than 30 days)
 */
export function cleanupOldPositions(): void {
  try {
    const allImprovements = getAllPositionImprovements()
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)

    Object.keys(allImprovements).forEach(positionHash => {
      if (allImprovements[positionHash].timestamp < thirtyDaysAgo) {
        delete allImprovements[positionHash]
      }
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allImprovements))
  } catch (error) {
    console.error('Error cleaning up old positions:', error)
  }
}

/**
 * Extract a position title from position details (first line or first sentence)
 */
function extractPositionTitle(positionDetails: string): string {
  const lines = positionDetails.split('\n')
  const firstLine = lines[0]?.trim()

  if (firstLine && firstLine.length < 100) {
    return firstLine
  }

  // Try to get first sentence
  const sentences = positionDetails.split('.')
  const firstSentence = sentences[0]?.trim()

  if (firstSentence && firstSentence.length < 100) {
    return firstSentence
  }

  // Fallback to truncated version
  return positionDetails.substring(0, 80) + '...'
}