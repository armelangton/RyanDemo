import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const systemPrompt = `You are assisting a fire protection field employee preparing for an inspection, customer training, fire department / convention event, or customer meeting. Based only on the recall data and engagement type provided, create a clear, practical internal field brief. Do not invent facts. If information is missing, say what needs to be verified. Use a calm, professional, safety-focused tone. Do not use the word upsell. Frame related service considerations around safety, education, compliance, maintenance, risk reduction, modernization, or customer confidence. Include: quick summary, what matters, safety or recall items to check, customer talking points, related service considerations, recommended follow-up, and official source reminder.`;

const responseSchema = {
  type: "json_schema",
  name: "fire_recall_action_guidance",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      plainEnglishSummary: { type: "string" },
      whyItMatters: { type: "string" },
      internalFollowUp: {
        type: "array",
        items: { type: "string" },
      },
      serviceTeamChecklist: {
        type: "array",
        items: { type: "string" },
      },
      customerCommunicationDraft: { type: "string" },
      riskReviewNote: { type: "string" },
    },
    required: [
      "plainEnglishSummary",
      "whyItMatters",
      "internalFollowUp",
      "serviceTeamChecklist",
      "customerCommunicationDraft",
      "riskReviewNote",
    ],
  },
};

const textValue = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : "not specified";

const fallbackGuidance = (
  recall: Record<string, unknown>,
  engagementType: string,
) => ({
  plainEnglishSummary: `Demo field brief for ${engagementType}: this public recall record should be reviewed before the engagement. The selected notice is "${textValue(recall.title)}".`,
  whyItMatters: `The listed hazard is ${textValue(recall.hazard)}. Confirm whether the customer has affected products, models, date ranges, or related equipment before drawing conclusions.`,
  internalFollowUp: [
    "Check customer records for matching manufacturer, product, model, or date range.",
    "Review the official CPSC notice and manufacturer instructions before customer communication.",
    "Escalate potential matches to the appropriate service leader or manager.",
    "Document any next steps in the approved internal workflow.",
  ],
  serviceTeamChecklist: [
    "Verify product name, model number, serial number, and installation location.",
    "Confirm the remedy listed in the official notice.",
    "Check whether related inspections, testing, maintenance, or training should be discussed.",
    "Avoid making compliance or legal claims without internal review.",
  ],
  customerCommunicationDraft: `For ${engagementType.toLowerCase()} preparation: We are reviewing public product safety information related to equipment that may be relevant to your facility. If we identify a potential match, we will confirm details against the official recall notice and manufacturer guidance before recommending next steps.`,
  riskReviewNote:
    "AI-generated guidance should be reviewed against official CPSC notices, manufacturer instructions, applicable codes, NFPA standards, and company procedures before action is taken.",
});

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const body = await request.json();
    const recall = body?.recall;
    const engagementType =
      typeof body?.engagementType === "string" ? body.engagementType : "Inspection";

    if (!recall) {
      return NextResponse.json({ error: "Recall data is required." }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({
        guidance: fallbackGuidance(recall, engagementType),
        source: "fallback",
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Engagement type: ${engagementType}\n\nRecall data:\n${JSON.stringify(recall, null, 2)}`,
          },
        ],
        text: {
          format: responseSchema,
        },
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`OpenAI request failed: ${message}`);
    }

    const payload = await response.json();
    const text = payload.output_text;

    if (typeof text !== "string") {
      throw new Error("OpenAI response did not include output_text.");
    }

    return NextResponse.json({ guidance: JSON.parse(text) });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to generate AI summary right now." },
      { status: 502 },
    );
  }
}
