import { NextResponse } from "next/server";
import knowledgeBase from "../../../data/source-docs/sampleKnowledgeBase.json";

export const dynamic = "force-dynamic";

const systemPrompt = `You are generating an internal AI Engagement Readiness Packet for a fire protection employee.

Use the selected preparation context and optional recall/product safety information to create practical internal guidance. You must use available context in this order:
- role
- role-specific engagement
- selected services
- engagement type
- audience
- sample site profile
- installed equipment/products from the selected site profile
- selected Ryan Service Lens
- additional manual/site/training notes
- automatic product safety review results
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
Manual recall data is optional. If no manual recall is selected, say: "No manual product safety recall selected. Packet is based on engagement, site, service, prep context, and automatic product safety review." If a manual recall is selected, include it as optional manual product safety context.

The packet should support the existing UI packet structure.

For Inspector role, prioritize these user-facing sections:
1. Onsite Priorities
2. Systems / Equipment to Review
3. Items to Verify
4. Product Safety / Recall Check
5. Customer Talking Points
6. Related Service Considerations
7. Documentation / Follow-Up
8. Official Source Reminder

For Instructor role, prioritize these user-facing sections:
1. Session Priorities
2. Lesson Flow
3. Materials / Equipment Needed
4. Standards / Objective Alignment
5. Safety Points to Emphasize
6. Attendance / Certification Reminders
7. Related Service Considerations
8. Documentation / Follow-Up
9. Official Source Reminder

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
- If role is "Inspector", create onsite field guidance. Do not include lesson plans or curriculum language. Focus on what to check, verify, discuss, document, and follow up on while onsite.
- If role is "Instructor", create session guidance. Include lesson flow, materials/equipment needed, standards/objective alignment, safety points to emphasize, attendance/certification reminders, related service considerations, documentation/follow-up, and official source reminder. Use demo-safe language and do not claim official certification approval.
- For instructor Standards / Objective Alignment, include draft measurable learning objectives, brief alignment notes, a simple check-for-understanding method, and this caution: "Draft alignment for planning purposes. Verify against current Indiana, Pro Board/IFSAC, NFPA, department, company, and AHJ requirements before using for credit or certification."
- Do not invent official standard numbers unless source text is provided.

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
- Inspect / service: focus on inspections, service visits, ITM review, deficiencies, documentation, installed equipment, model/date range checks, service history, access issues, customer talking points, and product safety review.
- Teach / train: focus on customer training, instructor prep, recruit training, continuing education, certificates, attendance, selected services, likely questions, materials to bring, product safety examples to verify, and follow-up items.
- Meet / discuss: focus on talking points, customer concerns, related service considerations, product safety examples to verify, and follow-up capture.
- Present / attend event: focus on event logistics, booth/materials, speakers/presenters, demo equipment, sales/marketing collateral, lead capture, likely questions, and follow-up plan.
- Follow up / document: focus on open items, missing records, training completion, deficiency follow-up, product safety verification, and next actions.

Do not use the word "upsell." Use "Related Service Considerations." Frame related service considerations as safety, education, maintenance, compliance awareness, documentation, prevention, modernization, customer confidence, or risk reduction.
Group Related Service Considerations under Safety / Risk Reduction, Maintenance / Testing, Customer Education, Documentation / Follow-Up, and Modernization / Replacement Discussion.

Responsible AI boundaries:
- Do not make final code, engineering, legal, compliance, fire safety, inspection, or operational determinations.
- Do not claim a recall applies unless exact model/manufacturer/date range/site details confirm it.
- Remind the user to verify against official CPSC notices, manufacturer instructions, applicable codes, NFPA standards, company procedures, and qualified internal review.

Concise output rules:
- Prefer 3 to 5 bullets per array section.
- Each bullet should be one sentence where possible.
- Put the most important information first.
- Avoid long paragraphs except the Follow-Up Note Draft.
- Do not repeat the same verification disclaimer in every section.
- Keep Official Source Reminder as the final verification reminder.
- Keep Related Service Considerations grouped but concise.
- Do not include readiness scores, percentages, dashboard metrics, or raw search-term dumps.
- The packet should feel like onsite or session guidance, not a long generated report.

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
      return {
        talkingPoint:
          "For Instructor / Trainer audiences, focus on teaching points, examples, likely questions, materials to bring, and discussion prompts.",
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
      ? `Automatic Product Safety Review checked ${installedEquipment.length} installed equipment item${installedEquipment.length === 1 ? "" : "s"} from the selected site profile.`
      : "Automatic Product Safety Review needs installed equipment details before it can provide useful context.",
    safetyMatches.length
      ? `Possible recall matches found: ${safetyMatches
          .slice(0, 5)
          .map((match) => {
            const recall = objectValue(match.recall);
            return `${textValue(match.searchTerm)} -> ${textValue(recall.title)}`;
          })
          .join("; ")}.`
      : "No obvious recall match found in this automatic search.",
    noMatchTerms.length
      ? `${noMatchTerms.length} equipment review item${noMatchTerms.length === 1 ? "" : "s"} had no obvious public recall match, but official source verification is still required.`
      : "Automatic review found possible product safety context that still needs human verification.",
    ...(autoNeedsVerification.length
      ? autoNeedsVerification.map((item) => `Needs verification: ${item}`)
      : [
          "Needs verification: verify model, manufacturer, date range, installed equipment, and official source before action.",
        ]),
    hasRecall
      ? `Optional manual product safety search result selected: ${title}. Treat this as additional context only until verified.`
      : "No manual product safety recall selected. Packet is based on engagement, site, service, prep context, and automatic product safety review.",
  ];
  const systemsText = equipmentSystems.length
    ? equipmentSystems.join(", ")
    : "site equipment/systems not selected";

  return {
    sourceContextUsed: sourceContextUsed.length
      ? sourceContextUsed
      : [
          "Automatic product safety review based on installed equipment",
          hasRecall
            ? `Optional manual product safety search result: ${title}`
            : "No manual product safety recall selected. Packet is based on engagement, site, service, prep context, and automatic product safety review.",
          `Sample site profile: ${sampleSite}`,
          `Ryan Service Lens: ${serviceLensLabel}`,
          `Engagement type: ${engagementType}`,
          `Audience: ${audience}`,
          "Demo source notes: service environment brief, source hierarchy, documentation/deficiency follow-up logic, and training/event prep frameworks",
        ],
    knownSourceFacts: hasRecall
      ? [
          `Known from source: CPSC recall title is "${title}".`,
          `Known from source: manufacturer/company is ${manufacturer}.`,
          `Known from source: product description is ${product}.`,
          `Known from source: listed hazard is ${hazard}.`,
          `Known from source: listed remedy is ${remedy}.`,
        ]
      : [
          "No manual product safety recall selected. Packet is based on engagement, site, service, prep context, and automatic product safety review.",
        ],
    providedDemoProfileContext: [
      `Provided by user/demo profile: selected site profile is ${sampleSite} (${siteType}).`,
      `Provided by user/demo profile: primary audience is ${primaryAudience}.`,
      `Provided by user/demo profile: known systems are ${systemsText}.`,
      ...equipmentReview,
      `Provided by user/demo profile: upcoming reminder is ${upcomingReminder}.`,
      `Provided by user/demo profile: training or education need is ${trainingNeed}.`,
      `Provided by user/demo profile: documentation need is ${documentationNeed}.`,
      `Provided by user/demo profile: selected Ryan Service Lens is ${serviceLensLabel}, focused on ${serviceLensFocus.join(", ") || "not specified"}.`,
      `Provided by user/demo profile: prep resources include ${[...prepMaterials, ...prepTopics, ...prepQuestions].slice(0, 6).join(", ") || "not specified"}.`,
      `Provided by user/demo profile: additional manual/site/training notes are ${additionalNotes || "not provided"}.`,
    ],
    aiInterpretation: [
      `AI interpretation: use the ${serviceLensLabel} lens to prepare ${role} work for ${roleEngagement || engagementType}.`,
      hasRecall
        ? "AI interpretation: compare optional manual recall product details with installed site equipment before making any customer-facing statement."
        : "AI interpretation: prepare the engagement packet from site, installed equipment, audience, service lens, automatic product safety review, prep resources, and manual notes because no manual recall was selected.",
      "AI interpretation: connect related service considerations to safety, documentation, prevention, customer confidence, and risk reduction.",
      "Human review required: route any safety, code, compliance, inspection, engineering, or customer communication decision through qualified internal review.",
    ],
    role,
    selectedTopics,
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
    internalFieldBrief: `For ${role || "employee"} ${roleEngagement || engagementType}, prepare for ${sampleSite} using services ${selectedTopics.join(", ") || "not specified"} and the ${serviceLensLabel} service lens. Start from the selected site/customer profile, installed equipment, service reminder, training need, and documentation context. ${hasRecall ? `Optional manual product safety context: "${title}" lists manufacturer/company as ${manufacturer}, product context as ${product}, hazard as ${hazard}, and remedy as ${remedy}.` : "No manual product safety recall selected. Packet is based on engagement, site, service, prep context, and automatic product safety review."} Additional notes: ${additionalNotes || "none provided"}.`,
    standardsObjectiveAlignment:
      role === "Instructor"
        ? [
            `Draft objective: attendees can explain practical field awareness for ${selectedTopics.join(", ") || "the selected services"}.`,
            `Alignment note: connect ${roleEngagement || "the training session"} to approved department, company, and manufacturer materials before delivery.`,
            "Check for understanding: ask attendees to identify one field condition, one documentation item, and one issue to escalate.",
            "Draft alignment for planning purposes. Verify against current Indiana, Pro Board/IFSAC, NFPA, department, company, and AHJ requirements before using for credit or certification.",
          ]
        : [],
    simpleLessonPlan:
      role === "Instructor"
        ? [
            "Open with the training objective, audience expectations, and safety boundaries.",
            `Teach the selected services: ${selectedTopics.join(", ") || "not specified"}.`,
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
        : "Use plain-language talking points based on the engagement, site profile, service lens, and prep resources.",
      hasRecall
        ? "Ask whether the site has matching equipment, model numbers, date ranges, or service history."
        : "Ask what equipment, documentation, training history, or site details should be reviewed before the engagement.",
      "Emphasize that official CPSC and manufacturer documentation must be checked before action.",
    ],
    installedEquipmentReview: equipmentReview,
    productSafetyRecallReview: productSafetyReview,
    equipmentProductChecklist: [
      hasRecall
        ? `Verify manufacturer/company: ${manufacturer}.`
        : "No manual recall selected; verify product and manufacturer details from installed equipment, automatic review, and manual/site/training notes.",
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
      `Ryan Service Lens focus: ${serviceLensFocus.join(", ") || "not specified"}.`,
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
        "Use the service lens to identify risk reduction and prevention service considerations.",
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
      audienceContext.nextAction,
      hasRecall
        ? "Verify exact product model and affected date range."
        : "Confirm whether product, equipment, or training details need to be added before the engagement.",
      hasRecall
        ? "Confirm whether the product is installed at the selected site."
        : "Review site profile, known systems, prep resources, and additional notes with the appropriate internal owner.",
      hasRecall
        ? "Review official CPSC notice and manufacturer remedy instructions."
        : "Verify manufacturer documentation, applicable standards, and company procedures for any product-specific discussion.",
      "Review related service considerations with a qualified internal employee.",
    ],
    followUpNoteDraft: `${hasRecall ? `Reviewed optional manual public recall information for ${title}` : "Prepared engagement readiness packet without a selected manual product safety recall"} while preparing for ${engagementType} with ${audience}. Need to verify product/equipment details, site equipment match, manufacturer instructions, service history, training context, automatic product safety review results, and open documentation questions. Related service considerations include ${relatedServiceConsideration || "documentation review and preventive maintenance"}. Next step: route findings through qualified internal review before customer or operational action.`,
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
  let recall: Record<string, unknown> = {};
  let role = "Inspector";
  let roleEngagement = "Inspection / Service Visit";
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
      { error: "Unable to generate engagement readiness packet right now." },
      { status: 502 },
    );
  }
}
