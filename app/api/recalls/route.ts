import { NextResponse } from "next/server";
import type { RecallResult } from "../../types";

export const dynamic = "force-dynamic";

const CPSC_BASE_URL = "https://www.saferproducts.gov/RestWebServices/Recall";

type CpscRecall = Record<string, unknown>;

const textFrom = (value: unknown): string => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(textFrom).filter(Boolean).join(", ");
  }

  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    return (
      textFrom(objectValue.Name) ||
      textFrom(objectValue.name) ||
      textFrom(objectValue.Title) ||
      textFrom(objectValue.title) ||
      textFrom(objectValue.Value) ||
      textFrom(objectValue.value)
    );
  }

  return "";
};

const firstText = (record: CpscRecall, keys: string[]): string => {
  for (const key of keys) {
    const direct = textFrom(record[key]);
    if (direct) {
      return direct;
    }
  }

  const lowerMap = new Map(
    Object.entries(record).map(([key, value]) => [key.toLowerCase(), value]),
  );

  for (const key of keys) {
    const found = textFrom(lowerMap.get(key.toLowerCase()));
    if (found) {
      return found;
    }
  }

  return "";
};

const normalizeRecall = (item: CpscRecall): RecallResult => {
  const recallNumber = firstText(item, [
    "RecallNumber",
    "RecallNo",
    "RecallID",
    "recall_number",
  ]);

  const title = firstText(item, [
    "Title",
    "RecallTitle",
    "Name",
    "ProductName",
    "Product",
  ]);

  const url = firstText(item, [
    "URL",
    "Url",
    "RecallURL",
    "RecallUrl",
    "Link",
    "RecallLink",
  ]);

  const id =
    recallNumber ||
    firstText(item, ["ID", "Id"]) ||
    `${title}-${firstText(item, ["RecallDate", "Date"])}`;

  return {
    id,
    title: title || "Untitled recall",
    recallDate: firstText(item, ["RecallDate", "Date", "PublishDate"]),
    manufacturer:
      firstText(item, [
        "Manufacturer",
        "Manufacturers",
        "Company",
        "Companies",
        "Firm",
        "Importer",
        "Importers",
        "Distributor",
        "Distributors",
        "Retailer",
        "Retailers",
      ]) || "Not specified",
    productDescription:
      firstText(item, [
        "ProductDescription",
        "Description",
        "Products",
        "ProductType",
      ]) || "No product description provided.",
    hazard: firstText(item, ["Hazard", "Hazards"]) || "Not specified",
    remedy: firstText(item, ["Remedy", "Remedies"]) || "Not specified",
    recallNumber,
    url,
    raw: item,
  };
};

const cpscUrl = (field: string, query: string) => {
  const params = new URLSearchParams({
    format: "json",
    [field]: query,
  });

  return `${CPSC_BASE_URL}?${params.toString()}`;
};

async function fetchCpsc(field: string, query: string): Promise<CpscRecall[]> {
  const response = await fetch(cpscUrl(field, query), {
    headers: {
      Accept: "application/json",
      "User-Agent": "fire-protection-field-assistant-demo/0.1",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`CPSC request failed with status ${response.status}`);
  }

  const payload = await response.json();

  if (Array.isArray(payload)) {
    const firstRecord = payload[0] as Record<string, unknown> | undefined;
    const title = typeof firstRecord?.Title === "string" ? firstRecord.Title : "";
    if (title.toLowerCase().startsWith("error retrieving")) {
      throw new Error(title);
    }

    return payload as CpscRecall[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.Recalls)) {
      return record.Recalls as CpscRecall[];
    }
    if (Array.isArray(record.results)) {
      return record.results as CpscRecall[];
    }
  }

  return [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const resultSets = await Promise.allSettled([
      fetchCpsc("RecallTitle", query),
      fetchCpsc("ProductDescription", query),
      fetchCpsc("Manufacturer", query),
      fetchCpsc("ProductType", query),
    ]);

    const recalls = resultSets.flatMap((result) =>
      result.status === "fulfilled" ? result.value : [],
    );

    if (!recalls.length && resultSets.every((result) => result.status === "rejected")) {
      return NextResponse.json({
        results: [],
        unavailable: true,
        message:
          "Public recall data could not be checked right now. Verify official sources before action.",
      });
    }

    const deduped = new Map<string, RecallResult>();
    for (const recall of recalls) {
      const normalized = normalizeRecall(recall);
      const key =
        normalized.recallNumber ||
        `${normalized.title}-${normalized.recallDate}`.toLowerCase();
      if (!deduped.has(key)) {
        deduped.set(key, normalized);
      }
    }

    return NextResponse.json({ results: Array.from(deduped.values()).slice(0, 20) });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to retrieve recall data right now." },
      { status: 502 },
    );
  }
}
