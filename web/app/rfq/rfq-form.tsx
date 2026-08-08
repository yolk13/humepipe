"use client";

import { useState } from "react";

import { cn } from "@/components/cn";
import { Reveal } from "@/components/motion";
import { FieldInput, FieldSelect, FieldTextarea } from "@/components/ui";
import type { PipeClass, RfqLineItem } from "@contech/shared";

const pipeClasses: PipeClass[] = ["NP2", "NP3", "NP4"];
const diameters = [150, 250, 300, 450, 600, 900, 1200];

const projectTypes = [
  { value: "Public Infrastructure", label: "Public Infrastructure" },
  { value: "Commercial Construction", label: "Commercial Construction" },
  { value: "Industrial Facility", label: "Industrial Facility" },
  { value: "Highway / Roadworks", label: "Highway / Roadworks" },
];

const certifications = [
  "ISO 9001:2015 Quality Management",
  "Structural Integrity Tested",
  "Grade A Material Compliance",
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className={cn("shrink-0 text-royal", className)} aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function RfqForm() {
  const [companyName, setCompanyName] = useState("");
  const [panVat, setPanVat] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [deliverySite, setDeliverySite] = useState("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<RfqLineItem[]>(() => [
    { productClass: "NP2", diameter: 300, quantity: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  function updateItem(index: number, patch: Partial<RfqLineItem>) {
    setLineItems((items) => items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    setLineItems((items) => [...items, { productClass: "NP2", diameter: 300, quantity: 0 }]);
  }

  function removeItem(index: number) {
    setLineItems((items) => items.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validItems = lineItems
      .map((item) => ({ ...item, quantity: Number(item.quantity) }))
      .filter((item) => item.quantity > 0);

    if (validItems.length === 0) {
      setError("Add at least one material line item with a quantity greater than zero.");
      return;
    }
    if (!companyName || !panVat || !contactPerson || !contactEmail || !projectType || !deliverySite) {
      setError("Complete all required fields, including the delivery site location.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          panVat,
          contactPerson,
          contactEmail,
          contactPhone: contactPhone || undefined,
          projectType,
          lineItems: validItems,
          deliverySite,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed.");
      setReference(data.reference as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <main className="container-max flex min-h-[60vh] items-center px-sm pt-xl pb-xxl md:px-lg">
        <div className="mx-auto w-full max-w-2xl border border-outline bg-surface-lowest p-lg text-center">
          <CheckIcon className="mx-auto mb-sm size-10 text-royal" />
          <h1 className="mb-sm text-headline-lg font-semibold text-ink">RFQ Submitted</h1>
          <p className="mb-sm text-body-lg text-ink-muted">
            Reference number <span className="font-semibold text-ink">{reference}</span>. Our
            engineering team will review your requirements and return a detailed quotation within 24
            hours.
          </p>
          <p className="text-body-lg text-ink-muted">
            Need to adjust your order?{" "}
            <button
              type="button"
              className="font-semibold text-royal underline underline-offset-2"
              onClick={() => setReference(null)}
            >
              Submit another RFQ
            </button>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container-max px-sm pt-xl pb-xxl md:px-lg">
      <Reveal className="mb-xl">
        <h1 className="mb-xs text-headline-xl-mobile font-bold text-ink md:text-headline-xl">
          Request for Quote
        </h1>
        <p className="max-w-2xl text-body-lg text-ink-muted">
          Specify your technical requirements for structural elements. Our engineering team will
          review and provide a detailed quotation within 24 hours.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-12">
        <Reveal delay={0.1} className="lg:col-span-4">
          <aside className="flex flex-col gap-md">
          <div className="border border-outline-variant bg-surface-lowest p-md">
            <h3 className="mb-md border-b border-outline-variant pb-xs text-headline-md font-semibold text-ink">
              Contact Information
            </h3>
            <div className="flex flex-col gap-sm">
              <div className="flex items-start gap-xs">
                <span className="mt-1 block size-2 bg-royal" aria-hidden="true" />
                <div>
                  <span className="mb-1 block text-label-md uppercase text-ink-muted">
                    Head Office
                  </span>
                  <span className="text-body-lg text-ink">
                    Industrial Estate, Block B
                    <br />
                    Heavy Engineering Sector
                  </span>
                </div>
              </div>
              <div className="mt-sm flex items-start gap-xs">
                <span className="mt-1 block size-2 bg-amber" aria-hidden="true" />
                <div>
                  <span className="mb-1 block text-label-md uppercase text-ink-muted">
                    Procurement Inquiries
                  </span>
                  <span className="text-body-lg text-ink">quotes@contech-industries.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-outline-variant bg-surface-lowest p-md">
            <h3 className="mb-md border-b border-outline-variant pb-xs text-headline-md font-semibold text-ink">
              Certifications
            </h3>
            <ul className="flex flex-col gap-sm">
              {certifications.map((item) => (
                <li key={item} className="flex items-center gap-xs text-body-lg text-ink">
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
        </Reveal>

        <Reveal delay={0.2} className="lg:col-span-8">
          <div className="flex h-full border border-outline-variant bg-surface-lowest">
          <form className="flex h-full flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-md border-b border-outline-variant p-lg">
              <h2 className="text-headline-lg font-semibold text-ink">Corporate Details</h2>
              <div className="grid grid-cols-1 gap-md md:grid-cols-2">
                <FieldInput
                  id="company-name"
                  label="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <FieldInput
                  id="vat-pan"
                  label="VAT / PAN Number"
                  value={panVat}
                  onChange={(e) => setPanVat(e.target.value)}
                  required
                />
                <FieldInput
                  id="contact-person"
                  label="Contact Person"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  required
                />
                <FieldInput
                  id="contact-email"
                  label="Contact Email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
                <FieldInput
                  id="contact-phone"
                  label="Contact Phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
                <FieldSelect
                  id="project-type"
                  label="Project Type"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  required
                >
                  {projectTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </FieldSelect>
              </div>
            </div>

            <div className="flex flex-col gap-md border-b border-outline-variant bg-surface-low p-lg">
              <div className="flex items-center justify-between border-b border-outline-variant pb-xs">
                <h2 className="text-headline-lg font-semibold text-ink">Material Specifications</h2>
                <span className="border border-outline bg-surface-lowest px-sm py-xs text-label-md uppercase tracking-wider text-amber-ink">
                  Item {lineItems.length}
                </span>
              </div>

              {lineItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 items-start gap-md md:grid-cols-[1fr_1fr_1fr_auto]">
                  <FieldSelect
                    id={`pipe-class-${index}`}
                    label="Pipe Class"
                    labelBg="bg-surface-low"
                    controlBg="bg-surface-lowest"
                    value={item.productClass}
                    onChange={(e) => updateItem(index, { productClass: e.target.value as PipeClass })}
                    required
                  >
                    {pipeClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls} Class
                      </option>
                    ))}
                  </FieldSelect>
                  <FieldSelect
                    id={`diameter-${index}`}
                    label="Diameter"
                    labelBg="bg-surface-low"
                    controlBg="bg-surface-lowest"
                    value={item.diameter}
                    onChange={(e) => updateItem(index, { diameter: Number(e.target.value) })}
                    required
                  >
                    {diameters.map((d) => (
                      <option key={d} value={d}>
                        {d}mm Dia
                      </option>
                    ))}
                  </FieldSelect>
                  <FieldInput
                    id={`quantity-${index}`}
                    label="Quantity (Units)"
                    labelBg="bg-surface-low"
                    type="number"
                    min={1}
                    value={item.quantity === 0 ? "" : item.quantity}
                    onChange={(e) => updateItem(index, { quantity: Number(e.target.value) })}
                    required
                  />
                  {lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      aria-label={`Remove item ${index + 1}`}
                      className="mt-sm flex size-10 items-center justify-center self-end border border-outline text-ink transition-colors duration-150 hover:border-error hover:text-error"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addItem}
                className="mt-sm inline-flex items-center gap-xs self-start border border-royal px-md py-sm text-label-md uppercase tracking-wider text-royal transition-colors duration-150 hover:bg-royal-faint"
              >
                <AddIcon />
                Add Item
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-md p-lg">
              <h2 className="border-b border-outline-variant pb-xs text-headline-lg font-semibold text-ink">
                Logistics
              </h2>
              <FieldTextarea
                id="delivery-site"
                label="Delivery Site Location / Coordinates"
                rows={3}
                value={deliverySite}
                onChange={(e) => setDeliverySite(e.target.value)}
                required
              />
              <FieldTextarea
                id="notes"
                label="Additional Notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {error && (
              <p role="alert" className="mx-lg mb-xs border border-error bg-error/10 p-sm text-body-lg text-error">
                {error}
              </p>
            )}

            <div className="p-lg pt-0">
              <button
                type="submit"
                disabled={submitting}
                className="w-full border-2 border-outline bg-amber py-md px-lg text-headline-md font-semibold text-amber-ink uppercase transition-all duration-150 hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Calculate & Submit RFQ"}
              </button>
            </div>
          </form>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
