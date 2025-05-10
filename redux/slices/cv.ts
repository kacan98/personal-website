import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import { createSlice } from '@reduxjs/toolkit'

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
      state.on = action.payload.on
      state.name = action.payload.name
      state.subtitle = action.payload.subtitle
      state.mainColumn = action.payload.mainColumn
      state.sideColumn = action.payload.sideColumn
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
export const { initCv, updateCv } = cvSlice.actions
