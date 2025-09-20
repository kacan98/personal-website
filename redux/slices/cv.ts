import { CVSettings, CvSubSection, BulletPoint } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import { ensureCvIds } from '@/utils/cvIds'

export type UpdateSectionAction = {
  payload: {
    query: (string | number)[] //in format mainColumn.0.title
    newValue: string | CvSubSection | BulletPoint
  }
}

export type RemoveArrayItemAction = {
  payload: {
    query: (string | number)[] //in format mainColumn.0.paragraphs.2 (removes index 2)
  }
}

export const cvSlice = createSlice({
  name: 'cv',
  initialState: {
    on: false,
    name: '',
    subtitle: '',
    mainColumn: [],
    sideColumn: [],
    image: '',
    hasChanges: false,
  } as CVSettings & { hasChanges: boolean },
  reducers: {
    initCv: (
      state,
      action: {
        payload: CVSettings
      }
    ) => {
      // Ensure all sections have IDs before storing in Redux
      const cvWithIds = ensureCvIds(action.payload);
      state.on = cvWithIds.on
      state.name = cvWithIds.name
      state.subtitle = cvWithIds.subtitle
      state.mainColumn = cvWithIds.mainColumn
      state.sideColumn = cvWithIds.sideColumn
      state.profilePicture = cvWithIds.profilePicture
      state.hasChanges = false // Reset changes when initializing CV
    },
    switchLanguage: (
      state,
      action: {
        payload: CVSettings
      }
    ) => {
      // Completely replace the CV data with new language data, ensuring IDs
      const cvWithIds = ensureCvIds(action.payload);
      return { ...cvWithIds, hasChanges: false }; // Reset changes when switching language
    },
    updateCv: (state, action: UpdateSectionAction) => {
      const { query, newValue } = action.payload

      // Navigate to the parent object, creating missing arrays/objects as needed
      let current: CVSettings = state
      for (let i = 0; i < query.length - 1; i++) {
        const key = query[i]
        const nextKey = query[i + 1]

        // Ensure current is an object and current[key] exists
        if (!current || typeof current !== 'object') {
          current = {} as CVSettings;
        }

        if (!(key in current)) {
          // If next key is a number, we need an array
          if (typeof nextKey === 'number') {
            (current as Record<string | number, unknown>)[key] = []
          } else {
            (current as Record<string | number, unknown>)[key] = {}
          }
        }

        // If we're about to access an array index that doesn't exist, extend the array
        if (Array.isArray((current as Record<string | number, unknown>)[key]) && typeof nextKey === 'number') {
          const arr = (current as Record<string | number, unknown>)[key] as unknown[]
          while (arr.length <= nextKey) {
            arr.push({})
          }
        }

        current = (current as Record<string | number, unknown>)[key] as CVSettings
      }

      // Set the final value
      const finalKey = query[query.length - 1]

      // Ensure current is valid before setting the final value
      if (!current || typeof current !== 'object') {
        current = {} as CVSettings;
      }

      // If setting an array index that doesn't exist, extend the array
      if (Array.isArray(current) && typeof finalKey === 'number') {
        while ((current as unknown[]).length <= finalKey) {
          (current as unknown[]).push({})
        }
      }

      (current as Record<string | number, unknown>)[finalKey] = newValue

      // Mark that changes have been made
      state.hasChanges = true
    },
    removeArrayItem: (state, action: RemoveArrayItemAction) => {
      const { query } = action.payload

      // Navigate to the array that contains the item to remove
      let current: CVSettings = state
      for (let i = 0; i < query.length - 1; i++) {
        const key = query[i]
        if (current && typeof current === 'object' && key in current) {
          current = (current as Record<string | number, unknown>)[key] as CVSettings
        } else {
          return // Path doesn't exist, nothing to remove
        }
      }

      // Remove the item from the array
      const arrayKey = query[query.length - 1]
      if (Array.isArray(current) && typeof arrayKey === 'number') {
        current.splice(arrayKey, 1)
        // Mark that changes have been made
        state.hasChanges = true
      }
    },
    resetChanges: (state) => {
      // Reset the changes flag without modifying CV content
      state.hasChanges = false
    },
    updateCvWithChanges: (
      state,
      action: {
        payload: CVSettings
      }
    ) => {
      // Update CV content but keep hasChanges = true to maintain diff view
      const cvWithIds = ensureCvIds(action.payload);
      state.on = cvWithIds.on
      state.name = cvWithIds.name
      state.subtitle = cvWithIds.subtitle
      state.mainColumn = cvWithIds.mainColumn
      state.sideColumn = cvWithIds.sideColumn
      state.profilePicture = cvWithIds.profilePicture
      state.hasChanges = true // Keep changes flag to maintain diff view
    },
  },
})

export default cvSlice
export const { initCv, switchLanguage, updateCv, removeArrayItem, resetChanges, updateCvWithChanges } = cvSlice.actions
