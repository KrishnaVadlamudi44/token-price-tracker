import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SavedToken } from "../types"

function loadTokens(): SavedToken[] {
  try {
    const stored = localStorage.getItem("tokens")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const tokenSlice = createSlice({
  name: "tokens",
  initialState: loadTokens(),
  reducers: {
    addToken(state, action: PayloadAction<SavedToken>) {
      state.push(action.payload)
    },
    removeToken(state, action: PayloadAction<string>) {
      return state.filter((t) => t.address !== action.payload)
    },
    updateHoldings(
      state,
      action: PayloadAction<{ address: string; holdings: number }>
    ) {
      const token = state.find((t) => t.address === action.payload.address)
      if (token) {
        token.holdings = action.payload.holdings
      }
    },
    resetPortfolio() {
      return []
    },
  },
})

export const { addToken, removeToken, updateHoldings, resetPortfolio } =
  tokenSlice.actions
export default tokenSlice.reducer
