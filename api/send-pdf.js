import { Resend } from "resend";
import { readFile } from "node:fs/promises";
import path from "node:path";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { email } = req.body || {};
    if (!email) return res.status(400).send("Missing email");

    const pdfPath = path.join(process.cwd(), "confirmation.pdf");
    const pdf = await readFile(pdfPath);

    await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: [email],
      subject: "POTWIERDZENIE WALENTYNKOWE 💘",
      html: "<p>W załączniku jest potwierdzenie 💖</p>",
      attachments: [
        { filename: "confirmation.pdf", content: pdf.toString("base64") }
      ]
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("SEND ERROR:", err);
    return res.status(500).send("Email send failed");
  }
}
