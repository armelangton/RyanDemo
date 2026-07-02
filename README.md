# Engagement Assistant

An internal employee preparation demo inspired by Ryan Fire Protection service workflows. The app helps fire protection employees prepare for inspections, service visits, customer training, site surveys, project coordination, documentation review, and customer conversations.

This is not official Ryan Fire Protection software. It is a concept prototype created for demonstration purposes and is not affiliated with or endorsed by Ryan Fire Protection, Inc.

## Purpose

Fire protection employees often prepare from scattered information: site context, installed equipment, service history, documentation gaps, public product safety notices, manufacturer details to verify, training resources, customer-facing talking points, and follow-up items.

This demo shows how an assistant-style interface can organize that information into a practical readiness packet before work starts.

## What This App Does

The app lets a user select:

- Team
- Site
- Task

It then generates an **AI Engagement Readiness Packet** locally from structured sample context in the app. The packet highlights what to review, prioritize, verify, and discuss before, during, and after the engagement.

The app also performs public CPSC recall checks from selected equipment context. Recall and product safety information is treated as verification context only, not as a final determination.

## Local Packet Generation

The current demo does not call any paid AI API. Packet content is generated locally from structured sample data, selected options, public recall results, and reusable preparation logic in the app.

This keeps the live demo stable and reviewable without requiring API keys or external AI billing.

## Product Safety / Recall Context

The public recall route remains part of the demo:

```text
/api/recalls?q=...
```

It searches public CPSC recall data and returns possible matches for review. Possible matches must be verified against official CPSC notices, manufacturer guidance, exact model/date ranges, site records, applicable codes, NFPA standards, company procedures, AHJ requirements, and qualified professional review.

The app does not decide whether a recall applies to a customer site.

## Responsible Use

The packet supports preparation only. It does not provide code compliance, safety approval, inspection authority, engineering judgment, manufacturer direction, legal advice, or recall applicability determinations.

Employees should verify all important details against official documentation, manufacturer instructions, applicable standards, company procedures, local AHJ requirements, and qualified internal review before action.

## Source Data

Demo source documents live in:

```text
data/source-docs/
```

The source pack provides representative fire protection service context without using private company data.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- CPSC recall/public recall data route
- Vercel Analytics

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

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Use the default Next.js settings.
4. Deploy.

No AI API key is required for the current demo.

## Health Check

The app includes:

```text
/api/health
```

This returns a small JSON status object for the local demo and recall route.
