# Fire Protection Field Assistant

An internal field assistant proof of concept inspired by Ryan Fire Protection service workflows. The app helps inspectors, instructors, service managers, and field employees prepare for inspections, customer training, customer meetings, public safety events, and continuing education prep.

This is not official Ryan Fire Protection software. It is a concept prototype created for demonstration purposes and is not affiliated with or endorsed by Ryan Fire Protection, Inc.

## Purpose

Fire protection employees often need to prepare using information from multiple sources. This app demonstrates how public recall data and AI-assisted guidance could help employees quickly organize safety information, explain technical issues in plain language, and identify related service considerations before or after a customer engagement.

The project is intentionally framed as an AI implementation concept rather than a software engineering showcase. It uses a practical public-data workflow to show how an internal employee could combine recall information, service context, audience needs, and responsible review boundaries before taking action.

## What This App Does

The app lets a Ryan Fire Protection-style internal user search public CPSC product recall data, select a relevant recall, choose an engagement type, choose an audience, select a sample site profile, and apply a Ryan Service Lens. It then generates an AI Engagement Readiness Packet that organizes the recall and context into practical preparation guidance.

The packet is designed to help employees understand what to verify, what to discuss, what questions may come up, what related service considerations may matter, and what information still needs official or internal review.

## Who It Is For

This proof of concept is intended for internal fire protection employees such as:

- Inspectors preparing for field visits
- Service managers reviewing safety-related customer questions
- Trainers preparing customer or fire department education
- Account or customer-facing employees preparing for meetings
- Employees supporting municipality or public safety events
- Continuing education presenters preparing discussion material

It is not a customer portal, CRM, LMS, inspection authority, or compliance decision system.

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

The app uses `/api/summarize` to turn a selected recall into an **AI Engagement Readiness Packet**. The request includes the selected recall, engagement type, audience, sample site profile, Ryan Service Lens, equipment/systems, upcoming reminder, documentation need, related service consideration, and requested preparation action.

Available brief actions:

- Generate Inspection Prep
- Generate Training Prep
- Generate Event Prep
- Generate Customer Talking Points
- Generate Follow-Up Notes

The readiness packet includes:

- Source Context Used
- Known from Source
- Provided by User/Demo Profile
- AI Interpretation
- Readiness Score
- Key Attention Flags
- Internal Field Brief
- Audience-Specific Talking Points
- Equipment / Product Checklist
- Training or Event Prep Notes
- Related Service Considerations
- Recommended Next Best Actions
- Follow-Up Note Draft
- Missing Information to Verify
- Official Source Reminder

If `OPENAI_API_KEY` is configured, the app uses OpenAI. If no key is configured, it displays a local demo fallback so the app still works visually during review.

## Source Pack

Demo source documents live in:

```text
data/source-docs/
```

The source pack gives the prototype a more realistic fire protection service context without using private company data. It includes:

- Ryan-style service environment notes
- Ryan Service Lens guidance
- sample site profiles
- engagement prep frameworks
- demo source notes/manual-style excerpts
- responsible AI and source hierarchy guidance
- `sampleKnowledgeBase.json` for structured demo selectors

The app uses the structured knowledge base to power the Ryan Service Lens selector and source-aware AI context.

## Why Public Recall Data Was Selected

Public CPSC recall data was chosen because it is realistic, useful, and available without assuming access to internal systems. A fire protection employee may occasionally need to review product safety notices, but the real implementation question is broader: can AI reduce research time, clarify technical information, and help employees prepare more consistently while still requiring human review?

This prototype demonstrates that workflow using public data plus a small demo source pack.

## How AI Enhances Review

AI is used to organize and translate context, not to make final determinations. The assistant separates official recall facts, demo profile context, AI interpretation, missing information, and human review reminders. It helps an employee prepare questions, talking points, checklists, follow-up notes, and related service considerations before an engagement.

It does not decide whether a recall applies to a customer site. That still requires exact model information, manufacturer documentation, service history, official notices, applicable standards, company procedures, and qualified internal review.

## Responsible AI

AI-generated guidance should be reviewed against official CPSC notices, manufacturer instructions, applicable codes, NFPA standards, company procedures, and qualified internal review before action is taken. The app is intended to support preparation and review, not replace professional judgment, manufacturer guidance, regulatory requirements, inspection judgment, engineering judgment, or official documentation.

The readiness score reflects preparation completeness only. It does not imply code compliance, safety approval, or recall applicability.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- CPSC Recalls API
- OpenAI Responses API

## Future Enhancement Ideas

- Add richer internal document retrieval after data governance review
- Connect approved service record fields through a secure integration
- Add manager-reviewed customer communication templates
- Improve model/date-range extraction from official recall notices
- Add exportable internal prep packet PDFs
- Add role-specific source filters for inspectors, trainers, and service leaders

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
