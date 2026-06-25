"use client";

import { FormEvent, useMemo, useState } from "react";
import type { AiGuidance, RecallResult } from "./types";

type EngagementType =
  | "Inspection"
  | "Customer Training"
  | "Fire Department / Convention Event"
  | "Customer Meeting";

const engagementTypes: EngagementType[] = [
  "Inspection",
  "Customer Training",
  "Fire Department / Convention Event",
  "Customer Meeting",
];

const quickSearches = [
  "fire extinguisher",
  "smoke alarm",
  "sprinkler",
  "alarm panel",
  "hydrant",
  "Kidde",
  "First Alert",
];

const prepByEngagement: Record<
  EngagementType,
  {
    materials: string[];
    checklist: string[];
    questions: string[];
    topics: string[];
    followUp: string;
    notes: string;
  }
> = {
  Inspection: {
    materials: ["Tablet or inspection forms", "Customer asset list", "Recent service notes"],
    checklist: [
      "Confirm site address and contact",
      "Review equipment types expected on-site",
      "Note any relevant public recall results",
    ],
    questions: [
      "Have any devices been replaced recently?",
      "Are there recurring deficiencies or nuisance alarms?",
    ],
    topics: ["Inspection scope", "Deficiency documentation", "Next-step approvals"],
    followUp: "Send findings and any recall-related notes to the service manager for review.",
    notes: "Use company inspection procedures and applicable code requirements as the authority.",
  },
  "Customer Training": {
    materials: ["Training outline", "Sign-in sheet", "Device examples or photos"],
    checklist: [
      "Confirm audience and training objective",
      "Prepare plain-language recall context if relevant",
      "Bring approved customer-facing materials",
    ],
    questions: [
      "Which employees need hands-on instruction?",
      "What equipment do attendees interact with most often?",
    ],
    topics: ["Fire extinguisher use", "Alarm response basics", "Maintenance awareness"],
    followUp: "Document attendance and send unresolved product questions for internal review.",
    notes: "This is instructor prep, not a certification or LMS workflow.",
  },
  "Fire Department / Convention Event": {
    materials: ["Demo talking points", "Business cards", "Approved service literature"],
    checklist: [
      "Review common public safety questions",
      "Prepare examples of recall-aware service conversations",
      "Confirm booth or presentation logistics",
    ],
    questions: [
      "What systems are local departments asking about?",
      "Are attendees focused on inspections, training, or modernization?",
    ],
    topics: ["Public safety education", "System readiness", "Preventive maintenance"],
    followUp: "Capture questions that need a technical or service-leadership response.",
    notes: "Keep messaging educational, practical, and approved for public settings.",
  },
  "Customer Meeting": {
    materials: ["Account notes", "Open service items", "Relevant recall summaries"],
    checklist: [
      "Confirm meeting goal",
      "Review known equipment and recent work",
      "Prepare safety-focused talking points",
    ],
    questions: [
      "Are there upcoming inspections or capital projects?",
      "Has the customer asked about equipment age or reliability?",
    ],
    topics: ["Risk reduction", "Maintenance planning", "Customer confidence"],
    followUp: "Send action items to the account or service owner before customer outreach.",
    notes: "Use AI output as preparation only; customer messaging still needs approval.",
  },
};

const formatDate = (date: string) => {
  if (!date) return "Date not listed";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

const SectionTitle = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) => (
  <div>
    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-green">
      {eyebrow}
    </p>
    <h2 className="mt-2 text-2xl font-extrabold leading-tight text-brand-charcoal sm:text-[28px]">
      {title}
    </h2>
    {description ? (
      <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-gray700">
        {description}
      </p>
    ) : null}
  </div>
);

const BriefBlock = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-brand-gray200 bg-brand-gray100 p-4">
    <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-brand-charcoal">
      {title}
    </h3>
    <div className="mt-2 text-sm leading-6 text-brand-gray700">{children}</div>
  </div>
);

const FieldBrief = ({
  guidance,
  selectedRecall,
  engagementType,
}: {
  guidance: AiGuidance | null;
  selectedRecall: RecallResult | null;
  engagementType: EngagementType;
}) => {
  if (!guidance || !selectedRecall) return null;

  return (
    <section className="rounded-2xl border border-brand-gray200 bg-white p-5 shadow-panel sm:p-6">
      <div className="border-b border-brand-gray200 pb-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-green">
          Field Brief
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-brand-charcoal">
          {engagementType} preparation
        </h2>
        <p className="mt-2 text-sm leading-6 text-brand-gray700">
          Based on selected public CPSC recall: {selectedRecall.title}
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <BriefBlock title="Quick Summary">{guidance.plainEnglishSummary}</BriefBlock>
        <BriefBlock title="What Matters">{guidance.whyItMatters}</BriefBlock>
        <BriefBlock title="Safety or Recall Items to Check">
          <ul className="space-y-2">
            {guidance.serviceTeamChecklist.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </BriefBlock>
        <BriefBlock title="Recommended Follow-Up">
          <ul className="space-y-2">
            {guidance.internalFollowUp.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </BriefBlock>
        <BriefBlock title="Customer Talking Points">
          <div className="whitespace-pre-line">{guidance.customerCommunicationDraft}</div>
        </BriefBlock>
        <BriefBlock title="Related Service Considerations">
          Fire extinguisher training, emergency lighting inspections, alarm
          system testing, sprinkler inspections, hydrant inspection / flow
          testing, special hazard system review, preventive maintenance,
          customer training, and safety-related replacement or modernization
          discussion when appropriate.
        </BriefBlock>
      </div>

      <div className="mt-5 rounded-xl border-l-4 border-brand-warning bg-[#fff8e8] p-4 text-sm leading-6 text-brand-gray700">
        <strong className="text-brand-charcoal">Official Source Reminder:</strong>{" "}
        {guidance.riskReviewNote}
      </div>
    </section>
  );
};

export default function Home() {
  const [engagementType, setEngagementType] =
    useState<EngagementType>("Inspection");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RecallResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedRecall, setSelectedRecall] = useState<RecallResult | null>(null);
  const [guidance, setGuidance] = useState<AiGuidance | null>(null);
  const [summarizingId, setSummarizingId] = useState("");
  const [summaryError, setSummaryError] = useState("");

  const prep = prepByEngagement[engagementType];

  const resultCountLabel = useMemo(() => {
    if (!hasSearched || searching) return "";
    return `${results.length} ${results.length === 1 ? "result" : "results"} found`;
  }, [hasSearched, results.length, searching]);

  const searchRecalls = async (term = query) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;

    setQuery(cleanTerm);
    setSearching(true);
    setHasSearched(true);
    setSearchError("");
    setSummaryError("");
    setGuidance(null);
    setSelectedRecall(null);

    try {
      const response = await fetch(`/api/recalls?q=${encodeURIComponent(cleanTerm)}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to retrieve recall data right now.");
      }
      setResults(payload.results || []);
    } catch (error) {
      setResults([]);
      setSearchError(
        error instanceof Error
          ? error.message
          : "Unable to retrieve recall data right now.",
      );
    } finally {
      setSearching(false);
    }
  };

  const generateSummary = async (recall: RecallResult) => {
    setSelectedRecall(recall);
    setGuidance(null);
    setSummaryError("");
    setSummarizingId(recall.id);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recall, engagementType }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to generate field brief right now.");
      }
      setGuidance(payload.guidance);
    } catch (error) {
      setSummaryError(
        error instanceof Error
          ? error.message
          : "Unable to generate field brief right now.",
      );
    } finally {
      setSummarizingId("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void searchRecalls();
  };

  return (
    <main className="min-h-screen bg-brand-gray100">
      <div className="h-1.5 bg-brand-green" />

      <header className="bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-6 lg:px-6">
          <div className="flex flex-col gap-4 border-b border-brand-gray200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-2xl font-black uppercase tracking-[0.03em] text-brand-green">
                RYAN FIREPROTECTION, INC.
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-gray700">
                Internal Field Assistant Concept
              </p>
            </div>
            <span className="w-fit rounded-full border border-brand-gray200 bg-brand-gray100 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-brand-gray700">
              Not an official Ryan product
            </span>
          </div>

          <section className="grid gap-5 py-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-green">
                Fire Protection Field Assistant
              </p>
              <h1 className="mt-3 max-w-3xl text-[32px] font-black leading-tight text-brand-charcoal sm:text-[44px]">
                What do I need to know before I walk in?
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-brand-gray700">
                Prepare for inspections, training, customer meetings, and public
                safety events with public recall lookup and AI-assisted field
                guidance.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-gray200 bg-brand-gray100 p-4">
              <p className="font-extrabold text-brand-charcoal">
                Product Safety Lookup is live.
              </p>
              <p className="mt-2 text-sm leading-6 text-brand-gray700">
                CPSC recall search works without a CPSC account or API key.
                Field briefs use OpenAI when configured, with a local fallback
                for demos.
              </p>
            </div>
          </section>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-5 py-6 lg:px-6">
        <section className="rounded-2xl border border-brand-gray200 bg-white p-5 shadow-panel">
          <SectionTitle
            eyebrow="Engagement"
            title="What are you preparing for?"
            description="Choose the context first so the field brief is framed for the right conversation."
          />
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {engagementTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setEngagementType(type);
                  setGuidance(null);
                }}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-extrabold transition ${
                  engagementType === type
                    ? "border-brand-green bg-brand-green text-white"
                    : "border-brand-gray200 bg-white text-brand-charcoal hover:bg-brand-gray100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-brand-gray200 bg-white p-5 shadow-panel sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              eyebrow="Product Safety Lookup"
              title="Search public CPSC recall data"
              description="Search by product, manufacturer, model number, keyword, hazard, remedy, or description."
            />
            {resultCountLabel ? (
              <p className="rounded-full bg-brand-gray100 px-3 py-1 text-sm font-bold text-brand-gray700">
                {resultCountLabel}
              </p>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search product, manufacturer, model, keyword, hazard, remedy..."
              className="min-h-12 rounded-xl border border-brand-gray200 bg-white px-4 text-base text-brand-charcoal shadow-sm placeholder:text-brand-gray500"
            />
            <button
              type="submit"
              disabled={searching || !query.trim()}
              className="min-h-12 rounded-xl bg-brand-green px-6 font-extrabold text-white shadow-sm transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:bg-brand-gray500"
            >
              {searching ? "Searching..." : "Search Recalls"}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => void searchRecalls(term)}
                className="rounded-full border border-brand-gray200 bg-brand-gray100 px-3 py-2 text-sm font-bold text-brand-charcoal transition hover:border-brand-green hover:text-brand-green"
              >
                {term}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <div className="space-y-3">
            {searching ? (
              <div className="rounded-2xl border border-brand-gray200 bg-white p-6 shadow-panel">
                <div className="h-2 w-full overflow-hidden rounded-full bg-brand-gray100">
                  <div className="h-full w-2/5 animate-pulse rounded-full bg-brand-green" />
                </div>
                <p className="mt-4 font-extrabold text-brand-charcoal">
                  Searching public recall data...
                </p>
              </div>
            ) : null}

            {!searching && searchError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-brand-red">
                {searchError}
              </div>
            ) : null}

            {!searching && !hasSearched ? (
              <div className="rounded-2xl border border-dashed border-brand-gray200 bg-white p-6 shadow-panel">
                <p className="text-lg font-extrabold text-brand-charcoal">
                  Search to review public product safety information.
                </p>
                <p className="mt-2 text-sm leading-6 text-brand-gray700">
                  Results will show recall title, manufacturer, date, product,
                  hazard, remedy, and official source link.
                </p>
              </div>
            ) : null}

            {!searching && hasSearched && !searchError && results.length === 0 ? (
              <div className="rounded-2xl border border-brand-gray200 bg-white p-6 shadow-panel">
                <p className="text-lg font-extrabold text-brand-charcoal">
                  No matching CPSC results for “{query}”.
                </p>
                <p className="mt-2 text-sm leading-6 text-brand-gray700">
                  This means the public CPSC API did not return matches for this
                  exact term. It does not confirm that no recalls exist. Try a
                  broader product type, alternate spelling, parent company, model
                  number, or manufacturer name.
                </p>
              </div>
            ) : null}

            {!searching &&
              results.map((recall) => (
                <article
                  key={recall.id}
                  className={`rounded-2xl border bg-white p-4 shadow-sm ${
                    selectedRecall?.id === recall.id
                      ? "border-brand-green"
                      : "border-brand-gray200"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-brand-green px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-white">
                          Product Safety
                        </span>
                        {recall.recallNumber ? (
                          <span className="rounded-full bg-brand-gray100 px-3 py-1 text-xs font-bold text-brand-gray700">
                            Recall {recall.recallNumber}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-3 text-lg font-extrabold leading-7 text-brand-charcoal">
                        {recall.title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-brand-gray700">
                        {recall.manufacturer} | {formatDate(recall.recallDate)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void generateSummary(recall)}
                      disabled={Boolean(summarizingId)}
                      className="rounded-xl border border-brand-green bg-white px-4 py-3 text-sm font-extrabold text-brand-green transition hover:bg-brand-green hover:text-white disabled:cursor-not-allowed disabled:border-brand-gray200 disabled:text-brand-gray500"
                    >
                      {summarizingId === recall.id
                        ? "Generating brief..."
                        : "Generate Field Brief"}
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm leading-6 md:grid-cols-2">
                    <div>
                      <p className="font-extrabold text-brand-charcoal">Product</p>
                      <p className="mt-1 text-brand-gray700">
                        {recall.productDescription}
                      </p>
                    </div>
                    <div className="rounded-xl border-l-4 border-brand-red bg-red-50 p-3">
                      <p className="font-extrabold text-brand-charcoal">Hazard</p>
                      <p className="mt-1 text-brand-gray700">{recall.hazard}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="font-extrabold text-brand-charcoal">Remedy</p>
                      <p className="mt-1 text-brand-gray700">{recall.remedy}</p>
                    </div>
                  </div>

                  {recall.url ? (
                    <a
                      href={recall.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex text-sm font-extrabold text-brand-green underline-offset-4 hover:underline"
                    >
                      Official CPSC source
                    </a>
                  ) : null}
                </article>
              ))}
          </div>

          <div className="space-y-5 lg:sticky lg:top-5 lg:self-start">
            {summarizingId ? (
              <div className="rounded-2xl border border-brand-gray200 bg-white p-5 shadow-panel">
                <div className="h-2 w-full overflow-hidden rounded-full bg-brand-gray100">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-green" />
                </div>
                <p className="mt-4 font-extrabold text-brand-charcoal">
                  Generating AI-assisted field brief...
                </p>
              </div>
            ) : null}

            {summaryError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-brand-red">
                {summaryError}
              </div>
            ) : null}

            <FieldBrief
              guidance={guidance}
              selectedRecall={selectedRecall}
              engagementType={engagementType}
            />
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-brand-gray200 bg-white p-5 shadow-panel sm:p-6">
          <SectionTitle
            eyebrow="Instructor & Event Prep"
            title={`${engagementType} prep support`}
            description="Compact internal prep notes for instructors, inspectors, and field employees. Demo data only; not an LMS."
          />
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <BriefBlock title="Materials to bring">
              <ul className="space-y-1">
                {prep.materials.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </BriefBlock>
            <BriefBlock title="Equipment checklist">
              <ul className="space-y-1">
                {prep.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </BriefBlock>
            <BriefBlock title="Likely attendee questions">
              <ul className="space-y-1">
                {prep.questions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </BriefBlock>
            <BriefBlock title="Suggested discussion topics">
              <ul className="space-y-1">
                {prep.topics.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </BriefBlock>
            <BriefBlock title="Follow-up reminder">{prep.followUp}</BriefBlock>
            <BriefBlock title="Training or certification notes">
              {prep.notes}
            </BriefBlock>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-brand-gray200 bg-white p-5 shadow-panel sm:p-6">
          <SectionTitle eyebrow="Why this concept exists" title="A practical AI workflow" />
          <p className="mt-4 text-sm leading-7 text-brand-gray700">
            Fire protection employees often need to prepare for inspections,
            training sessions, customer meetings, and public safety events using
            information from multiple sources. This concept demonstrates how
            public recall data and AI-assisted guidance could help employees
            quickly organize safety information, explain technical issues in
            plain language, and identify related service considerations before
            or after a customer engagement.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border-l-4 border-brand-warning bg-[#fff8e8] p-5 text-sm leading-6 text-brand-gray700 shadow-sm">
          <strong className="text-brand-charcoal">Responsible AI:</strong>{" "}
          AI-generated guidance should be reviewed against official CPSC
          notices, manufacturer instructions, applicable codes, NFPA standards,
          and company procedures before action is taken.
        </section>
      </div>

      <footer className="mt-2 bg-brand-green px-5 py-5 text-center text-xs leading-6 text-white">
        Concept prototype created for demonstration purposes. Not affiliated
        with or endorsed by Ryan Fireprotection, Inc.
      </footer>
    </main>
  );
}
