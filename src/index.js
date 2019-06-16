import React from "react"
import ReactDOM from "react-dom"
import { ToastContainer } from "react-toastify"

import Table from "./components/Table"

import "react-toastify/dist/ReactToastify.css"

const App = () => (
  <>
    <Table />
    <ToastContainer position="top-center" />
  </>
)

const rootElement = document.getElementById("root")
ReactDOM.render(<App />, rootElement)
