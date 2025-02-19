"use client"

import { useState } from "react"

export default function QuoteBuilder() {
  const [businessType, setBusinessType] = useState("")
  const [services, setServices] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)

  // Add your quote builder logic here

  return (
    <div>
      <h2>Quote Builder</h2>
      <form>
        <div>
          <label htmlFor="businessType">Business Type:</label>
          <select id="businessType" value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
            <option value="">Select a business type</option>
            <option value="soleTrader">Sole Trader</option>
            <option value="partnership">Partnership</option>
            <option value="limitedCompany">Limited Company</option>
          </select>
        </div>
        {/* Add more form fields for services, etc. */}
        <div>
          <h3>Total Price: £{totalPrice}</h3>
        </div>
      </form>
    </div>
  )
}

