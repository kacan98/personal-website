import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'

export interface ImprovementDescription {
  userDescription: string
  selected: boolean
  usedInCV: boolean
  timestamp: number
  // Auto-fill metadata
  autoFilled?: boolean
  confidence?: number
  matchedFrom?: string
}

export interface PositionImprovements {
  timestamp: number
  positionTitle: string
  companyName: string
  positionHash: string
  improvements: { [improvementDescription: string]: ImprovementDescription }
}

export interface ImprovementDescriptionsState {
  positions: { [positionHash: string]: PositionImprovements }
  currentPositionHash: string
}

const STORAGE_KEY = 'cv-improvements'

// Helper function to load from localStorage
const loadFromStorage = (): { [positionHash: string]: PositionImprovements } => {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Error loading improvements from localStorage:', error)
    return {}
  }
}

// Helper function to save to localStorage
const saveToStorage = (positions: { [positionHash: string]: PositionImprovements }) => {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
  } catch (error) {
    console.error('Error saving improvements to localStorage:', error)
  }
}

// Generate position hash
const generatePositionHash = (positionDetails: string, companyName?: string): string => {
  const content = `${positionDetails}-${companyName || ''}`
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString()
}

// Extract position title from details
const extractPositionTitle = (positionDetails: string): string => {
  const lines = positionDetails.split('\n')
  const firstLine = lines[0]?.trim()

  if (firstLine && firstLine.length < 100) {
    return firstLine
  }

  const sentences = positionDetails.split('.')
  const firstSentence = sentences[0]?.trim()

  if (firstSentence && firstSentence.length < 100) {
    return firstSentence
  }

  return positionDetails.substring(0, 80) + '...'
}

const initialState: ImprovementDescriptionsState = {
  positions: loadFromStorage(),
  currentPositionHash: ''
}

const improvementDescriptionsSlice = createSlice({
  name: 'improvementDescriptions',
  initialState,
  reducers: {
    // Set current position and create if doesn't exist
    setCurrentPosition: (state, action: PayloadAction<{
      positionDetails: string
      companyName: string
    }>) => {
      const { positionDetails, companyName } = action.payload
      const positionHash = generatePositionHash(positionDetails, companyName)

      state.currentPositionHash = positionHash

      // Create position if it doesn't exist
      if (!state.positions[positionHash]) {
        state.positions[positionHash] = {
          timestamp: Date.now(),
          positionTitle: extractPositionTitle(positionDetails),
          companyName,
          positionHash,
          improvements: {}
        }
        saveToStorage(state.positions)
      }
    },

    // Update improvement description and selection
    updateImprovementDescription: (state, action: PayloadAction<{
      improvementKey: string
      userDescription: string
      selected?: boolean
    }>) => {
      const { improvementKey, userDescription, selected } = action.payload
      const currentPosition = state.positions[state.currentPositionHash]

      if (currentPosition) {
        if (!currentPosition.improvements[improvementKey]) {
          currentPosition.improvements[improvementKey] = {
            userDescription: '',
            selected: false,
            usedInCV: false,
            timestamp: Date.now()
          }
        }

        currentPosition.improvements[improvementKey] = {
          ...currentPosition.improvements[improvementKey],
          userDescription,
          selected: selected !== undefined ? selected : currentPosition.improvements[improvementKey].selected,
          timestamp: Date.now()
        }

        currentPosition.timestamp = Date.now()
        saveToStorage(state.positions)
      }
    },

    // Toggle improvement selection
    toggleImprovementSelection: (state, action: PayloadAction<string>) => {
      const improvementKey = action.payload
      const currentPosition = state.positions[state.currentPositionHash]

      if (currentPosition) {
        if (!currentPosition.improvements[improvementKey]) {
          currentPosition.improvements[improvementKey] = {
            userDescription: '',
            selected: true,
            usedInCV: false,
            timestamp: Date.now()
          }
        } else {
          currentPosition.improvements[improvementKey].selected =
            !currentPosition.improvements[improvementKey].selected
          currentPosition.improvements[improvementKey].timestamp = Date.now()
        }

        currentPosition.timestamp = Date.now()
        saveToStorage(state.positions)
      }
    },

    // Mark improvements as used in CV
    markImprovementsAsUsed: (state, action: PayloadAction<string[]>) => {
      const improvementKeys = action.payload
      const currentPosition = state.positions[state.currentPositionHash]

      if (currentPosition) {
        improvementKeys.forEach(key => {
          if (currentPosition.improvements[key]) {
            currentPosition.improvements[key].usedInCV = true
            currentPosition.improvements[key].timestamp = Date.now()
          }
        })

        currentPosition.timestamp = Date.now()
        saveToStorage(state.positions)
      }
    },

    // Clean up old positions (older than 30 days)
    cleanupOldPositions: (state) => {
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)

      Object.keys(state.positions).forEach(positionHash => {
        if (state.positions[positionHash].timestamp < thirtyDaysAgo) {
          delete state.positions[positionHash]
        }
      })

      saveToStorage(state.positions)
    },

    // Clear all improvements for current position
    clearCurrentPositionImprovements: (state) => {
      const currentPosition = state.positions[state.currentPositionHash]
      if (currentPosition) {
        currentPosition.improvements = {}
        currentPosition.timestamp = Date.now()
        saveToStorage(state.positions)
      }
    },

    // Clear specific improvement (for individual dismissal)
    clearSpecificImprovement: (state, action: PayloadAction<string>) => {
      const improvementKey = action.payload
      const currentPosition = state.positions[state.currentPositionHash]
      if (currentPosition && currentPosition.improvements[improvementKey]) {
        delete currentPosition.improvements[improvementKey]
        currentPosition.timestamp = Date.now()
        saveToStorage(state.positions)
      }
    },

    // Clear used improvements (automatically clean up after CV adjustment)
    clearUsedImprovements: (state) => {
      const currentPosition = state.positions[state.currentPositionHash]
      if (currentPosition) {
        const improvementsToKeep: { [key: string]: ImprovementDescription } = {}

        Object.entries(currentPosition.improvements).forEach(([key, improvement]) => {
          // Keep improvements that are selected but not yet used
          if (improvement.selected && !improvement.usedInCV) {
            improvementsToKeep[key] = improvement
          }
        })

        currentPosition.improvements = improvementsToKeep
        currentPosition.timestamp = Date.now()
        saveToStorage(state.positions)
      }
    },

    // Bulk update improvements with auto-filled data
    bulkUpdateImprovements: (state, action: PayloadAction<{
      autoFilledImprovements: { [improvementKey: string]: {
        shouldSelect: boolean
        description: string
        confidence: number
        matchedFrom?: string
      }}
    }>) => {
      const { autoFilledImprovements } = action.payload
      const currentPosition = state.positions[state.currentPositionHash]

      if (currentPosition) {
        Object.entries(autoFilledImprovements).forEach(([improvementKey, autoFillData]) => {
          // Only auto-fill if the improvement doesn't already have user input
          if (!currentPosition.improvements[improvementKey] ||
              currentPosition.improvements[improvementKey].userDescription.trim().length === 0) {

            currentPosition.improvements[improvementKey] = {
              userDescription: autoFillData.description,
              selected: autoFillData.shouldSelect,
              usedInCV: false,
              timestamp: Date.now(),
              // Add metadata for auto-filled items
              autoFilled: true,
              confidence: autoFillData.confidence,
              matchedFrom: autoFillData.matchedFrom
            }
          }
        })

        currentPosition.timestamp = Date.now()
        saveToStorage(state.positions)
      }
    }
  }
})

export const {
  setCurrentPosition,
  updateImprovementDescription,
  toggleImprovementSelection,
  markImprovementsAsUsed,
  cleanupOldPositions,
  clearCurrentPositionImprovements,
  clearSpecificImprovement,
  clearUsedImprovements,
  bulkUpdateImprovements
} = improvementDescriptionsSlice.actions

export default improvementDescriptionsSlice.reducer

// Selectors
export const selectCurrentPosition = (state: { improvementDescriptions: ImprovementDescriptionsState }) =>
  state.improvementDescriptions.positions[state.improvementDescriptions.currentPositionHash]

export const selectCurrentPositionHash = (state: { improvementDescriptions: ImprovementDescriptionsState }) =>
  state.improvementDescriptions.currentPositionHash

export const selectSelectedImprovements = createSelector(
  [selectCurrentPosition],
  (currentPosition) => {
    if (!currentPosition) return []

    return Object.entries(currentPosition.improvements)
      .filter(([_, data]) => data.selected)
      .map(([key, _]) => key)
  }
)

export const selectImprovementsWithDescriptions = createSelector(
  [selectCurrentPosition],
  (currentPosition) => {
    if (!currentPosition) return []

    return Object.entries(currentPosition.improvements)
      .filter(([_, data]) => data.selected && data.userDescription.trim().length > 0)
      .map(([improvement, data]) => ({
        improvement,
        description: data.userDescription.trim()
      }))
  }
)

export const selectImprovementInput = (improvementKey: string) =>
  (state: { improvementDescriptions: ImprovementDescriptionsState }) => {
    const currentPosition = selectCurrentPosition(state)
    return currentPosition?.improvements[improvementKey]?.userDescription || ''
  }

export const selectIsImprovementSelected = (improvementKey: string) =>
  (state: { improvementDescriptions: ImprovementDescriptionsState }) => {
    const currentPosition = selectCurrentPosition(state)
    return currentPosition?.improvements[improvementKey]?.selected || false
  }