import { NextResponse } from "next/server"
import { sendContactEmail, sendAutoReply, verifyEmailConnection, sendDiscordNotification } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Verify email connection (optional, but good for debugging)
    const isEmailReady = await verifyEmailConnection()
    if (!isEmailReady) {
      console.error("Email service not ready")
      // Continue anyway, as the actual send might still work
    }

    // Create an object to track the status of each notification
    const notificationStatus = {
      email: false,
      autoReply: false,
      discord: false,
    }

    try {
      // Send the main contact email to you
      const emailResult = await sendContactEmail({
        name,
        email,
        subject,
        message,
      })
      notificationStatus.email = emailResult.success

      // Send auto-reply to the person who contacted you
      const autoReplyResult = await sendAutoReply({
        name,
        email,
        subject,
      })
      notificationStatus.autoReply = autoReplyResult.success

      // Send Discord notification
      const discordResult = await sendDiscordNotification({
        name,
        email,
        subject,
        message,
      })
      notificationStatus.discord = discordResult.success

      console.log("📧 Notification status:", notificationStatus)

      // If at least the email or Discord notification was sent, consider it a success
      if (notificationStatus.email || notificationStatus.discord) {
        return NextResponse.json({
          success: true,
          message: "Message sent successfully! You'll receive a confirmation email shortly.",
          notificationStatus,
        })
      } else {
        // If both email and Discord failed, return an error
        throw new Error("Failed to send notifications through any channel")
      }
    } catch (emailError) {
      console.error("Notification sending failed:", emailError)

      // Return a user-friendly error
      return NextResponse.json(
        {
          error: "Failed to send message. Please try again or contact directly at contact@bogdanpics.com",
          details: process.env.NODE_ENV === "development" ? emailError.message : undefined,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Optional: Add a GET endpoint to test email configuration
export async function GET() {
  try {
    const isReady = await verifyEmailConnection()
    return NextResponse.json({
      emailServiceReady: isReady,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to verify email service" }, { status: 500 })
  }
}
