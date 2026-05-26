# Deni Funerals Quote Email Setup

The quote and contact forms submit to `api/send-email.js`.

Deploy the site on Vercel so the static pages and `api/send-email.js` serverless function are hosted together.

Add these environment variables in the Vercel project settings:

```text
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=admin@denifuneral.co.za
FROM_EMAIL=Deni Funerals <quotes@denifuneral.co.za>
REPLY_TO_EMAIL=admin@denifuneral.co.za
```

`RESEND_API_KEY` is required. `CONTACT_TO_EMAIL` already defaults to `admin@denifuneral.co.za`, but setting it in hosting keeps the destination explicit.

When a form is submitted, Deni receives the quote/enquiry details and the client receives an automatic confirmation email saying the request was received and a sales agent will get back to them.

If the domain email has not been verified yet, use the sender address Resend provides until `denifuneral.co.za` is verified. For best results, verify `denifuneral.co.za` in Resend, then use `quotes@denifuneral.co.za` as the sender.

Deployment checklist:

1. Create or open the project on Vercel.
2. Add the environment variables above.
3. Deploy the project.
4. Submit the quote form with a real email address.
5. Confirm Deni receives the quote details and the client receives the confirmation email.
