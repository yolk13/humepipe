import { NextResponse } from "next/server";

import type { RfqSubmission } from "@contech/shared";

const CMS_URL = process.env.CMS_URL ?? "http://localhost:3001";

function isRfqSubmission(value: unknown): value is RfqSubmission {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.companyName === "string" &&
    typeof v.panVat === "string" &&
    typeof v.contactPerson === "string" &&
    typeof v.contactEmail === "string" &&
    typeof v.projectType === "string" &&
    typeof v.deliverySite === "string" &&
    Array.isArray(v.lineItems) &&
    v.lineItems.length > 0 &&
    v.lineItems.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        String((item as Record<string, unknown>).productClass) in { NP2: 0, NP3: 0, NP4: 0 } &&
        typeof (item as Record<string, unknown>).diameter === "number" &&
        typeof (item as Record<string, unknown>).quantity === "number" &&
        Number((item as Record<string, unknown>).quantity) > 0,
    )
  );
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!isRfqSubmission(payload)) {
    return NextResponse.json(
      { error: "Missing or invalid required fields, including at least one line item and the delivery site." },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${CMS_URL}/api/rfqs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error(`[rfq] Payload rejected submission (${res.status}): ${detail}`);
      return NextResponse.json({ error: "Submission could not be stored." }, { status: 502 });
    }

    const { doc } = (await res.json()) as { doc: { id: number | string } };
    const reference = `RFQ-${doc.id}`;
    console.log(`[rfq] ${reference} stored via Payload`);
    return NextResponse.json({ ok: true, reference }, { status: 201 });
  } catch (err) {
    console.error("[rfq] Payload unreachable:", err);
    return NextResponse.json(
      { error: "Quotation service is temporarily unavailable. Please try again shortly." },
      { status: 503 },
    );
  }
}
