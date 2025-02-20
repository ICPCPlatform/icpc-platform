import { Resend } from "resend";
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
