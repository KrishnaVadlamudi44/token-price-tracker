import { configureStore } from "@reduxjs/toolkit"
import tokenApi from "./api"
import tokenReducer from "./tokenSlice"

const Store = configureStore({
  reducer: {
    [tokenApi.reducerPath]: tokenApi.reducer,
    tokens: tokenReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tokenApi.middleware),
})

Store.subscribe(() => {
  localStorage.setItem("tokens", JSON.stringify(Store.getState().tokens))
})

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch

export default Store
