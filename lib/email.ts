import nodemailer from "nodemailer"
import fetch from "node-fetch"

// Email configuration for IONOS
const emailConfig = {
  host: "smtp.ionos.co.uk",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // contact@bogdanpics.com
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
  tls: {
    rejectUnauthorized: false,
  },
}

// Create reusable transporter object using IONOS SMTP
const transporter = nodemailer.createTransport(emailConfig)

// Verify connection configuration
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify()
    console.log("✅ Email server is ready to take our messages")
    return true
  } catch (error) {
    console.error("❌ Email server connection failed:", error)
    return false
  }
}

// Send contact form email
export const sendContactEmail = async ({
  name,
  email,
  subject,
  message,
}: {
  name: string
  email: string
  subject: string
  message: string
}) => {
  try {
    // Email to you (the photographer)
    const mailOptions = {
      from: `"PhotoFolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Your email address
      subject: `📸 New Contact Form: ${subject}`,
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">📸 New Contact Form Submission</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 25px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">Contact Details</h2>
              <p style="margin: 8px 0; color: #555; font-size: 16px;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 8px 0; color: #555; font-size: 16px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></p>
              <p style="margin: 8px 0; color: #555; font-size: 16px;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Message:</h3>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
                <p style="margin: 0; color: #555; line-height: 1.6; font-size: 16px; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                📅 Received: ${new Date().toLocaleString("en-GB", {
                  timeZone: "Europe/London",
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </p>
              <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
                💡 <strong>Quick Reply:</strong> <a href="mailto:${email}?subject=Re: ${subject}" style="color: #667eea; text-decoration: none;">Click here to reply directly</a>
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Received: ${new Date().toLocaleString()}
      `,
    }

    // Send the email
    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Email sent successfully:", info.messageId)

    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (error) {
    console.error("❌ Error sending email:", error)
    throw new Error("Failed to send email")
  }
}

// Send auto-reply to the person who contacted you
export const sendAutoReply = async ({
  name,
  email,
  subject,
}: {
  name: string
  email: string
  subject: string
}) => {
  try {
    const autoReplyOptions = {
      from: `"Bogdan - PhotoFolio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for contacting PhotoFolio! 📸`,
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">📸 Thank You!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">Hi ${name}! 👋</h2>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
              Thank you for reaching out about "<strong>${subject}</strong>". I've received your message and I'm excited to learn more about your photography needs!
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What happens next?</h3>
              <ul style="color: #555; line-height: 1.6; font-size: 16px; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">I'll review your message carefully</li>
                <li style="margin-bottom: 8px;">You'll hear back from me within 24 hours</li>
                <li style="margin-bottom: 8px;">We'll discuss your vision and create something amazing together!</li>
              </ul>
            </div>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px; margin-bottom: 25px;">
              In the meantime, feel free to check out my latest work on the portfolio or follow me on social media for behind-the-scenes content.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://bogdanpics.com" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px;">
                View Portfolio 📸
              </a>
            </div>
            
            <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                Best regards,<br>
                <strong style="color: #333;">Bogdan</strong><br>
                📧 contact@bogdanpics.com<br>
                📱 Available for shoots worldwide
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
Hi ${name}!

Thank you for reaching out about "${subject}". I've received your message and I'm excited to learn more about your photography needs!

What happens next?
- I'll review your message carefully
- You'll hear back from me within 24 hours  
- We'll discuss your vision and create something amazing together!

Best regards,
Bogdan
contact@bogdanpics.com
      `,
    }

    const info = await transporter.sendMail(autoReplyOptions)
    console.log("✅ Auto-reply sent successfully:", info.messageId)

    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (error) {
    console.error("❌ Error sending auto-reply:", error)
    // Don't throw error for auto-reply failure, just log it
    return {
      success: false,
      error: error.message,
    }
  }
}

// Send Discord notification
export const sendDiscordNotification = async ({
  name,
  email,
  subject,
  message,
}: {
  name: string
  email: string
  subject: string
  message: string
}) => {
  try {
    // Format the message for Discord
    const webhookUrl =
      process.env.DISCORD_WEBHOOK_URL ||
      "https://discord.com/api/webhooks/1379912930681688064/cSG9RBtA9A4VLTclBqPyFdVZ0T1wfhCKy6hOd_Fbu7P01_3gIjQf03jDuET481ZtQnH7"

    // Truncate message if it's too long for Discord
    const truncatedMessage = message.length > 1000 ? `${message.substring(0, 997)}...` : message

    // Create a rich embed for Discord
    const payload = {
      embeds: [
        {
          title: "📸 New Photography Inquiry",
          description: `You've received a new contact form submission from **${name}**`,
          color: 0x764ba2, // Purple color matching your gradient
          fields: [
            {
              name: "📧 Email",
              value: email,
              inline: true,
            },
            {
              name: "📝 Subject",
              value: subject,
              inline: true,
            },
            {
              name: "⏰ Received",
              value: new Date().toLocaleString("en-GB", {
                timeZone: "Europe/London",
                dateStyle: "short",
                timeStyle: "short",
              }),
              inline: true,
            },
            {
              name: "💬 Message",
              value: truncatedMessage,
            },
          ],
          footer: {
            text: "PhotoFolio Contact Form",
          },
          timestamp: new Date().toISOString(),
        },
      ],
      // Add components for quick actions
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5, // Link button
              label: "Reply via Email",
              url: `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`,
            },
          ],
        },
      ],
    }

    // Send the webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Discord webhook failed with status ${response.status}`)
    }

    console.log("✅ Discord notification sent successfully")
    return { success: true }
  } catch (error) {
    console.error("❌ Error sending Discord notification:", error)
    // Don't throw error for Discord notification failure, just log it
    return {
      success: false,
      error: error.message,
    }
  }
}
