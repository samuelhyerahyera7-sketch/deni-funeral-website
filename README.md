# Deni Funerals Website

Static website for Deni Funerals with quote and contact forms.

## What Is Included

- Home, About, Funeral Plans, Payment Options, Products, Quote, Contact, Terms, and Privacy pages
- Responsive styling in `styles.css`
- Site interactions in `script.js`
- Email form endpoint in `api/send-email.js`
- Minimal Vercel config in `vercel.json`

## Email Form Flow

When a visitor submits the quote or contact form:

1. Deni receives the form details by email.
2. The visitor receives an automatic confirmation email.
3. The page shows a success message saying a sales agent will get back to them.

## Environment Variables

Add these in Vercel under Project Settings > Environment Variables:

```text
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=admin@denifuneral.co.za
FROM_EMAIL=Deni Funerals <quotes@denifuneral.co.za>
REPLY_TO_EMAIL=admin@denifuneral.co.za
```

Do not commit real API keys to GitHub. Use `.env.example` as the template.

## Deploy From GitHub To Vercel

1. Upload or push this folder to a GitHub repository.
2. In Vercel, choose Add New Project.
3. Import the GitHub repository.
4. Keep the default build settings.
5. Add the environment variables listed above.
6. Deploy.
7. Test the quote form with a real email address.

If Vercel shows an old failed deployment, redeploy after pushing the latest `vercel.json`.

## Local Preview

If Vercel CLI is installed:

```bash
npm run start
```

Then open the local URL shown by Vercel.

## Notes

For best email deliverability, verify `denifuneral.co.za` in Resend before using `quotes@denifuneral.co.za` as the sender address.
