import { Resend } from "resend";
/**
 * Sends email using Resend service
 * 
 * @param params - Email parameters object
 * @param params.to - Array of recipient email addresses
 * @param params.subject - Email subject line
 * @param params.html - HTML content for the email body
 * @returns Promise resolving to Resend API response
 * 
 * @description
 * Sends emails through the Resend API service using the configured API key.
 * All emails are sent from the ICPC Assiut Community domain with a no-reply address.
 * Supports multiple recipients and HTML email content.
 * 
 * @requires RESEND_API_KEY environment variable must be set
 * 
 * @example
 * ```typescript
 * await sendEmail({
 *   to: ["user@example.com"],
 *   subject: "Welcome to ICPC Platform",
 *   html: "<h1>Welcome!</h1><p>Thanks for joining.</p>"
 * });
 * ```
 * 
 * @example
 * ```typescript
 * // Multiple recipients
 * await sendEmail({
 *   to: ["user1@example.com", "user2@example.com"],
 *   subject: "Training Announcement",
 *   html: htmlTemplate
 * });
 * ```
 */
export default async function send({
  to,
  subject,
  html,
}: {
  to: string[];
  subject: string;
  html: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  return await resend.emails.send({
    from: "Icpc assiut Community <no-replay@icpcpassiut.tech>",
    to,
    subject,
    html,
  });
}
