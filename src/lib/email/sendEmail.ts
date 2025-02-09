import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
export default async function send({
  to,
  subject,
  html,
}: {
  to: string[];
  subject: string;
  html: string;
}) {
  return await resend.emails.send({
    from: "Icpc assiut Community <no-replay@icpcpassiut.tech>",
    to,
    subject,
    html,
  });
}

console.log(await send({
  to: ["tammwy22@gmail.com"],
  subject: "Hello",
  html: "<h1>Hello</h1>",
}))
