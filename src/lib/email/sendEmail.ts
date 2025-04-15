import { Resend } from "resend";


/**
 * Send an email using the Resend API.
 * @param to - The email address to send the email to
 * @param subject - The subject of the email 
 * @param html - The HTML content of the email
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
    from: "Icpc assiut Community <no-reply@icpcpassiut.tech>",
    to,
    subject,
    html,
  });
}
