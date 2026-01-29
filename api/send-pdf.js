import { Resend } from "resend";
import { readFile } from "node:fs/promises";
import path from "node:path";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { email } = req.body || {};
    if (!isValidEmail(email)) {
      return res.status(400).send("Invalid email");
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).send("Missing RESEND_API_KEY");
    }
    if (!process.env.MAIL_FROM) {
      return res.status(500).send("Missing MAIL_FROM");
    }

    // ✅ PDF moved to /public
    const pdfPath = path.join(process.cwd(), "public", "confirmation.pdf");
    const pdf = await readFile(pdfPath);

    // optional sanity checks (helpful while debugging)
    if (pdf.length < 1000) return res.status(500).send("PDF too small / missing");
    if (!pdf.slice(0, 5).toString("utf8").startsWith("%PDF-")) {
      return res.status(500).send("File is not a valid PDF");
    }

    const result = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: [email],
      subject: "POTWIERDZENIE WALENTYNKOWE 💘",
      html: "<p>W załączniku jest potwierdzenie 💖</p>",
      attachments: [
        {
          filename: "confirmation.pdf",
          content: pdf.toString("base64"),
          contentType: "application/pdf"
        }
      ]
    });

    return res.status(200).json({ ok: true, id: result?.data?.id ?? null });
  } catch (err) {
    console.error("SEND ERROR:", err);
    return res.status(500).send(err?.message ? String(err.message) : "Email send failed");
  }
}
