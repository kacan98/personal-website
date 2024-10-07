import { configureStore } from '@reduxjs/toolkit'
import { cvSlice } from './slices/cv'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'

export const makeStore = (cvSettings: CVSettings) => {
  return configureStore({
    reducer: {
      cv: cvSlice.reducer,
    },
    preloadedState: {
      cv: cvSettings,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
