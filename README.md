# Fire Protection Field Assistant

An internal field assistant proof of concept inspired by fire protection service workflows. The app helps inspectors, instructors, and field employees prepare for inspections, customer training, customer meetings, and public safety events.

This is not official Ryan Fireprotection software. It is a concept prototype created for demonstration purposes and is not affiliated with or endorsed by Ryan Fireprotection, Inc.

## Purpose

Fire protection employees often need to prepare using information from multiple sources. This app demonstrates how public recall data and AI-assisted guidance could help employees quickly organize safety information, explain technical issues in plain language, and identify related service considerations before or after a customer engagement.

## Live Data Source

The primary working feature is **Product Safety Lookup**, which searches public CPSC recall data through the existing `/api/recalls` route.

The CPSC recall search does not require an account or API key.

Users can search by:

- Product
- Manufacturer
- Model number
- Keyword
- Hazard
- Remedy
- Description

## AI Field Briefs

The app uses `/api/summarize` to turn a selected recall into an internal field brief with:

- Quick Summary
- What Matters
- Safety or Recall Items to Check
- Customer Talking Points
- Related Service Considerations
- Recommended Follow-Up
- Official Source Reminder

If `OPENAI_API_KEY` is configured, the app uses OpenAI. If no key is configured, it displays a local demo fallback so the app still works visually during review.

## Responsible AI

AI-generated guidance should be reviewed against official CPSC notices, manufacturer instructions, applicable codes, NFPA standards, and company procedures before action is taken. The app is intended to support preparation and review, not replace professional judgment or official documentation.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- CPSC Recalls API
- OpenAI Responses API

## Environment Variables

Create a `.env.local` file only if you want live OpenAI summaries:

```bash
OPENAI_API_KEY=your_api_key_here
```

Optional:

```bash
OPENAI_MODEL=gpt-4.1-mini
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Deploy to Vercel Free Tier

1. Push the project to GitHub.
2. Create a free Vercel account.
3. Import the GitHub repository into Vercel.
4. Use the default Next.js settings.
5. Add `OPENAI_API_KEY` in Vercel Project Settings if live AI summaries are needed.
6. Deploy.

The CPSC recall lookup can work without additional secrets.

## Custom GPT Action

The app includes:

```text
/public/openapi.json
```

When deployed, the OpenAPI file will be available at:

```text
https://your-domain.vercel.app/openapi.json
```

To connect it to a Custom GPT Action:

1. Deploy the app to a public URL.
2. Open the GPT builder.
3. Add a new Action.
4. Import the schema from `/openapi.json`.
5. Update the server URL if needed.
6. Use the `/api/recalls?q=...` operation to search public CPSC recall data.

## Health Check

The app includes:

```text
/api/health
```

This returns a small JSON status object showing whether AI summaries are using OpenAI or fallback demo mode.
