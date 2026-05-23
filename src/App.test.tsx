import React from "react"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import Store from "./store/store"
import App from "./App"

function renderWithStore(ui: React.ReactElement) {
  return render(<Provider store={Store}>{ui}</Provider>)
}

test("renders portfolio heading and value card", () => {
  renderWithStore(<App />)
  expect(screen.getByText(/Crypto Portfolio/i)).toBeInTheDocument()
  expect(screen.getByText(/Portfolio Value/i)).toBeInTheDocument()
})

test("renders Add Token button", () => {
  renderWithStore(<App />)
  expect(screen.getByRole("button", { name: /Add Token/i })).toBeInTheDocument()
})

test("renders Reset button", () => {
  renderWithStore(<App />)
  expect(screen.getByRole("button", { name: /Reset/i })).toBeInTheDocument()
})
