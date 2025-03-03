import React from "react"
import ReactDOM from "react-dom"
import App from "./App"

window.ReactQuoteBuilder = {
  default: (element) => {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      element,
    )
  },
}

// If we're not in WordPress, initialize directly
if (document.getElementById("root")) {
  window.ReactQuoteBuilder.default(document.getElementById("root"))
}

