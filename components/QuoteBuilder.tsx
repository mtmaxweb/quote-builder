"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

type BusinessType = "Sole Trader" | "Partnership" | "Limited Company"

const QuoteBuilder: React.FC = () => {
  const [businessType, setBusinessType] = useState<BusinessType | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const handleBusinessTypeChange = (value: BusinessType) => {
    setBusinessType(value)
  }

  const handleServiceToggle = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName) ? prev.filter((s) => s !== serviceName) : [...prev, serviceName],
    )
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Quote Builder</CardTitle>
        <CardDescription>Build your custom quote</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label>Business Type</Label>
            <RadioGroup value={businessType || ""} onValueChange={handleBusinessTypeChange}>
              {["Sole Trader", "Partnership", "Limited Company"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={type} />
                  <Label htmlFor={type}>{type}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label>Services</Label>
            {["Bookkeeping", "Tax Returns", "Payroll"].map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={selectedServices.includes(service)}
                  onCheckedChange={() => handleServiceToggle(service)}
                />
                <Label htmlFor={service}>{service}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Get Quote</Button>
      </CardFooter>
    </Card>
  )
}

export default QuoteBuilder

