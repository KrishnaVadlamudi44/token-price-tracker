import { configureStore } from "@reduxjs/toolkit"
import tokenApi from "./api"

const Store = configureStore({
  reducer: {
    [tokenApi.reducerPath]: tokenApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tokenApi.middleware),
})

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch

export default Store
