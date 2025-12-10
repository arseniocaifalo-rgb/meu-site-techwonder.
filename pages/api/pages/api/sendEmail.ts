import type { NextApiRequest, NextApiResponse } from "next"
import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { to, subject, text, html } = req.body

  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject,
      text,
      html,
    })
    res.status(200).json({ message: "Email enviado com sucesso!" })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: "Falha ao enviar o email" })
  }
}
