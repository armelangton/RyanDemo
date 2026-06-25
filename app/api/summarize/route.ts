import { NextResponse } from "next/server";
import knowledgeBase from "../../../data/source-docs/sampleKnowledgeBase.json";

export const dynamic = "force-dynamic";

const systemPrompt = `You are generating an internal AI Engagement Readiness Packet for a fire protection employee.

Use the selected recall/product safety information and the selected preparation context to create practical internal guidance. You must reason across all provided context:
- selected recall data
- engagement type
- audience
- sample site profile
- selected Ryan Service Lens
- equipment/systems from the sample site
- upcoming reminder
- training/education need
- documentation or deficiency follow-up need
- related service consideration
- selected action
- responsible AI/source hierarchy
- demo source notes

Do not produce a generic recall summary.

The packet must include:
1. Readiness Score
2. Key Attention Flags
3. Internal Field Brief
4. Audience-Specific Talking Points
5. Equipment / Product Checklist
6. Training or Event Prep Notes
7. Related Service Considerations
8. Recommended Next Best Actions
9. Follow-Up Note Draft
10. Missing Information to Verify
11. Official Source Reminder

Readiness score:
- Return a number from 0 to 100.
- Readiness reflects preparation completeness, not code compliance or safety approval.
- Higher score when recall, engagement type, audience, sample site, known systems, reminder, and training need are present.
- Lower score when exact model, site equipment match, manufacturer documentation, service history, or recall applicability are unknown.

Source-aware output:
- Separate official recall facts from AI interpretation and internal follow-up where possible.
- Do not blur official facts with AI suggestions.
- Use source labels where appropriate: Known from source, Provided by user/demo profile, AI interpretation, Needs verification, Human review required.
- Treat official CPSC recall facts as source facts. Treat selected site profile and service lens as demo/user-provided context. Treat preparation guidance as AI interpretation.

Ryan-aligned service context:
- Protect: identify immediate safety or customer impact.
- Prevent: identify inspection, maintenance, training, testing, or documentation steps that reduce risk.
- Preserve: support system reliability, customer confidence, facility continuity, and follow-up planning.
- Every packet must reflect the selected Ryan Service Lens. If the lens does not clearly apply, state what needs verification instead of forcing the connection.

Audience guidance:
- Fire Department: response awareness, system behavior, scene safety, what crews should recognize/report, and likely recruit questions.
- Municipality: public safety, facility readiness, documentation, service planning, inspection timing, and risk prioritization.
- Facility Manager: maintenance, documentation, testing, inspection timing, and follow-up.
- Building Owner: safety, business continuity, documentation, risk reduction, and customer confidence.
- Internal Inspector: what to verify, field checks, missing information, equipment details, and follow-up.
- Instructor / Trainer: teaching points, examples, likely questions, materials to bring, and discussion prompts.

Do not use the word "upsell." Use "Related Service Considerations." Frame related service considerations as safety, education, maintenance, compliance awareness, documentation, prevention, modernization, customer confidence, or risk reduction.

Responsible AI boundaries:
- Do not make final code, engineering, legal, compliance, fire safety, inspection, or operational determinations.
- Do not claim a recall applies unless exact model/manufacturer/date range/site details confirm it.
- Remind the user to verify against official CPSC notices, manufacturer instructions, applicable codes, NFPA standards, company procedures, and qualified internal review.

Source hierarchy:
1. Official CPSC recall notices
2. Manufacturer instructions and product documentation
3. Applicable codes and NFPA standards
4. Company procedures and qualified internal review
5. Verified user-provided site/customer information
6. AI interpretation or preparation guidance`;

const responseSchema = {
  type: "json_schema",
  name: "fire_protection_engagement_readiness_packet",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      sourceContextUsed: {
        type: "array",
        items: { type: "string" },
      },
      knownSourceFacts: {
        type: "array",
        items: { type: "string" },
      },
      providedDemoProfileContext: {
        type: "array",
        items: { type: "string" },
      },
      aiInterpretation: {
        type: "array",
        items: { type: "string" },
      },
      readinessScore: { type: "number" },
      readinessScoreReason: { type: "string" },
      keyAttentionFlags: {
        type: "array",
        items: { type: "string" },
      },
      internalFieldBrief: { type: "string" },
      audienceSpecificTalkingPoints: {
        type: "array",
        items: { type: "string" },
      },
      equipmentProductChecklist: {
        type: "array",
        items: { type: "string" },
      },
      trainingOrEventPrepNotes: {
        type: "array",
        items: { type: "string" },
      },
      relatedServiceConsiderations: {
        type: "array",
        items: { type: "string" },
      },
      recommendedNextBestActions: {
        type: "array",
        items: { type: "string" },
      },
      followUpNoteDraft: { type: "string" },
      missingInformationToVerify: {
        type: "array",
        items: { type: "string" },
      },
      officialSourceReminder: { type: "string" },
    },
    required: [
      "sourceContextUsed",
      "knownSourceFacts",
      "providedDemoProfileContext",
      "aiInterpretation",
      "readinessScore",
      "readinessScoreReason",
      "keyAttentionFlags",
      "internalFieldBrief",
      "audienceSpecificTalkingPoints",
      "equipmentProductChecklist",
      "trainingOrEventPrepNotes",
      "relatedServiceConsiderations",
      "recommendedNextBestActions",
      "followUpNoteDraft",
      "missingInformationToVerify",
      "officialSourceReminder",
    ],
  },
};

const textValue = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : "not specified";

const listValue = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => textValue(item)).filter((item) => item !== "not specified");
  }
  const text = textValue(value);
  return text === "not specified" ? [] : [text];
};

const objectValue = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const actionLabel = (briefAction: string) => {
  switch (briefAction) {
    case "training_prep":
      return "training preparation";
    case "event_prep":
      return "event preparation";
    case "customer_talking_points":
      return "customer talking points";
    case "follow_up_notes":
      return "follow-up notes";
    case "inspection_prep":
    default:
      return "inspection preparation";
  }
};

const audienceGuidance = (audience: string) => {
  switch (audience) {
    case "Fire Department":
      return {
        talkingPoint:
          "For Fire Department audiences, focus on response awareness, system behavior, scene safety, what crews should recognize or report, and likely recruit questions.",
        trainingNote:
          "Prepare recruit-style questions about recognizing product labels, reporting suspected affected equipment, and understanding system behavior during an incident.",
        nextAction:
          "Prepare a response-awareness explanation before the training or event.",
        scoreModifier: -2,
      };
    case "Municipality":
      return {
        talkingPoint:
          "For Municipality audiences, focus on public safety, facility readiness, documentation, service planning, inspection timing, and risk prioritization.",
        trainingNote:
          "Prepare public-safety examples that connect documentation, inspection timing, and facility readiness without making final compliance determinations.",
        nextAction:
          "Prepare a documentation and inspection-timing discussion for municipal stakeholders.",
        scoreModifier: 1,
      };
    case "Building Owner":
      return {
        talkingPoint:
          "For Building Owner audiences, focus on safety, business continuity, documentation, risk reduction, and customer confidence.",
        trainingNote:
          "Prepare plain-language examples that connect safety documentation to business continuity and confidence.",
        nextAction:
          "Prepare a concise owner-facing risk-reduction explanation for internal review.",
        scoreModifier: -1,
      };
    case "Instructor / Trainer":
      return {
        talkingPoint:
          "For Instructor / Trainer audiences, focus on teaching points, examples, likely questions, materials to bring, and discussion prompts.",
        trainingNote:
          "Prepare discussion prompts, practical examples, and standards or manuals that should be verified before teaching.",
        nextAction:
          "Prepare instructor notes and likely attendee questions before the session.",
        scoreModifier: 0,
      };
    case "Facility Manager":
      return {
        talkingPoint:
          "For Facility Manager audiences, focus on maintenance, documentation, testing, inspection timing, and follow-up.",
        trainingNote:
          "Prepare maintenance and documentation prompts that help the facility team locate product and service history.",
        nextAction:
          "Prepare a maintenance-documentation checklist for the facility manager.",
        scoreModifier: 0,
      };
    case "Internal Inspector":
    default:
      return {
        talkingPoint:
          "For Internal Inspector audiences, focus on what to verify, field checks, missing information, equipment details, and follow-up.",
        trainingNote:
          "Prepare field-check prompts that help verify model, date range, equipment location, and service history.",
        nextAction:
          "Prepare a field verification checklist before the inspection.",
        scoreModifier: 0,
      };
  }
};

const calculateReadinessScore = ({
  recall,
  engagementType,
  audience,
  sampleSite,
  equipmentSystems,
  upcomingReminder,
  trainingNeed,
  serviceLens,
  siteProfile,
}: {
  recall: Record<string, unknown>;
  engagementType: string;
  audience: string;
  sampleSite: string;
  equipmentSystems: string[];
  upcomingReminder: string;
  trainingNeed: string;
  serviceLens: Record<string, unknown>;
  siteProfile: Record<string, unknown>;
}) => {
  let score = 10;
  if (textValue(recall.title) !== "not specified") score += 12;
  if (engagementType) score += 8;
  if (audience) score += 8;
  if (sampleSite && sampleSite !== "No sample site selected") score += 10;
  if (textValue(siteProfile.type) !== "not specified") score += 6;
  if (textValue(serviceLens.label) !== "not specified") score += 8;
  if (equipmentSystems.length) score += 12;
  if (upcomingReminder && upcomingReminder !== "No reminder selected") score += 8;
  if (trainingNeed && trainingNeed !== "No training need selected") score += 8;
  if (textValue(recall.manufacturer) !== "not specified") score += 3;
  if (textValue(recall.hazard) !== "not specified") score += 3;
  score += audienceGuidance(audience).scoreModifier;
  return Math.max(0, Math.min(92, score));
};

const fallbackPacket = ({
  recall,
  engagementType,
  audience,
  sampleSite,
  equipmentSystems,
  upcomingReminder,
  trainingNeed,
  documentationNeed,
  relatedServiceConsideration,
  serviceLens,
  siteProfile,
  sourceContext,
  briefAction,
}: {
  recall: Record<string, unknown>;
  engagementType: string;
  audience: string;
  sampleSite: string;
  equipmentSystems: string[];
  upcomingReminder: string;
  trainingNeed: string;
  documentationNeed: string;
  relatedServiceConsideration: string;
  serviceLens: Record<string, unknown>;
  siteProfile: Record<string, unknown>;
  sourceContext: Record<string, unknown>;
  briefAction: string;
}) => {
  const title = textValue(recall.title);
  const manufacturer = textValue(recall.manufacturer);
  const product = textValue(recall.productDescription);
  const hazard = textValue(recall.hazard);
  const remedy = textValue(recall.remedy);
  const serviceLensLabel = textValue(serviceLens.label);
  const serviceLensFocus = listValue(serviceLens.focus);
  const siteType = textValue(siteProfile.type);
  const primaryAudience = textValue(siteProfile.primaryAudience);
  const sourceContextUsed = listValue(sourceContext.sourceContextUsed);
  const audienceContext = audienceGuidance(audience);
  const score = calculateReadinessScore({
    recall,
    engagementType,
    audience,
    sampleSite,
    equipmentSystems,
    upcomingReminder,
    trainingNeed,
    serviceLens,
    siteProfile,
  });
  const systemsText = equipmentSystems.length
    ? equipmentSystems.join(", ")
    : "site equipment/systems not selected";

  return {
    sourceContextUsed: sourceContextUsed.length
      ? sourceContextUsed
      : [
          `CPSC recall result: ${title}`,
          `Sample site profile: ${sampleSite}`,
          `Ryan Service Lens: ${serviceLensLabel}`,
          `Engagement type: ${engagementType}`,
          `Audience: ${audience}`,
          "Demo source notes: service environment brief, source hierarchy, documentation/deficiency follow-up logic, and training/event prep frameworks",
        ],
    knownSourceFacts: [
      `Known from source: CPSC recall title is "${title}".`,
      `Known from source: manufacturer/company is ${manufacturer}.`,
      `Known from source: product description is ${product}.`,
      `Known from source: listed hazard is ${hazard}.`,
      `Known from source: listed remedy is ${remedy}.`,
    ],
    providedDemoProfileContext: [
      `Provided by user/demo profile: selected site profile is ${sampleSite} (${siteType}).`,
      `Provided by user/demo profile: primary audience is ${primaryAudience}.`,
      `Provided by user/demo profile: known systems are ${systemsText}.`,
      `Provided by user/demo profile: upcoming reminder is ${upcomingReminder}.`,
      `Provided by user/demo profile: training or education need is ${trainingNeed}.`,
      `Provided by user/demo profile: documentation need is ${documentationNeed}.`,
      `Provided by user/demo profile: selected Ryan Service Lens is ${serviceLensLabel}, focused on ${serviceLensFocus.join(", ") || "not specified"}.`,
    ],
    aiInterpretation: [
      `AI interpretation: use the ${serviceLensLabel} lens to prepare ${actionLabel(briefAction)} for ${engagementType}.`,
      "AI interpretation: compare recall product details with site equipment before making any customer-facing statement.",
      "AI interpretation: connect related service considerations to safety, documentation, prevention, customer confidence, and risk reduction.",
      "Human review required: route any safety, code, compliance, inspection, engineering, or customer communication decision through qualified internal review.",
    ],
    readinessScore: score,
    readinessScoreReason:
      "Readiness reflects preparation completeness, not code compliance or safety approval. The score is limited because exact model match, site applicability, manufacturer documentation, and service history still need verification.",
    keyAttentionFlags: [
      "Model verification needed",
      "Site applicability unknown",
      "Manufacturer instructions should be checked",
      "Human review required",
      upcomingReminder !== "No reminder selected"
        ? "Related inspection reminder"
        : "Service documentation review",
      trainingNeed !== "No training need selected"
        ? "Training or education opportunity"
        : "Missing training context",
    ],
    internalFieldBrief: `For ${engagementType}, prepare ${actionLabel(briefAction)} for ${audience} using the ${serviceLensLabel} service lens. Source fact from recall: "${title}" lists manufacturer/company as ${manufacturer}, product context as ${product}, hazard as ${hazard}, and remedy as ${remedy}. Provided demo profile context: ${sampleSite} includes ${systemsText}, with reminder "${upcomingReminder}" and documentation need "${documentationNeed}". AI interpretation: compare recall details with site systems before discussing applicability.`,
    audienceSpecificTalkingPoints: [
      audienceContext.talkingPoint,
      "Describe the product, hazard, and remedy in plain language.",
      "Ask whether the site has matching equipment, model numbers, date ranges, or service history.",
      "Emphasize that official CPSC and manufacturer documentation must be checked before action.",
    ],
    equipmentProductChecklist: [
      `Verify manufacturer/company: ${manufacturer}.`,
      `Verify product or description: ${product}.`,
      "Confirm exact product model, serial/date code, and installation location.",
      `Compare selected site systems: ${systemsText}.`,
      "Confirm whether the recall remedy has already been completed.",
    ],
    trainingOrEventPrepNotes: [
      audienceContext.trainingNote,
      `Training/education need: ${trainingNeed}.`,
      `Ryan Service Lens focus: ${serviceLensFocus.join(", ") || "not specified"}.`,
      `Upcoming reminder: ${upcomingReminder}.`,
      `Documentation/deficiency context: ${documentationNeed}.`,
      "Prepare examples of how employees should identify product labels or report concerns.",
      "Avoid final compliance or inspection determinations during prep discussion.",
    ],
    relatedServiceConsiderations: [
      relatedServiceConsideration,
      ...serviceLensFocus.map((item) => `${serviceLensLabel}: ${item}`),
      "Fire extinguisher training",
      "Emergency lighting inspections",
      "Alarm system testing",
      "Sprinkler inspections",
      "Hydrant inspection / flow testing",
      "Special hazard system review",
      "Preventive maintenance",
      "Documentation review",
      "Recurring inspection reminders",
      "Continuing education topic follow-up",
    ].filter((item, index, array) => item && array.indexOf(item) === index),
    recommendedNextBestActions: [
      audienceContext.nextAction,
      "Verify exact product model and affected date range.",
      "Confirm whether the product is installed at the selected site.",
      "Review official CPSC notice and manufacturer remedy instructions.",
      "Review related service considerations with a qualified internal employee.",
    ],
    followUpNoteDraft: `Reviewed public recall information for ${title} while preparing for ${engagementType} with ${audience}. Need to verify exact model, affected date range, site equipment match, manufacturer instructions, service history, and whether remedy has been completed. Related service considerations include ${relatedServiceConsideration || "documentation review and preventive maintenance"}. Next step: route findings through qualified internal review before customer or operational action.`,
    missingInformationToVerify: [
      "Exact product model",
      "Manufacturer documentation",
      "Install date",
      "Site equipment list",
      "Service history",
      "Customer training history",
      "Applicable standard or code reference",
      "Whether the item is installed at the selected site",
      "Whether the product is within the affected recall range",
      "Whether the recall remedy has already been completed",
    ],
    officialSourceReminder:
      "Verify against official CPSC notices, manufacturer instructions, applicable codes, NFPA standards, company procedures, and qualified internal review. This packet does not make final code, engineering, legal, compliance, fire safety, inspection, or operational determinations.",
  };
};

export async function POST(request: Request) {
  let recall: Record<string, unknown> | null = null;
  let engagementType = "Inspection";
  let audience = "Internal Inspector";
  let sampleSite = "No sample site selected";
  let equipmentSystems: string[] = [];
  let upcomingReminder = "No reminder selected";
  let trainingNeed = "No training need selected";
  let documentationNeed = "No documentation need selected";
  let relatedServiceConsideration = "Documentation review";
  let serviceLens: Record<string, unknown> = (
    knowledgeBase.serviceLenses as Record<string, unknown>[]
  )[0];
  let siteProfile: Record<string, unknown> = {};
  let sourceContext: Record<string, unknown> = {};
  let briefAction = "inspection_prep";

  try {
    const body = await request.json();
    recall = body?.recall ?? null;
    engagementType =
      typeof body?.engagementType === "string" ? body.engagementType : engagementType;
    audience = typeof body?.audience === "string" ? body.audience : audience;
    sampleSite =
      typeof body?.sampleSite === "string" ? body.sampleSite : sampleSite;
    equipmentSystems = listValue(body?.equipmentSystems);
    upcomingReminder =
      typeof body?.upcomingReminder === "string"
        ? body.upcomingReminder
        : upcomingReminder;
    trainingNeed =
      typeof body?.trainingNeed === "string" ? body.trainingNeed : trainingNeed;
    documentationNeed =
      typeof body?.documentationNeed === "string"
        ? body.documentationNeed
        : documentationNeed;
    relatedServiceConsideration =
      typeof body?.relatedServiceConsideration === "string"
        ? body.relatedServiceConsideration
        : relatedServiceConsideration;
    serviceLens = objectValue(body?.serviceLens);
    if (!textValue(serviceLens.label) || textValue(serviceLens.label) === "not specified") {
      serviceLens = (knowledgeBase.serviceLenses as Record<string, unknown>[])[0];
    }
    siteProfile = objectValue(body?.siteProfile);
    sourceContext = objectValue(body?.sourceContext);
    briefAction =
      typeof body?.briefAction === "string" ? body.briefAction : briefAction;

    if (!recall) {
      return NextResponse.json({ error: "Recall data is required." }, { status: 400 });
    }

    const fallback = fallbackPacket({
      recall,
      engagementType,
      audience,
      sampleSite,
      equipmentSystems,
      upcomingReminder,
      trainingNeed,
      documentationNeed,
      relatedServiceConsideration,
      serviceLens,
      siteProfile,
      sourceContext,
      briefAction,
    });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ guidance: fallback, source: "fallback" });
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
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: JSON.stringify(
              {
                engagementType,
                audience,
                sampleSite,
                equipmentSystems,
                upcomingReminder,
                trainingNeed,
                documentationNeed,
                relatedServiceConsideration,
                serviceLens,
                siteProfile,
                sourceContext,
                briefAction,
                recall,
              },
              null,
              2,
            ),
          },
        ],
        text: { format: responseSchema },
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

    return NextResponse.json({ guidance: JSON.parse(text), source: "openai" });
  } catch (error) {
    console.error(error);
    if (recall) {
      return NextResponse.json({
        guidance: fallbackPacket({
          recall,
          engagementType,
          audience,
          sampleSite,
          equipmentSystems,
          upcomingReminder,
          trainingNeed,
          documentationNeed,
          relatedServiceConsideration,
          serviceLens,
          siteProfile,
          sourceContext,
          briefAction,
        }),
        source: "fallback",
      });
    }

    return NextResponse.json(
      { error: "Unable to generate engagement readiness packet right now." },
      { status: 502 },
    );
  }
}
