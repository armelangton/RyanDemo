import OpenAI from "openai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type GeneratePacketRequest = {
  team?: unknown;
  environment?: unknown;
  engagementType?: unknown;
};

const packetInstructions = `You are an AI assistant that generates Fire Protection Engagement Readiness Packets.

Turn scattered details into a clear AI-generated packet. Relevant context, verification items, talking points, and next steps should be bundled into one easy-to-read report.

Build every packet from three contribution layers:
- Team = the user's work perspective and priorities.
- Site Type = the site/context risks, constraints, and considerations.
- Task = the work, conversation, or activity being prepared for.

Every selected option must visibly affect the output. If Team changes, the packet should change. If Site Type changes, the packet should change. If Task changes, the packet should change.

Do not produce a generic packet that only repeats the selected labels.

The website supplies this title and subtitle:
AI Engagement Readiness Packet
What to review, verify, and discuss before walking into the engagement.

Return Markdown using these approved sections only:
1. Summary
2. Preparation Priorities
3. Before the [task word]
4. During the [task word]
5. After the [task word]
6. Items Requiring Verification
7. Talking/Teaching/Field/Review/Coordination Questions
8. Follow-up Resources

Choose the Before/During/After and question section labels from the Task:
- Inspection: Before the Inspection, During the Inspection, After the Inspection, Talking Points and Likely Questions
- System Testing: Before Testing, During Testing, After Testing, Testing Questions and Follow-Up Items
- Service Follow-Up: Before the Follow-Up, During the Follow-Up, After the Follow-Up, Service Questions and Follow-Up Items
- Training Session: Before the Session, During the Session, After the Session, Teaching Points and Likely Questions
- Customer Meeting: Before the Meeting, During the Meeting, After the Meeting, Talking Points and Likely Questions
- Site Survey: Before the Survey, During the Survey, After the Survey, Field Questions and Follow-Up Items
- Plan Review: Before the Review, During the Review, After the Review, Review Questions and Follow-Up Items
- Project Coordination: Before Coordination, During Coordination, After Coordination, Coordination Questions and Follow-Up Items

Do not add any other section names. Do not create separate sections for raw equipment tables, perspective-only wrappers, checklist wrappers, missing-info labels, next-step-only labels, customer script labels, cross-team context, draft notes, or standalone equipment detail tables.

Equipment, manufacturer, product safety, recall, documentation, and asset details should be summarized inside Items Requiring Verification, the task-specific questions section, or Follow-up Resources when relevant.

Keep the packet practical, concise, scannable, and field-ready.
Use 3-5 bullets per section unless more detail is necessary.
Do not imply official code interpretation, manufacturer direction, or final compliance guidance.
Flag anything that requires verification against official documentation, manufacturer guidance, NFPA standards, applicable codes, company procedures, local AHJ requirements, or qualified professional review.

Preferred language:
- AI-generated packet
- easy-to-read report
- relevant context
- verification items
- talking points
- next steps

Avoid:
- brief
- smart
- overusing the word engagement in supporting copy.`;

const getRequiredString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : "";

export async function POST(request: Request) {
  let body: GeneratePacketRequest;

  try {
    body = (await request.json()) as GeneratePacketRequest;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const team = getRequiredString(body.team);
  const environment = getRequiredString(body.environment);
  const engagementType = getRequiredString(body.engagementType);

  if (!team || !environment || !engagementType) {
    return NextResponse.json(
      { error: "team, site type, and task are required." },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OpenAI API key is not configured on the server. Add OPENAI_API_KEY to the deployment environment.",
      },
      { status: 500 },
    );
  }

  try {
    const openai = new OpenAI({ apiKey });
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: packetInstructions,
        },
        {
          role: "user",
          content: `Generate the packet in Markdown for this selection:

Team: ${team}
Site Type: ${environment}
Task: ${engagementType}`,
        },
      ],
      temperature: 0.4,
      max_output_tokens: 1400,
    });

    const packetMarkdown = response.output_text?.trim();

    if (!packetMarkdown) {
      return NextResponse.json(
        { error: "OpenAI did not return packet content. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ packetMarkdown });
  } catch (error) {
    console.error(
      "generate-packet OpenAI error:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return NextResponse.json(
      { error: "Unable to generate the packet right now. Please try again." },
      { status: 500 },
    );
  }
}
