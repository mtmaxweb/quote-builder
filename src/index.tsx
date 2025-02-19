import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"

// Export the initialization function for WordPress
window.ReactQuoteBuilder = {
  default: (element: HTMLElement | null) => {
    if (element) {
      const root = createRoot(element)
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      )
    } else {
      console.error("Target element not found")
    }
  },
}

// If we're not in WordPress, initialize directly
const rootElement = document.getElementById("root")
if (rootElement) {
  window.ReactQuoteBuilder.default(rootElement)
}

// Add this type declaration to avoid TypeScript errors
declare global {
  interface Window {
    ReactQuoteBuilder: {
      default: (element: HTMLElement | null) => void
    }
  }
}

