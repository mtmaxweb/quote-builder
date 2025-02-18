"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

type BusinessType = "Sole Trader" | "Partnership" | "Limited Company"

const turnoverOptions = [
  "Up to £50,000",
  "£50,001 - £100,000",
  "£100,001 - £200,000",
  "£200,001 - £500,000",
  "£500,001 - £1,000,000",
  "> £1,000,001",
]

const employeeOptions = ["1-5", "6-10", "11-15", "16-20", "21-30", "+30"]

const services = [
  { name: "Bookkeeping", condition: () => true },
  { name: "Year End Accounts", condition: () => true },
  { name: "Self Assessment Tax Returns", condition: () => true },
  { name: "Payroll", condition: () => true },
  { name: "Management Accounts", condition: () => true },
  { name: "VAT Returns", condition: () => true },
  { name: "Registered Office / Company Secretarial", condition: (type: BusinessType) => type === "Limited Company" },
  { name: "Corporation Tax", condition: (type: BusinessType) => type === "Limited Company" },
]

export default function QuoteBuilder() {
  const [step, setStep] = useState(1)
  const [businessType, setBusinessType] = useState<BusinessType | null>(null)
  const [annualTurnover, setAnnualTurnover] = useState<string>("")
  const [numberOfEmployees, setNumberOfEmployees] = useState<string>("")
  const [exactNumberOfEmployees, setExactNumberOfEmployees] = useState<string>("")
  const [totalPrice, setTotalPrice] = useState(0)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [payrollFrequency, setPayrollFrequency] = useState("Weekly")
  const [salesTransactions, setSalesTransactions] = useState("")
  const [purchaseTransactions, setPurchaseTransactions] = useState("")
  const [expenseTransactions, setExpenseTransactions] = useState("")
  const [numberOfPartners, setNumberOfPartners] = useState("")
  const [managementAccountsFrequency, setManagementAccountsFrequency] = useState("")
  const [priceBreakdown, setPriceBreakdown] = useState<{ [key: string]: number }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [contactDetails, setContactDetails] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    businessName: "",
    postcode: "",
  })

  const handleBusinessTypeChange = (value: BusinessType) => {
    setBusinessType(value)
    setTotalPrice(0)
  }

  const isAdditionalInfoRequired = () => {
    return (
      selectedServices.includes("Year End Accounts") ||
      selectedServices.includes("Bookkeeping") ||
      selectedServices.includes("Self Assessment Tax Returns") ||
      selectedServices.includes("Management Accounts") ||
      selectedServices.includes("Payroll")
    )
  }

  const isStep3Complete = () => {
    const isValidNumber = (value: string) => {
      const num = Number(value)
      return !isNaN(num) && num >= 0 && value !== ""
    }

    if (selectedServices.includes("Year End Accounts") && !annualTurnover) {
      return false
    }
    if (selectedServices.includes("Bookkeeping")) {
      if (
        !isValidNumber(salesTransactions) ||
        !isValidNumber(purchaseTransactions) ||
        !isValidNumber(expenseTransactions)
      ) {
        return false
      }
    }
    if (
      (businessType === "Partnership" || businessType === "Limited Company") &&
      selectedServices.includes("Self Assessment Tax Returns") &&
      !isValidNumber(numberOfPartners)
    ) {
      return false
    }
    if (selectedServices.includes("Management Accounts") && !managementAccountsFrequency) {
      return false
    }
    if (selectedServices.includes("Payroll")) {
      if (!payrollFrequency || !numberOfEmployees) {
        return false
      }
      if (numberOfEmployees === "+30" && !isValidNumber(exactNumberOfEmployees)) {
        return false
      }
    }
    return true
  }

  const handleNextStep = () => {
    if (step === 2 && !isAdditionalInfoRequired()) {
      setStep(4)
    } else if (step === 3) {
      if (isStep3Complete()) {
        calculateTotalPrice()
        setStep(4)
      } else {
        toast({
          title: "Incomplete Information",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive",
        })
      }
    } else {
      setStep(step + 1)
    }
  }

  const handlePreviousStep = () => {
    if (step === 4 && !isAdditionalInfoRequired()) {
      setStep(2)
    } else {
      setStep(step - 1)
    }
  }

  const handleServiceToggle = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter((service) => service !== serviceName))
    } else {
      setSelectedServices([...selectedServices, serviceName])
    }
  }

  const calculateTotalPrice = () => {
    let total = 0
    const breakdown: { [key: string]: number } = {}

    if (selectedServices.includes("Bookkeeping")) {
      const totalTransactions =
        Number.parseInt(salesTransactions) +
        Number.parseInt(purchaseTransactions) +
        Number.parseInt(expenseTransactions)
      let price = 0
      if (totalTransactions <= 10) {
        price = 15
      } else if (totalTransactions <= 20) {
        price = 30
      } else {
        price = Math.ceil(totalTransactions / 5) * 5
      }
      total += price
      breakdown["Bookkeeping"] = price
    }

    if (selectedServices.includes("Year End Accounts")) {
      const hasBookkeeping = selectedServices.includes("Bookkeeping")
      let price = 0

      if (businessType === "Sole Trader") {
        if (annualTurnover === "Up to £50,000") price = hasBookkeeping ? 10 : 15
        else if (annualTurnover === "£50,001 - £100,000") price = hasBookkeeping ? 15 : 20
        else if (annualTurnover === "£100,001 - £200,000") price = hasBookkeeping ? 20 : 25
        else if (annualTurnover === "£200,001 - £500,000") price = hasBookkeeping ? 25 : 40
        else if (annualTurnover === "£500,001 - £1,000,000") price = hasBookkeeping ? 35 : 50
        else price = hasBookkeeping ? 50 : 65
      } else if (businessType === "Partnership") {
        if (annualTurnover === "Up to £50,000") price = hasBookkeeping ? 15 : 20
        else if (annualTurnover === "£50,001 - £100,000") price = hasBookkeeping ? 20 : 25
        else if (annualTurnover === "£100,001 - £200,000") price = hasBookkeeping ? 25 : 30
        else if (annualTurnover === "£200,001 - £500,000") price = hasBookkeeping ? 30 : 40
        else if (annualTurnover === "£500,001 - £1,000,000") price = hasBookkeeping ? 40 : 55
        else price = hasBookkeeping ? 60 : 75
      } else if (businessType === "Limited Company") {
        if (annualTurnover === "Up to £50,000") price = hasBookkeeping ? 65 : 75
        else if (annualTurnover === "£50,001 - £100,000") price = hasBookkeeping ? 90 : 100
        else if (annualTurnover === "£100,001 - £200,000") price = hasBookkeeping ? 135 : 150
        else if (annualTurnover === "£200,001 - £500,000") price = hasBookkeeping ? 180 : 200
        else if (annualTurnover === "£500,001 - £1,000,000") price = hasBookkeeping ? 250 : 300
        else price = hasBookkeeping ? 300 : 350
      }
      total += price
      breakdown["Year End Accounts"] = price
    }

    if (selectedServices.includes("Self Assessment Tax Returns")) {
      let price = 0
      if (businessType === "Sole Trader") {
        price = 25
      } else if (businessType === "Partnership" || businessType === "Limited Company") {
        const partners = Number.parseInt(numberOfPartners) || 1
        price = 10 + 25 * partners
      }
      total += price
      breakdown["Self Assessment Tax Returns"] = price
    }

    if (selectedServices.includes("Payroll")) {
      const employees =
        numberOfEmployees === "+30"
          ? Number.parseInt(exactNumberOfEmployees) || 30
          : Number.parseInt(numberOfEmployees.split("-")[1]) || 0
      let price = 0
      if (payrollFrequency === "Weekly") {
        if (employees <= 5) price = 180
        else if (employees <= 10) price = 230
        else if (employees <= 15) price = 280
        else if (employees <= 20) price = 320
        else if (employees <= 30) price = 360
        else price = 360 + employees * 6
      } else if (payrollFrequency === "Monthly") {
        if (employees <= 5) price = 60
        else if (employees <= 10) price = 70
        else if (employees <= 15) price = 80
        else if (employees <= 20) price = 90
        else if (employees <= 30) price = 100
        else price = 100 + employees * 6
      }
      total += price
      breakdown["Payroll"] = price
    }

    if (selectedServices.includes("Management Accounts")) {
      let price = 0
      if (managementAccountsFrequency === "Monthly") {
        if (businessType === "Sole Trader" || businessType === "Partnership") {
          price = 200
        } else if (businessType === "Limited Company") {
          price = 250
        }
      } else if (managementAccountsFrequency === "Quarterly") {
        if (businessType === "Sole Trader") {
          price = 100
        } else if (businessType === "Partnership") {
          price = 300
        } else if (businessType === "Limited Company") {
          price = 375
        }
      }
      total += managementAccountsFrequency === "Quarterly" ? price / 3 : price
      breakdown["Management Accounts"] = price
    }

    if (selectedServices.includes("VAT Returns")) {
      const price = selectedServices.includes("Bookkeeping") ? 20 : 40
      total += price
      breakdown["VAT Returns"] = price
    }

    if (selectedServices.includes("Registered Office / Company Secretarial")) {
      const price = 30
      total += price
      breakdown["Registered Office / Company Secretarial"] = price
    }

    if (selectedServices.includes("Corporation Tax")) {
      const price = 25
      total += price
      breakdown["Corporation Tax"] = price
    }

    setTotalPrice(total)
    setPriceBreakdown(breakdown)
  }

  const handleContactDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setContactDetails((prev) => ({ ...prev, [name]: value }))
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-bold text-[#1E2B3A]">Business Type</CardTitle>
              <CardDescription className="text-[#6B7280]">Select your business type to get started.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <RadioGroup value={businessType || ""} onValueChange={handleBusinessTypeChange} className="space-y-2">
                {["Sole Trader", "Partnership", "Limited Company"].map((type) => (
                  <div
                    key={type}
                    className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer [&:has(:checked)]:border-[#3B82F6] [&:has(:checked)]:bg-[#EFF6FF]"
                  >
                    <RadioGroupItem value={type} id={type} className="text-[#3B82F6]" />
                    <Label htmlFor={type} className="flex-grow cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </>
        )
      case 2:
        return (
          <>
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-bold text-[#1E2B3A]">Services</CardTitle>
              <CardDescription className="text-[#6B7280]">Select the services you require.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-2">
                {services.map(
                  (service) =>
                    (!service.condition || service.condition(businessType as BusinessType)) && (
                      <div
                        key={service.name}
                        className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer [&:has(:checked)]:border-[#3B82F6] [&:has(:checked)]:bg-[#EFF6FF]"
                      >
                        <Checkbox
                          id={service.name}
                          checked={selectedServices.includes(service.name)}
                          onCheckedChange={() => handleServiceToggle(service.name)}
                          className="text-[#3B82F6]"
                        />
                        <Label htmlFor={service.name} className="flex-grow cursor-pointer">
                          {service.name}
                        </Label>
                      </div>
                    ),
                )}
              </div>
            </CardContent>
          </>
        )
      case 3:
        return (
          <>
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-bold text-[#1E2B3A]">Additional Information</CardTitle>
              <CardDescription className="text-[#6B7280]">
                Provide additional information for a more accurate quote.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-6">
                {selectedServices.includes("Year End Accounts") && (
                  <div className="space-y-2">
                    <Label htmlFor="annual-turnover">Annual Turnover</Label>
                    <Select value={annualTurnover} onValueChange={setAnnualTurnover}>
                      <SelectTrigger
                        id="annual-turnover"
                        className="w-full border-gray-300 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                      >
                        <SelectValue placeholder="Select annual turnover" />
                      </SelectTrigger>
                      <SelectContent>
                        {turnoverOptions.map((option) => (
                          <SelectItem key={option} value={option} className="cursor-pointer hover:bg-[#EFF6FF]">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {selectedServices.includes("Bookkeeping") && (
                  <>
                    <div className="space-y-2">
                      <Label>
                        Please provide us with an estimated number of sales, purchases and expenses your business
                        generates each month.
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Input
                          id="sales-transactions"
                          value={salesTransactions}
                          onChange={(e) => setSalesTransactions(e.target.value)}
                          placeholder="Sales"
                        />
                        <Input
                          id="purchase-transactions"
                          value={purchaseTransactions}
                          onChange={(e) => setPurchaseTransactions(e.target.value)}
                          placeholder="Purchases"
                        />
                        <Input
                          id="expense-transactions"
                          value={expenseTransactions}
                          onChange={(e) => setExpenseTransactions(e.target.value)}
                          placeholder="Expenses"
                        />
                      </div>
                    </div>
                  </>
                )}
                {(businessType === "Partnership" || businessType === "Limited Company") &&
                  selectedServices.includes("Self Assessment Tax Returns") && (
                    <div className="space-y-2">
                      <Label htmlFor="number-of-partners">
                        {businessType === "Partnership" ? "Number of Partners" : "Number of Directors"}
                      </Label>
                      <Input
                        id="number-of-partners"
                        value={numberOfPartners}
                        onChange={(e) => setNumberOfPartners(e.target.value)}
                        placeholder={`Enter number of ${businessType === "Partnership" ? "partners" : "directors"}`}
                      />
                    </div>
                  )}
                {selectedServices.includes("Management Accounts") && (
                  <div className="space-y-2">
                    <Label htmlFor="management-accounts-frequency">Management Accounts Frequency</Label>
                    <Select value={managementAccountsFrequency} onValueChange={setManagementAccountsFrequency}>
                      <SelectTrigger
                        id="management-accounts-frequency"
                        className="w-full border-gray-300 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                      >
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monthly" className="cursor-pointer hover:bg-[#EFF6FF]">
                          Monthly
                        </SelectItem>
                        <SelectItem value="Quarterly" className="cursor-pointer hover:bg-[#EFF6FF]">
                          Quarterly
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {selectedServices.includes("Payroll") && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="payroll-frequency">Payroll Frequency</Label>
                      <Select value={payrollFrequency} onValueChange={setPayrollFrequency}>
                        <SelectTrigger
                          id="payroll-frequency"
                          className="w-full border-gray-300 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                        >
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Weekly" className="cursor-pointer hover:bg-[#EFF6FF]">
                            Weekly
                          </SelectItem>
                          <SelectItem value="Monthly" className="cursor-pointer hover:bg-[#EFF6FF]">
                            Monthly
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="number-of-employees">Number of Employees</Label>
                      <Select value={numberOfEmployees} onValueChange={setNumberOfEmployees}>
                        <SelectTrigger
                          id="number-of-employees"
                          className="w-full border-gray-300 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                        >
                          <SelectValue placeholder="Select number of employees" />
                        </SelectTrigger>
                        <SelectContent>
                          {employeeOptions.map((option) => (
                            <SelectItem key={option} value={option} className="cursor-pointer hover:bg-[#EFF6FF]">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {numberOfEmployees === "+30" && (
                      <div className="space-y-2">
                        <Label htmlFor="exact-number-of-employees">Exact Number of Employees</Label>
                        <Input
                          id="exact-number-of-employees"
                          value={exactNumberOfEmployees}
                          onChange={(e) => setExactNumberOfEmployees(e.target.value)}
                          placeholder="Enter exact number of employees"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </>
        )
      case 4:
        return (
          <>
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-bold text-[#1E2B3A]">Contact Details</CardTitle>
              <CardDescription className="text-[#6B7280]">
                Please provide your contact information so we can get in touch about your quote.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={contactDetails.name}
                    onChange={handleContactDetailsChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={contactDetails.phoneNumber}
                    onChange={handleContactDetailsChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={contactDetails.email}
                    onChange={handleContactDetailsChange}
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={contactDetails.businessName}
                    onChange={handleContactDetailsChange}
                    placeholder="Enter your business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    value={contactDetails.postcode}
                    onChange={handleContactDetailsChange}
                    placeholder="Enter your postcode"
                  />
                </div>
              </div>
            </CardContent>
          </>
        )
      case 5:
        return (
          <>
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-bold text-[#1E2B3A]">Summary</CardTitle>
              <CardDescription className="text-[#6B7280]">Review your quote before submitting.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Selected Services:</h3>
                  <ul className="list-disc list-inside">
                    {selectedServices.map((service) => (
                      <li key={service}>
                        {service}: £{priceBreakdown[service]}
                        {service === "Management Accounts" && managementAccountsFrequency === "Quarterly"
                          ? " Per Quarter"
                          : " Per Month"}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Total Monthly Price: £{totalPrice.toFixed(2)} Per Month</h3>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Contact Details:</h3>
                  <p>Name: {contactDetails.name}</p>
                  <p>Phone: {contactDetails.phoneNumber}</p>
                  <p>Email: {contactDetails.email}</p>
                  <p>Business Name: {contactDetails.businessName}</p>
                  <p>Postcode: {contactDetails.postcode}</p>
                </div>
              </div>
            </CardContent>
          </>
        )
      default:
        return null
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/send-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactDetails,
          selectedServices,
          priceBreakdown,
          totalPrice,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit quote")
      }

      setIsSubmitted(true)
      // Reset form after successful submission
      setStep(1)
      setBusinessType(null)
      setSelectedServices([])
      setAnnualTurnover("")
      setNumberOfEmployees("")
      setExactNumberOfEmployees("")
      setTotalPrice(0)
      setPayrollFrequency("Weekly")
      setSalesTransactions("")
      setPurchaseTransactions("")
      setExpenseTransactions("")
      setNumberOfPartners("")
      setManagementAccountsFrequency("")
      setPriceBreakdown({})
      setContactDetails({
        name: "",
        phoneNumber: "",
        email: "",
        businessName: "",
        postcode: "",
      })
      toast({
        title: "Quote Submitted",
        description: "Your quote request has been submitted successfully. We'll be in touch soon!",
      })
    } catch (error) {
      console.error("Error submitting quote request:", error)
      toast({
        title: "Error",
        description: "There was an error submitting your quote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-[#F4F4F4] flex items-center justify-center p-2 sm:p-4"
      style={{ fontFamily: "Source Sans Pro, sans-serif" }}
    >
      <Card className="w-full max-w-[95vw] sm:max-w-4xl">
        {isSubmitted ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-[#1E2B3A] mb-4">Quote Request Submitted!</h2>
            <p className="text-[#6B7280] mb-6">Thank you for your request. We'll get back to you shortly.</p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-[#AD208E] hover:bg-[#8E1A75] text-white font-semibold py-2 px-4 rounded-lg"
            >
              Start New Quote
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/3 bg-[#00ADEE] text-white p-4 lg:p-6 rounded-t-lg lg:rounded-t-none lg:rounded-l-lg">
              <h2 className="text-2xl font-bold mb-4">Quote Builder</h2>
              <ul className="space-y-2">
                {[
                  "Business Type",
                  "Services",
                  isAdditionalInfoRequired() ? "Additional Info" : null,
                  "Contact Details",
                  "Summary",
                ]
                  .filter(Boolean)
                  .map((stepName, index) => (
                    <li
                      key={stepName}
                      className={`flex items-center ${step >= index + 1 ? "text-white" : "text-gray-200"}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-2 ${
                          step >= index + 1 ? "border-white" : "border-gray-200"
                        }`}
                      >
                        {index + 1}
                      </span>
                      {stepName}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="w-full lg:w-2/3 p-4 lg:p-6">
              {renderStep()}
              <CardFooter className="flex flex-col sm:flex-row justify-between mt-6 space-y-2 sm:space-y-0">
                {step > 1 && (
                  <Button onClick={handlePreviousStep} variant="outline">
                    Previous
                  </Button>
                )}
                {step < 5 ? (
                  <Button
                    onClick={handleNextStep}
                    disabled={
                      (step === 1 && !businessType) ||
                      (step === 2 && selectedServices.length === 0) ||
                      (step === 3 && !isStep3Complete()) ||
                      (step === 4 &&
                        (!contactDetails.name ||
                          !contactDetails.phoneNumber ||
                          !contactDetails.email ||
                          !contactDetails.businessName ||
                          !contactDetails.postcode))
                    }
                    className="bg-[#AD208E] hover:bg-[#8E1A75] text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-[#AD208E] hover:bg-[#8E1A75] text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Quote Request"}
                  </Button>
                )}
              </CardFooter>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

