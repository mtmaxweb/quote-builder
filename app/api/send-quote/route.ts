import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log("Received POST request to /api/send-quote")

  try {
    const body = await req.json()
    console.log("Request body:", body)

    // Temporarily return a success response without sending emails
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in /api/send-quote:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

