import { CVSettings } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import { ensureCvIds } from '@/utils/cvIds'

export type UpdateSectionAction = {
  payload: {
    query: (string | number)[] //in format mainColumn.0.title
    newValue: string
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
  } as CVSettings,
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
    },
    switchLanguage: (
      state,
      action: {
        payload: CVSettings
      }
    ) => {
      // Completely replace the CV data with new language data, ensuring IDs
      return ensureCvIds(action.payload);
    },
    updateCv: (state, action: UpdateSectionAction) => {
      const { query, newValue } = action.payload

      let current: any = state
      for (let i = 0; i < query.length - 1; i++) {
        current = (current as any)[query[i]]
      }
      ;(current as any)[query[query.length - 1]] = newValue
    },
  },
})

export default cvSlice
export const { initCv, switchLanguage, updateCv } = cvSlice.actions
