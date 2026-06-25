import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const bookingSchema = z.object({
  trekName: z.string(),
  fullName: z.string(),
  phone: z.string(),
  email: z.string().optional().nullable(),
  seats: z.number(),
  pickupPoint: z.string(),
  age: z.number().optional().nullable(),
  gender: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  screenshotBase64: z.string().optional().nullable(),
  screenshotFilename: z.string().optional().nullable(),
  screenshotUrl: z.string().optional().nullable(),
});

export const sendBookingNotifications = createServerFn({ method: "POST" })
  .validator(bookingSchema)
  .handler(async ({ data }) => {
    const resendKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

    console.log("[Booking Server Function] Received booking notification request for:", {
      ...data,
      screenshotBase64: data.screenshotBase64 ? `${data.screenshotBase64.substring(0, 30)}...` : null,
    });

    if (!resendKey) {
      console.warn(
        "[Booking Server Function] RESEND_API_KEY is not set in environment variables. Email notification skipped."
      );
      return {
        success: true,
        emailSent: false,
        message: "RESEND_API_KEY is not set. Details logged to server console.",
      };
    }

    try {
      const attachments = [];
      if (data.screenshotBase64 && data.screenshotFilename) {
        attachments.push({
          filename: data.screenshotFilename,
          content: data.screenshotBase64,
          contentId: "screenshot",
        });
      }

      // 1. Send notification email to the Admin
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1b4332; border-bottom: 2px solid #1b4332; padding-bottom: 10px;">🚨 New Trek Booking Request</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr style="background-color: #f9f9f9;"><td style="padding: 8px; font-weight: bold; width: 40%;">Trek Name:</td><td style="padding: 8px;">${data.trekName}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Trekker Name:</td><td style="padding: 8px;">${data.fullName}</td></tr>
            <tr style="background-color: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Phone (WhatsApp):</td><td style="padding: 8px;">${data.phone}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${data.email || "N/A"}</td></tr>
            <tr style="background-color: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Seats:</td><td style="padding: 8px;">${data.seats}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Pickup Point:</td><td style="padding: 8px;">${data.pickupPoint}</td></tr>
            <tr style="background-color: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Age / Gender:</td><td style="padding: 8px;">${data.age || "N/A"} / ${data.gender || "N/A"}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Emergency Contact:</td><td style="padding: 8px;">${data.emergencyContact || "N/A"}</td></tr>
          </table>
          ${
            data.screenshotBase64
              ? `<div style="margin-top: 20px; text-align: center;">
                  <p style="font-weight: bold; color: #1b4332;">Payment Screenshot (Inline Preview):</p>
                  <img src="cid:screenshot" alt="Payment Screenshot" style="max-width: 100%; max-height: 400px; border: 1px solid #ddd; border-radius: 8px; padding: 5px;" />
                 </div>`
              : data.screenshotUrl
                ? `<div style="margin-top: 20px; text-align: center;">
                    <p style="font-weight: bold; color: #1b4332;">Payment Screenshot:</p>
                    <a href="${data.screenshotUrl}" target="_blank" style="display: inline-block; background-color: #e65f2b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Payment Screenshot</a>
                    <div style="margin-top: 10px;">
                      <img src="${data.screenshotUrl}" alt="Payment Screenshot" style="max-width: 100%; max-height: 400px; border: 1px solid #ddd; border-radius: 8px; padding: 5px;" />
                    </div>
                   </div>`
                : ""
          }
        </div>
      `;

      const adminRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "Maharashtra Trekking <onboarding@resend.dev>",
          to: adminEmail,
          subject: `🚨 New Booking: ${data.trekName} - ${data.fullName}`,
          html: adminHtml,
          attachments,
        }),
      });

      if (!adminRes.ok) {
        const errorText = await adminRes.text();
        console.error("[Booking Server Function] Failed to send admin email:", errorText);
      }

      // 2. Send confirmation email to the Customer (if email is provided)
      if (data.email) {
        const customerHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1b4332; border-bottom: 2px solid #1b4332; padding-bottom: 10px;">🎒 Booking Request Received!</h2>
            <p>Hi <strong>${data.fullName}</strong>,</p>
            <p>Thank you for submitting your booking request for <strong>${data.trekName}</strong>. We are excited to have you join us!</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #1b4332;">Booking Summary:</h3>
              <p style="margin: 5px 0;"><strong>Trek:</strong> ${data.trekName}</p>
              <p style="margin: 5px 0;"><strong>Seats:</strong> ${data.seats}</p>
              <p style="margin: 5px 0;"><strong>Pickup Point:</strong> ${data.pickupPoint}</p>
              <p style="margin: 5px 0;"><strong>Emergency Contact:</strong> ${data.emergencyContact || "N/A"}</p>
            </div>
            <p>Our team is currently verifying your details/payment screenshot. We will message you on WhatsApp (<strong>${data.phone}</strong>) within 2 hours to confirm your seat booking and share final trek details.</p>
            <p>If you have any questions, please contact us on WhatsApp by replying to this number or using our support link.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #777;">Happy Trekking,<br /><strong>Maharashtra Trekking Co.</strong></p>
          </div>
        `;

        const customerRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "Maharashtra Trekking <onboarding@resend.dev>",
            to: data.email,
            subject: `Booking Request Received: ${data.trekName}`,
            html: customerHtml,
          }),
        });

        if (!customerRes.ok) {
          const errorText = await customerRes.text();
          console.error("[Booking Server Function] Failed to send customer email:", errorText);
        }
      }

      return { success: true, emailSent: true };
    } catch (err) {
      console.error("[Booking Server Function] Error sending email via Resend API:", err);
      return { success: false, error: String(err) };
    }
  });
