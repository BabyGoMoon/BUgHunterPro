import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const systemPrompt = `You are AI Tonmoy, an expert cybersecurity assistant created by Anik Hossen Tonmoy for BugHunter Pro. You specialize in:

- Vulnerability analysis and remediation
- Security best practices and recommendations  
- Penetration testing guidance
- Web application security
- Network security assessment
- Threat intelligence and analysis

Always provide accurate, actionable cybersecurity advice. Be professional but friendly. Focus on practical solutions and security improvements.

Context: ${context || "General cybersecurity consultation"}`

    const prompt = `${systemPrompt}\n\nUser Question: ${message}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI Tonmoy error:", error)
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 })
  }
}
