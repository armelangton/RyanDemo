import { NextResponse } from "next/server";
import knowledgeBase from "../../../data/source-docs/sampleKnowledgeBase.json";

export const dynamic = "force-dynamic";

const systemPrompt = `You are generating an internal AI Preparation Brief for a fire protection employee.

Use the selected preparation context and optional recall/product safety information to create practical internal guidance. You must use available context in this order:
- client/site record
- role
- role-specific engagement
- equipment/assets from the selected client/site record
- engagement type
- audience
- sample site profile
- installed equipment/products from the selected site profile
- selected preparation focus, if provided
- additional manual/site/training notes
- sample equipment/product verification context
- optional manual recall data, if present
- equipment/systems from the sample site
- upcoming reminder
- training/education need
- documentation or deficiency follow-up need
- related service consideration
- selected action
- responsible AI/source hierarchy
- demo source notes
- instructor/event prep resources
- additional manual/site/training notes

This is an internal customer engagement preparation workspace. Do not produce a generic recall summary. Help the employee prepare for inspections, customer training, fire department/recruit training, municipality/public safety events, conventions/trade shows, customer meetings, and continuing education prep.
Use the user-facing output name "AI Preparation Brief." Do not use older packet titles in generated text.
The packet should make the AI value clear by combining client/site context, equipment/assets, service or training history, open discrepancies, missing information, product safety/recall context, checklist questions, and resources to review.
If product/manufacturer safety context is available, treat it only as verification context. Do not mention manual recall selection or automatic review mechanics in the user-facing output.

The brief should answer: "What does this specific employee need to know before this engagement?"
Do not produce identical emphasis for every role. Adapt the content to the selected role. Include equipment/product information only when it supports that role's work.

Do not create a dense report, lesson library, source-material workflow, recall lookup tool, or generic chatbot output. The value should be visible through concise guidance that combines selected client/site, role, engagement type, equipment/assets, open items, relevant resources, and product/manufacturer verification reminders.

The JSON response must include:
1. Source Context Used
2. Key Attention Flags
3. Internal Field Brief
4. Customer / Audience Talking Points
5. Installed Equipment Review
6. Product Safety / Recall Review
7. Instructor / Event Prep Notes
8. Protect / Prevent / Preserve Lens
9. Deficiency / Documentation Follow-Up
10. Related Service Considerations
11. Recommended Next Best Actions
12. Follow-Up Note Draft
13. Missing Information to Verify
14. Official Source Reminder

Role-specific output:
- If role is "Inspector", focus on site and inspection context, systems to inspect, prior inspection history, open deficiencies, relevant procedures/documentation, items to verify onsite, customer-facing explanation points, and recommended follow-up. Do not over-focus on generic equipment information unless it supports inspection readiness.
- If role is "Instructor", focus on audience profile, learning objectives, class/topic outline, teaching points, demonstration ideas, reference materials, likely questions, and follow-up resources. Do not assume instructors need customer inspection history or prior deficiencies unless the selected scenario is site-specific training.
- If role is "Service Technician", focus on work order/service context, reported issue, prior service history, relevant equipment/manuals, likely parts or documentation, troubleshooting considerations, safety or verification steps, and recommended follow-up.
- If role is "Sales / Account Manager", focus on customer/account summary, recent service or inspection activity, open issues or deficiencies, upcoming work, relationship notes, meeting talking points, suggested questions, and follow-up opportunities. Do not make this overly technical unless the engagement requires it.
- If role is "Service Manager", focus on operational summary, schedule/job status, open work or escalations, technician/resource concerns, customer priority items, risks/blockers, and recommended next actions. Do not make this a field inspection packet.
- Mention attendance or documentation only if it appears in the selected sample context.
- Do not invent official standard numbers, certification requirements, or credit rules unless source text is provided.

Source-aware output:
- Separate official recall facts from AI interpretation and internal follow-up where possible.
- Do not blur official facts with AI suggestions.
- Use source labels where appropriate: Known from source, Provided by user/demo profile, AI interpretation, Needs verification, Human review required.
- Treat official product/manufacturer notices as source facts. Treat selected site profile and preparation focus as demo/user-provided context. Treat preparation guidance as AI interpretation.

Ryan-aligned service context:
- Protect: identify immediate safety or customer impact.
- Prevent: identify inspection, maintenance, training, testing, or documentation steps that reduce risk.
- Preserve: support system reliability, customer confidence, facility continuity, and follow-up planning.
- Use the selected preparation focus only as supporting context. If it does not clearly apply, state what needs verification instead of forcing the connection.
- Treat training resources, product knowledge, manufacturer documentation, and event preparation material as preparation context unless explicitly provided as official source facts.

Audience guidance:
- Fire Department: response awareness, system behavior, scene safety, what crews should recognize/report, and likely recruit questions.
- Recruit Class: recruit-friendly explanations, response awareness, demo materials, likely questions, and product safety examples that must be verified.
- Municipality: public safety, facility readiness, documentation, service planning, inspection timing, and risk prioritization.
- Facility Manager: maintenance, documentation, testing, inspection timing, and follow-up.
- Building Owner: safety, business continuity, documentation, risk reduction, and customer confidence.
- Safety Coordinator: site equipment, training records, reporting issues, follow-up, and customer-friendly explanations.
- Convention Attendee: concise service talking points, product safety examples to verify, related service considerations, and follow-up capture.
- Internal Sales / Marketing Team: event readiness, talking points, materials, demo equipment, lead capture, related service discussion prompts, and follow-up routing.
- Prospective Customer: concise customer-friendly explanations, service fit, safety-focused talking points, product safety examples to verify, and follow-up capture.
- Internal Inspector: what to verify, field checks, missing information, equipment details, and follow-up.
- Instructor / Trainer: teaching points, examples, likely questions, materials to bring, and discussion prompts.

Engagement guidance:
- Inspection / Testing / Maintenance: focus on asset records, inspection/test status, certification/service status, documentation gaps, recall/safety status verification, deficiencies, on-site verification, and after-visit follow-up.
- Deficiency / Service Follow-Up: focus on open deficiencies, service needs, customer-facing explanation, ownership, next steps, and what must be verified before action.
- Documentation / Compliance Review: focus on existing records, missing records, documentation status, certification/service status, deficiencies, corrections needed, and customer/internal review readiness.
- Site Survey / Asset Capture: focus on manufacturer, model, SKU/product number, serial number, location, condition, install/service dates, documentation status, photos/notes needed, and open questions.
- Customer Training / Demonstration: focus on teaching/demo flow, equipment explanation, likely questions, attendance/documentation reminders, what to verify before site-specific claims, and what to say to the audience.
- Design / Construction Coordination: focus on scope, asset/system assumptions, site constraints, project/design questions, construction/installation readiness, materials/equipment context, coordination needs, and follow-up items.

Do not use the word "upsell." Use "Related Service Considerations." Frame related service considerations as safety, education, maintenance, compliance awareness, documentation, prevention, modernization, customer confidence, or risk reduction.
Group Related Service Considerations under Safety / Risk Reduction, Maintenance / Testing, Customer Education, Documentation / Follow-Up, and Modernization / Replacement Discussion.

Responsible AI boundaries:
- Do not make final code, engineering, legal, compliance, fire safety, inspection, or operational determinations.
- Do not claim a recall applies unless exact model/manufacturer/date range/site details confirm it.
- Remind the user to verify against official sources, manufacturer instructions, applicable codes, NFPA standards, company procedures, and qualified internal review.

Concise output rules:
- Prefer 3 to 5 bullets per array section.
- Keep bullets short, practical, and field-friendly.
- Avoid generic AI explanation language.
- Put the most important information first.
- Avoid long paragraphs except the Follow-Up Note Draft.
- Do not repeat the same verification disclaimer in every section.
- Keep Official Source Reminder as the final verification reminder.
- Keep Related Service Considerations grouped but concise.
- Do not include readiness scores, percentages, dashboard metrics, or raw search-term dumps.
- Do not present photo upload, barcode scanning, or signature capture as working features.
- The packet should feel like onsite or session guidance, not a long generated report.

Source hierarchy:
1. Official product/manufacturer notices
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
      role: { type: "string" },
      selectedTopics: {
        type: "array",
        items: { type: "string" },
      },
      keyAttentionFlags: {
        type: "array",
        items: { type: "string" },
      },
      internalFieldBrief: { type: "string" },
      standardsObjectiveAlignment: {
        type: "array",
        items: { type: "string" },
      },
      simpleLessonPlan: {
        type: "array",
        items: { type: "string" },
      },
      materialsEquipmentNeeded: {
        type: "array",
        items: { type: "string" },
      },
      certificationAttendanceReminders: {
        type: "array",
        items: { type: "string" },
      },
      audienceSpecificTalkingPoints: {
        type: "array",
        items: { type: "string" },
      },
      installedEquipmentReview: {
        type: "array",
        items: { type: "string" },
      },
      productSafetyRecallReview: {
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
      protectPreventPreserveLens: {
        type: "array",
        items: { type: "string" },
      },
      deficiencyDocumentationFollowUp: {
        type: "array",
        items: { type: "string" },
      },
      relatedServiceConsiderations: {
        type: "array",
        items: { type: "string" },
      },
      relatedServiceGroups: {
        type: "object",
        additionalProperties: false,
        properties: {
          safetyRiskReduction: { type: "array", items: { type: "string" } },
          maintenanceTesting: { type: "array", items: { type: "string" } },
          customerEducation: { type: "array", items: { type: "string" } },
          documentationFollowUp: { type: "array", items: { type: "string" } },
          modernizationReplacement: { type: "array", items: { type: "string" } },
        },
        required: [
          "safetyRiskReduction",
          "maintenanceTesting",
          "customerEducation",
          "documentationFollowUp",
          "modernizationReplacement",
        ],
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
      "role",
      "selectedTopics",
      "keyAttentionFlags",
      "internalFieldBrief",
      "standardsObjectiveAlignment",
      "simpleLessonPlan",
      "materialsEquipmentNeeded",
      "certificationAttendanceReminders",
      "audienceSpecificTalkingPoints",
      "installedEquipmentReview",
      "productSafetyRecallReview",
      "equipmentProductChecklist",
      "trainingOrEventPrepNotes",
      "protectPreventPreserveLens",
      "deficiencyDocumentationFollowUp",
      "relatedServiceConsiderations",
      "relatedServiceGroups",
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

const objectListValue = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value)
    ? (value.filter(
        (item) => item && typeof item === "object" && !Array.isArray(item),
      ) as Record<string, unknown>[])
    : [];

const extractResponseText = (payload: unknown) => {
  const response = objectValue(payload);
  if (typeof response.output_text === "string") {
    return response.output_text;
  }

  const output = Array.isArray(response.output) ? response.output : [];
  for (const item of output) {
    const content = objectValue(item).content;
    if (!Array.isArray(content)) continue;

    for (const part of content) {
      const partObject = objectValue(part);
      if (
        partObject.type === "output_text" &&
        typeof partObject.text === "string"
      ) {
        return partObject.text;
      }
    }
  }

  return "";
};

const logOpenAiError = (error: unknown) => {
  if (error instanceof Error) {
    console.error("OpenAI summarize failed", {
      name: error.name,
      message: error.message,
    });
    return;
  }

  console.error("OpenAI summarize failed", { error: String(error) });
};

const safeErrorMessage = (error: unknown) => {
  const message =
    error instanceof Error ? error.message : String(error);

  if (message.includes("insufficient_quota")) {
    return "OpenAI API quota exceeded or billing limit reached.";
  }
  if (message.includes("invalid_api_key")) {
    return "OpenAI API key was rejected.";
  }
  if (message.includes("rate_limit")) {
    return "OpenAI API rate limit reached.";
  }

  return "OpenAI generation failed; structured fallback was used.";
};

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
      };
    case "Recruit Class":
      return {
        talkingPoint:
          "For Recruit Class audiences, focus on recruit-friendly explanations, response awareness, demo materials, likely questions, and product safety examples that must be verified.",
        trainingNote:
          "Prepare practical examples and likely recruit questions about system behavior, labels, alarms, hydrants, pumps, and what to report.",
        nextAction:
          "Prepare recruit-facing demo notes and verify product safety examples before instruction.",
      };
    case "Municipality":
      return {
        talkingPoint:
          "For Municipality audiences, focus on public safety, facility readiness, documentation, service planning, inspection timing, and risk prioritization.",
        trainingNote:
          "Prepare public-safety examples that connect documentation, inspection timing, and facility readiness without making final compliance determinations.",
        nextAction:
          "Prepare a documentation and inspection-timing discussion for municipal stakeholders.",
      };
    case "Building Owner":
      return {
        talkingPoint:
          "For Building Owner audiences, focus on safety, business continuity, documentation, risk reduction, and customer confidence.",
        trainingNote:
          "Prepare plain-language examples that connect safety documentation to business continuity and confidence.",
        nextAction:
          "Prepare a concise owner-facing risk-reduction explanation for internal review.",
      };
    case "Safety Coordinator":
      return {
        talkingPoint:
          "For Safety Coordinator audiences, focus on site equipment, documentation, training records, reporting issues, follow-up, and customer-friendly explanations.",
        trainingNote:
          "Prepare practical prompts about recurring checks, reporting channels, training completion, and records that need review.",
        nextAction:
          "Prepare a safety-coordinator checklist for equipment, records, and unresolved follow-up items.",
      };
    case "Convention Attendee":
      return {
        talkingPoint:
          "For Convention Attendee audiences, focus on concise service talking points, product safety examples to verify, related service considerations, and follow-up capture.",
        trainingNote:
          "Prepare short, customer-friendly explanations and route technical questions to qualified internal review.",
        nextAction:
          "Prepare event follow-up notes for questions, related service interest, and verification items.",
      };
    case "Internal Sales / Marketing Team":
      return {
        talkingPoint:
          "For Internal Sales / Marketing Team audiences, focus on event readiness, talking points, materials, demo equipment, lead capture, related service prompts, and follow-up routing.",
        trainingNote:
          "Prepare concise booth or event talking points and identify technical questions that need qualified follow-up.",
        nextAction:
          "Prepare a lead-capture and follow-up routing plan for the internal team.",
      };
    case "Prospective Customer":
      return {
        talkingPoint:
          "For Prospective Customer audiences, focus on concise customer-friendly explanations, service fit, safety-focused talking points, product safety examples to verify, and follow-up capture.",
        trainingNote:
          "Prepare plain-language examples and avoid making final technical, compliance, or safety determinations.",
        nextAction:
          "Prepare a prospective-customer follow-up note with verification items and next steps.",
      };
    case "Instructor / Trainer":
    case "Instructor":
      return {
        talkingPoint:
          "For Instructor audiences, focus on teaching points, examples, likely questions, materials to bring, and discussion prompts.",
        trainingNote:
          "Prepare discussion prompts, practical examples, and standards or manuals that should be verified before teaching.",
        nextAction:
          "Prepare instructor notes and likely attendee questions before the session.",
      };
    case "Facility Manager":
      return {
        talkingPoint:
          "For Facility Manager audiences, focus on maintenance, documentation, testing, inspection timing, and follow-up.",
        trainingNote:
          "Prepare maintenance and documentation prompts that help the facility team locate product and service history.",
        nextAction:
          "Prepare a maintenance-documentation checklist for the facility manager.",
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
      };
  }
};

const fallbackPacket = ({
  recall,
  role,
  roleEngagement,
  selectedTopics,
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
  prepResources,
  additionalNotes,
  briefAction,
  installedEquipment,
  automaticSafetyReview,
}: {
  recall: Record<string, unknown>;
  role: string;
  roleEngagement: string;
  selectedTopics: string[];
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
  prepResources: Record<string, unknown>;
  additionalNotes: string;
  briefAction: string;
  installedEquipment: Record<string, unknown>[];
  automaticSafetyReview: Record<string, unknown>;
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
  const hasRecall = title !== "not specified";
  const prepMaterials = listValue(prepResources.materials);
  const prepTopics = listValue(prepResources.topics);
  const prepQuestions = listValue(prepResources.questions);
  const audienceContext = audienceGuidance(audience);
  const safetyMatches = objectListValue(automaticSafetyReview.possibleMatches);
  const noMatchTerms = listValue(automaticSafetyReview.noObviousMatchTerms);
  const autoNeedsVerification = listValue(automaticSafetyReview.needsVerification);
  const equipmentReview = installedEquipment.length
    ? installedEquipment.map((item) => {
        const category = textValue(item.category);
        const productName = textValue(item.productName);
        const itemManufacturer = textValue(item.manufacturer);
        const model = textValue(item.model);
        const location = textValue(item.locationContext);
        const status = textValue(item.serviceStatus);
        const note = textValue(item.documentationNote);
        const training = textValue(item.trainingRelevance);
        return `Provided by user/demo profile: ${category} - ${productName}; manufacturer ${itemManufacturer}; model ${model}; location/context ${location}; service status ${status}; documentation note ${note}; training relevance ${training}.`;
      })
    : ["No installed equipment/products were provided in the selected site profile."];
  const productSafetyReview = [
    installedEquipment.length
      ? `Sample equipment context includes ${installedEquipment.length} installed equipment item${installedEquipment.length === 1 ? "" : "s"} for verification.`
      : "Sample equipment details need verification before they can provide useful context.",
    safetyMatches.length
      ? `Possible recall matches found: ${safetyMatches
          .slice(0, 5)
          .map((match) => {
            const recall = objectValue(match.recall);
            return `${textValue(match.searchTerm)} -> ${textValue(recall.title)}`;
          })
          .join("; ")}.`
      : "No confirmed safety match is listed in the sample context.",
    noMatchTerms.length
      ? `${noMatchTerms.length} equipment review item${noMatchTerms.length === 1 ? "" : "s"} still requires official source verification.`
      : "Product/manufacturer context still needs human verification.",
    ...(autoNeedsVerification.length
      ? autoNeedsVerification.map((item) => `Needs verification: ${item}`)
      : [
          "Needs verification: verify model, manufacturer, date range, installed equipment, and official source before action.",
        ]),
    hasRecall
      ? `Product/manufacturer safety context selected: ${title}. Treat this as additional context only until verified.`
      : "Packet is based on selected engagement, sample site context, equipment records, documentation needs, and training context.",
  ];
  const systemsText = equipmentSystems.length
    ? equipmentSystems.join(", ")
    : "site equipment/systems not selected";
  const roleFocus = (() => {
    switch (role) {
      case "Inspector":
        return {
          flags: [
            "Prior deficiencies should be reviewed",
            "Inspection documentation should be checked",
            "Onsite verification needed",
          ],
          brief:
            "Focus on inspection scope, systems to inspect, prior findings, open deficiencies, documentation, customer explanation points, and follow-up.",
          actions: [
            "Review prior inspection history and open deficiencies.",
            "Prepare onsite verification items.",
            "Confirm documentation needed for the inspection report.",
          ],
        };
      case "Instructor":
        return {
          flags: [
            "Audience level should be confirmed",
            "Teaching materials should be reviewed",
            "Likely questions should be prepared",
          ],
          brief:
            "Focus on audience needs, learning objectives, topic outline, teaching points, demonstrations, reference materials, likely questions, and follow-up resources.",
          actions: [
            "Confirm audience and learning objectives.",
            "Prepare teaching points and demonstration ideas.",
            "Review reference materials before the session.",
          ],
        };
      case "Service Technician":
        return {
          flags: [
            "Reported issue should be confirmed",
            "Prior service history should be reviewed",
            "Manuals or technical notes may be needed",
          ],
          brief:
            "Focus on work order context, reported issue, prior service history, relevant equipment/manuals, troubleshooting notes, safety steps, and follow-up.",
          actions: [
            "Review work order and prior service notes.",
            "Prepare troubleshooting questions and documentation.",
            "Confirm safety and verification steps before work.",
          ],
        };
      case "Sales / Account Manager":
        return {
          flags: [
            "Recent customer activity should be reviewed",
            "Open issues need a clear owner",
            "Meeting talking points should be prepared",
          ],
          brief:
            "Focus on customer/account summary, recent service or inspection activity, open issues, upcoming work, relationship notes, meeting talking points, and follow-up opportunities.",
          actions: [
            "Review recent customer activity and open issues.",
            "Prepare meeting talking points and suggested questions.",
            "Capture follow-up opportunities and internal handoffs.",
          ],
        };
      case "Service Manager":
        return {
          flags: [
            "Schedule or job status should be confirmed",
            "Resource concerns may need review",
            "Escalations need clear ownership",
          ],
          brief:
            "Focus on operational summary, schedule and job status, open work or escalations, technician/resource concerns, customer priorities, risks, and next actions.",
          actions: [
            "Confirm schedule, job status, and open work.",
            "Identify technician/resource concerns and blockers.",
            "Assign owners for escalations and next actions.",
          ],
        };
      default:
        return {
          flags: ["Human review required"],
          brief:
            "Focus on the selected role, engagement, facility context, open items, and preparation needs.",
          actions: ["Review the selected context with the appropriate internal owner."],
        };
    }
  })();

  return {
    sourceContextUsed: sourceContextUsed.length
      ? sourceContextUsed
      : [
          "Sample product/manufacturer verification context based on equipment records",
          hasRecall
            ? `Product/manufacturer safety context: ${title}`
            : "Packet is based on selected engagement, sample site context, equipment records, documentation needs, and training context.",
          `Sample site profile: ${sampleSite}`,
          `Preparation focus: ${serviceLensLabel}`,
          `Engagement type: ${engagementType}`,
          `Audience: ${audience}`,
          "Demo source notes: service environment brief, source hierarchy, documentation/deficiency follow-up logic, and training/event prep frameworks",
        ],
    knownSourceFacts: hasRecall
      ? [
          `Known from source: product/manufacturer notice title is "${title}".`,
          `Known from source: manufacturer/company is ${manufacturer}.`,
          `Known from source: product description is ${product}.`,
          `Known from source: listed hazard is ${hazard}.`,
          `Known from source: listed remedy is ${remedy}.`,
        ]
      : [
          "Packet is based on selected engagement, sample site context, equipment records, documentation needs, and training context.",
        ],
    providedDemoProfileContext: [
      `Provided by user/demo profile: selected site profile is ${sampleSite} (${siteType}).`,
      `Provided by user/demo profile: primary audience is ${primaryAudience}.`,
      `Provided by user/demo profile: known systems are ${systemsText}.`,
      ...equipmentReview,
      `Provided by user/demo profile: upcoming reminder is ${upcomingReminder}.`,
      `Provided by user/demo profile: training or education need is ${trainingNeed}.`,
      `Provided by user/demo profile: documentation need is ${documentationNeed}.`,
      `Provided by user/demo profile: selected preparation focus is ${serviceLensLabel}, focused on ${serviceLensFocus.join(", ") || "not specified"}.`,
      `Provided by user/demo profile: prep resources include ${[...prepMaterials, ...prepTopics, ...prepQuestions].slice(0, 6).join(", ") || "not specified"}.`,
      `Provided by user/demo profile: additional manual/site/training notes are ${additionalNotes || "not provided"}.`,
    ],
    aiInterpretation: [
      `AI interpretation: use selected preparation context to prepare ${role} work for ${roleEngagement || engagementType}.`,
      hasRecall
        ? "AI interpretation: compare optional manual recall product details with installed site equipment before making any customer-facing statement."
        : "AI interpretation: prepare the engagement packet from sample site context, equipment records, audience, documentation needs, and training context.",
      "AI interpretation: connect related service considerations to safety, documentation, prevention, customer confidence, and risk reduction.",
      "Human review required: route any safety, code, compliance, inspection, engineering, or customer communication decision through qualified internal review.",
    ],
    role,
    selectedTopics,
    keyAttentionFlags: [
      ...roleFocus.flags,
      "Manufacturer instructions should be checked",
      "Human review required",
      upcomingReminder !== "No reminder selected"
        ? "Related inspection reminder"
        : "Service documentation review",
      trainingNeed !== "No training need selected"
        ? "Training or education opportunity"
        : "Missing training context",
    ],
    internalFieldBrief: `For ${role || "employee"} ${roleEngagement || engagementType}, prepare for ${sampleSite}. ${roleFocus.brief} ${hasRecall ? `Product/manufacturer context: "${title}" lists manufacturer/company as ${manufacturer}, product context as ${product}, hazard as ${hazard}, and remedy as ${remedy}.` : "Product and manufacturer details need verification before use."}`,
    standardsObjectiveAlignment:
      role === "Instructor"
        ? [
            `Draft objective: attendees can explain practical field awareness for ${selectedTopics.join(", ") || "the selected equipment/assets"}.`,
            `Alignment note: connect ${roleEngagement || "the training session"} to approved department, company, and manufacturer materials before delivery.`,
            "Check for understanding: ask attendees to identify one field condition, one documentation item, and one issue to escalate.",
            "Draft alignment for planning purposes. Verify against current Indiana, Pro Board/IFSAC, NFPA, department, company, and AHJ requirements before using for credit or certification.",
          ]
        : [],
    simpleLessonPlan:
      role === "Instructor"
        ? [
            "Open with the training objective, audience expectations, and safety boundaries.",
            `Teach from the selected equipment/assets: ${selectedTopics.join(", ") || "not specified"}.`,
            "Use site equipment, demo materials, or approved examples to connect concepts to field conditions.",
            "Close with check-for-understanding questions, attendance documentation, and follow-up items.",
          ]
        : [],
    materialsEquipmentNeeded:
      role === "Instructor"
        ? [
            "Training outline or agenda",
            "Attendance/sign-in record",
            "Approved equipment examples, photos, manuals, or handouts",
            "Follow-up notes for unresolved technical or standards questions",
          ]
        : [],
    certificationAttendanceReminders:
      role === "Instructor"
        ? [
            "Confirm attendance documentation requirements before the session.",
            "Verify whether certificate, credit, or standards language is approved before use.",
            "Route certification, standards, or AHJ questions through qualified review.",
          ]
        : [],
    audienceSpecificTalkingPoints: [
      audienceContext.talkingPoint,
      hasRecall
        ? "Describe the product, hazard, and remedy in plain language."
        : "Use plain-language talking points based on the engagement, site profile, equipment/assets, and prep resources.",
      hasRecall
        ? "Ask whether the site has matching equipment, model numbers, date ranges, or service history."
        : "Ask what equipment, documentation, training history, or site details should be reviewed before the engagement.",
      "Emphasize that official sources and manufacturer documentation must be checked before action.",
    ],
    installedEquipmentReview: equipmentReview,
    productSafetyRecallReview: productSafetyReview,
    equipmentProductChecklist: [
      hasRecall
        ? `Verify manufacturer/company: ${manufacturer}.`
        : "Verify product and manufacturer details from sample equipment records, site notes, and training context.",
      hasRecall
        ? `Verify product or description: ${product}.`
        : "Confirm relevant equipment, systems, or customer details before using the packet.",
      "Confirm exact product model, serial/date code, and installation location.",
      `Compare selected site systems: ${systemsText}.`,
      hasRecall
        ? "Confirm whether the recall remedy has already been completed."
        : "Confirm whether any product-specific follow-up requires official manufacturer or internal review.",
    ],
    trainingOrEventPrepNotes: [
      audienceContext.trainingNote,
      `Training/education need: ${trainingNeed}.`,
      `Preparation focus: ${serviceLensFocus.join(", ") || "not specified"}.`,
      `Upcoming reminder: ${upcomingReminder}.`,
      `Documentation/deficiency context: ${documentationNeed}.`,
      `Additional manual/site/training notes: ${additionalNotes || "none provided"}.`,
      `Prep materials/resources: ${prepMaterials.join(", ") || "not specified"}.`,
      "Prepare examples of how employees should identify product labels or report concerns.",
      "Avoid final compliance or inspection determinations during prep discussion.",
    ],
    protectPreventPreserveLens: [
      `Protect: identify immediate safety or customer impact for ${engagementType}.`,
      `Prevent: use ${serviceLensLabel} context to identify inspection, maintenance, training, testing, or documentation steps that reduce risk.`,
      "Preserve: support long-term system reliability, facility continuity, customer confidence, and follow-up planning.",
    ],
    deficiencyDocumentationFollowUp: [
      `Review documentation/deficiency context: ${documentationNeed}.`,
      "Capture open questions, photos, service notes, reports, and unresolved deficiencies for qualified internal review.",
      "Confirm whether follow-up reminders, customer communication, quote preparation, or service leadership review are needed.",
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
      "Continuing education service follow-up",
    ].filter((item, index, array) => item && array.indexOf(item) === index),
    relatedServiceGroups: {
      safetyRiskReduction: [
        "Review safety-sensitive issues with a qualified internal employee.",
        "Use selected context to identify risk reduction and prevention considerations.",
      ],
      maintenanceTesting: [
        "Review inspection, testing, maintenance, and preventive maintenance needs.",
        "Consider alarm testing, sprinkler inspections, extinguisher readiness, hydrant testing, or emergency lighting where relevant.",
      ],
      customerEducation: [
        "Prepare customer-friendly explanations and likely attendee questions.",
        "Consider customer training or continuing education follow-up when relevant.",
      ],
      documentationFollowUp: [
        "Review inspection reports, service notes, photos, deficiencies, and follow-up reminders.",
        "Document unresolved questions for manager or technical review.",
      ],
      modernizationReplacement: [
        "Discuss replacement or modernization only when safety-related and verified by qualified review.",
        "Confirm manufacturer guidance and site applicability before recommending action.",
      ],
    },
    recommendedNextBestActions: [
      ...roleFocus.actions,
      audienceContext.nextAction,
      hasRecall
        ? "Verify exact product model and affected date range."
        : "Confirm whether product, equipment, or training details need to be added before the engagement.",
      hasRecall
        ? "Confirm whether the product is installed at the selected site."
        : "Review site profile, known systems, prep resources, and additional notes with the appropriate internal owner.",
      hasRecall
        ? "Review official source and manufacturer remedy instructions."
        : "Verify manufacturer documentation, applicable standards, and company procedures for any product-specific discussion.",
      "Review related service considerations with a qualified internal employee.",
    ],
    followUpNoteDraft: `Prepared engagement packet for ${engagementType} with ${audience}. Need to verify product/equipment details, site equipment match, manufacturer instructions, service history, training context, and open documentation questions. Related service considerations include ${relatedServiceConsideration || "documentation review and preventive maintenance"}. Next step: route findings through qualified internal review before customer or operational action.`,
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
      "Verify against official sources, manufacturer instructions, applicable codes, NFPA standards, company procedures, and qualified internal review. This packet does not make final code, engineering, legal, compliance, fire safety, inspection, or operational determinations.",
  };
};

export async function POST(request: Request) {
  let recall: Record<string, unknown> = {};
  let role = "Inspector";
  let roleEngagement = "Inspection / Testing";
  let selectedTopics: string[] = [
    "Sprinkler Systems",
    "Extinguishers",
    "Emergency Lighting",
  ];
  let engagementType = "Inspect / service";
  let audience = "Facility Manager";
  let sampleSite = "Municipal Facilities Account";
  let equipmentSystems: string[] = [];
  let upcomingReminder = "Annual inspection cycle due in 28 days.";
  let trainingNeed =
    "Facilities team refresher on monthly visual checks, documentation expectations, and when to contact service support.";
  let documentationNeed =
    "Inspection reports, emergency lighting test documentation, extinguisher inspection status, alarm testing records, and open deficiency notes.";
  let relatedServiceConsideration = "Documentation review";
  let serviceLens: Record<string, unknown> = (
    knowledgeBase.serviceLenses as Record<string, unknown>[]
  )[0];
  let siteProfile: Record<string, unknown> = {};
  let sourceContext: Record<string, unknown> = {};
  let prepResources: Record<string, unknown> = {};
  let additionalNotes = "";
  let briefAction = "inspection_prep";
  let installedEquipment: Record<string, unknown>[] = [];
  let automaticSafetyReview: Record<string, unknown> = {};

  try {
    const body = await request.json();
    recall = body?.recall && typeof body.recall === "object" ? body.recall : {};
    role = typeof body?.role === "string" ? body.role : role;
    roleEngagement =
      typeof body?.roleEngagement === "string" ? body.roleEngagement : roleEngagement;
    selectedTopics = listValue(body?.selectedTopics);
    if (!selectedTopics.length) {
      selectedTopics =
        role === "Instructor"
          ? ["NFPA 13 Basics", "Tool Safety"]
          : ["Sprinkler Systems", "Extinguishers", "Emergency Lighting"];
    }
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
    prepResources = objectValue(body?.prepResources);
    additionalNotes =
      typeof body?.additionalNotes === "string" ? body.additionalNotes.trim() : "";
    briefAction =
      typeof body?.briefAction === "string" ? body.briefAction : briefAction;
    installedEquipment = objectListValue(body?.installedEquipment);
    automaticSafetyReview = objectValue(body?.automaticSafetyReview);

    const fallback = fallbackPacket({
      recall,
      role,
      roleEngagement,
      selectedTopics,
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
      prepResources,
      additionalNotes,
      briefAction,
      installedEquipment,
      automaticSafetyReview,
    });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        guidance: fallback,
        source: "fallback",
        fallbackReason: "OPENAI_API_KEY is not configured.",
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
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: JSON.stringify(
              {
                engagementType,
                role,
                roleEngagement,
                selectedTopics,
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
                prepResources,
                additionalNotes,
                installedEquipment,
                automaticSafetyReview,
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
    const text = extractResponseText(payload);
    if (!text) {
      throw new Error("OpenAI response did not include output text.");
    }

    return NextResponse.json({ guidance: JSON.parse(text), source: "openai" });
  } catch (error) {
    logOpenAiError(error);
    if (recall) {
      return NextResponse.json({
        guidance: fallbackPacket({
          recall,
          role,
          roleEngagement,
          selectedTopics,
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
          prepResources,
          additionalNotes,
          briefAction,
          installedEquipment,
          automaticSafetyReview,
        }),
        source: "fallback",
        fallbackReason: safeErrorMessage(error),
      });
    }

    return NextResponse.json(
      { error: "Unable to generate engagement packet right now." },
      { status: 502 },
    );
  }
}
