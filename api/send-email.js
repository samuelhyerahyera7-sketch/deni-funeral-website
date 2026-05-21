const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || "admin@denifuneral.co.za";
  const fromEmail = process.env.FROM_EMAIL || "Deni Funerals <onboarding@resend.dev>";

  if (!apiKey) {
    return res.status(500).json({ message: "Email service is not configured." });
  }

  const { formType = "Website enquiry", name, email, phone, plan, message } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ message: "Please provide your name and cell number." });
  }

  const subject = `Deni Funerals: ${formType}`;
  const html = `
    <h2>${escapeHtml(formType)}</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email || "Not provided")}</p>
    <p><strong>Cell:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Selected plan:</strong> ${escapeHtml(plan || "Not selected")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message || "No message provided").replace(/\n/g, "<br />")}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email || undefined,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    return res.status(502).json({ message: "Email could not be sent." });
  }

  return res.status(200).json({ message: "Message sent successfully." });
};
