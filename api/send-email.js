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
  const replyEmail = process.env.REPLY_TO_EMAIL || toEmail;

  if (!apiKey) {
    return res.status(500).json({
      message: "Quote email is not fully set up yet. Please call or WhatsApp us.",
    });
  }

  const { formType = "Website enquiry", name, email, phone, plan, message } = req.body || {};
  const cleanFormType = String(formType).trim() || "Website enquiry";
  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim();
  const cleanPhone = String(phone || "").trim();
  const cleanPlan = String(plan || "").trim();
  const cleanMessage = String(message || "").trim();

  if (!cleanName || !cleanPhone) {
    return res.status(400).json({ message: "Please provide your name and cell number." });
  }

  const subjectParts = ["Deni Funerals", cleanFormType];
  if (cleanPlan) subjectParts.push(cleanPlan);
  if (cleanName) subjectParts.push(cleanName);
  const subject = subjectParts.join(" - ");

  const salesHtml = `
    <h2>${escapeHtml(cleanFormType)}</h2>
    <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(cleanEmail || "Not provided")}</p>
    <p><strong>Cell:</strong> ${escapeHtml(cleanPhone)}</p>
    <p><strong>Selected plan:</strong> ${escapeHtml(cleanPlan || "Not selected")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(cleanMessage || "No message provided").replace(/\n/g, "<br />")}</p>
  `;

  const salesText = [
    cleanFormType,
    `Name: ${cleanName}`,
    `Email: ${cleanEmail || "Not provided"}`,
    `Cell: ${cleanPhone}`,
    `Selected plan: ${cleanPlan || "Not selected"}`,
    "",
    "Message:",
    cleanMessage || "No message provided",
  ].join("\n");

  const mailRequests = [
    {
      from: fromEmail,
      to: [toEmail],
      reply_to: cleanEmail || undefined,
      subject,
      html: salesHtml,
      text: salesText,
    },
  ];

  if (cleanEmail) {
    const customerSubject = "Deni Funerals received your quote request";
    const customerHtml = `
      <h2>Thank you, ${escapeHtml(cleanName)}</h2>
      <p>We have received your quote request and one of our sales agents will get back to you shortly.</p>
      <p><strong>Selected plan:</strong> ${escapeHtml(cleanPlan || "Not selected")}</p>
      <p><strong>Cell number:</strong> ${escapeHtml(cleanPhone)}</p>
      <p>If your request is urgent, please call or WhatsApp us on <strong>064 877 8580</strong>.</p>
      <p>Kind regards,<br />Deni Funerals</p>
    `;
    const customerText = [
      `Thank you, ${cleanName}`,
      "",
      "We have received your quote request and one of our sales agents will get back to you shortly.",
      "",
      `Selected plan: ${cleanPlan || "Not selected"}`,
      `Cell number: ${cleanPhone}`,
      "",
      "If your request is urgent, please call or WhatsApp us on 064 877 8580.",
      "",
      "Kind regards,",
      "Deni Funerals",
    ].join("\n");

    mailRequests.push({
      from: fromEmail,
      to: [cleanEmail],
      reply_to: replyEmail,
      subject: customerSubject,
      html: customerHtml,
      text: customerText,
    });
  }

  try {
    for (const mail of mailRequests) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mail),
      });

      if (!response.ok) {
        return res.status(502).json({ message: "Email could not be sent." });
      }
    }
  } catch (error) {
    return res.status(502).json({ message: "Email service could not be reached." });
  }

  return res.status(200).json({ message: "Message sent successfully." });
};
