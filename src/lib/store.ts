import { configureStore } from "@reduxjs/toolkit";
import { i18nSlice } from "../i18n/i18nSlice";

export default configureStore({
  reducer: {
    i18n: i18nSlice.reducer,
  },
});
