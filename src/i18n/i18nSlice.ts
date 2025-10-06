import { createSlice } from '@reduxjs/toolkit'

export const i18nSlice = createSlice({
  name: 'i18n',
  initialState: {
    value: 'en'
  },
  reducers: {
    setLocale: (state, action) => {
      state.value = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setLocale } = i18nSlice.actions

export default i18nSlice.reducer