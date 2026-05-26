# Deni Funerals Quote Email Setup

The quote and contact forms submit to `api/send-email.js`.

Deploy the site on Vercel so the static pages and `api/send-email.js` serverless function are hosted together.

Add these environment variables in the Vercel project settings:

```text
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=admin@denifuneral.co.za
FROM_EMAIL=Deni Funerals <admin@denifuneral.co.za>
REPLY_TO_EMAIL=admin@denifuneral.co.za
```

`RESEND_API_KEY` is required. `CONTACT_TO_EMAIL` already defaults to `admin@denifuneral.co.za`, but setting it in hosting keeps the destination explicit.

When a form is submitted, Deni receives the quote/enquiry details and the client receives an automatic confirmation email saying the request was received and a sales agent will get back to them.

Verify `denifuneral.co.za` in Resend, then use `admin@denifuneral.co.za` as the sender.

Deployment checklist:

1. Create or open the project on Vercel.
2. Add the environment variables above.
3. Deploy the project.
4. Submit the quote form with a real email address.
5. Confirm Deni receives the quote details and the client receives the confirmation email.

If the deployed form does not send email, check these first:

- `RESEND_API_KEY` must be set in Vercel for Production, not only Preview or Development.
- `FROM_EMAIL` must be a sender Resend accepts. Use `Deni Funerals <admin@denifuneral.co.za>` after `denifuneral.co.za` is verified in Resend.
- After changing environment variables in Vercel, redeploy the site. Old deployments do not automatically pick up new environment values.
- Check Vercel > Deployments > latest deployment > Functions/Runtime Logs for the exact email error returned by Resend.
