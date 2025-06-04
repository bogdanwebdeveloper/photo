import { NextResponse } from "next/server"
import { sendDiscordNotification } from "@/lib/email"

export async function POST() {
  try {
    console.log("🧪 Testing Discord webhook...")

    // Test with sample data
    const testData = {
      name: "Test User",
      email: "test@example.com",
      subject: "Test Discord Integration",
      message:
        "This is a test message to verify Discord webhook functionality. If you receive this, the integration is working correctly!",
    }

    const result = await sendDiscordNotification(testData)

    return NextResponse.json({
      success: result.success,
      message: result.success ? "Discord test message sent successfully!" : "Discord test failed",
      error: result.error || null,
      timestamp: new Date().toISOString(),
      webhookConfigured: !!process.env.DISCORD_WEBHOOK_URL,
      webhookUrl: process.env.DISCORD_WEBHOOK_URL
        ? process.env.DISCORD_WEBHOOK_URL.substring(0, 50) + "..."
        : "Not configured",
    })
  } catch (error) {
    console.error("❌ Discord test error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Discord test failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Discord webhook test endpoint",
    usage: "Send a POST request to test the Discord integration",
    webhookConfigured: !!process.env.DISCORD_WEBHOOK_URL,
    timestamp: new Date().toISOString(),
  })
}
