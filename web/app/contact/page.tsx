import type { Metadata } from "next";

import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Contech Concrete and Allied Industries for bulk hume pipe procurement. Head office in the Heavy Engineering Sector; procurement inquiries answered within 24 hours.",
};

export default function ContactPage() {
  return (
    <main className="container-max px-sm pt-xl pb-xxl md:px-lg">
      <Reveal className="mb-xl max-w-2xl">
        <h1 className="mb-xs text-headline-xl-mobile font-bold text-ink md:text-headline-xl">Contact</h1>
        <p className="text-body-lg text-ink-muted">
          For bulk procurement inquiries, use the RFQ portal for a formal quotation. Our engineering
          team responds within 24 hours.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-lg md:grid-cols-12">
        <section className="flex flex-col gap-md md:col-span-7">
          <Reveal delay={0.1}>
            <div className="border border-outline-variant bg-surface-lowest p-md">
              <h2 className="mb-md border-b border-outline-variant pb-xs text-headline-md font-semibold text-ink">
                Head Office
              </h2>
              <p className="text-body-lg text-ink">
                Industrial Estate, Block B
                <br />
                Heavy Engineering Sector
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="border border-outline-variant bg-surface-lowest p-md">
              <h2 className="mb-md border-b border-outline-variant pb-xs text-headline-md font-semibold text-ink">
                Procurement Inquiries
              </h2>
              <a
                href="mailto:quotes@contech-industries.com"
                className="text-body-lg text-royal underline underline-offset-2"
              >
                quotes@contech-industries.com
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div id="factory" className="border border-outline-variant bg-surface-lowest p-md">
              <h2 className="mb-md border-b border-outline-variant pb-xs text-headline-md font-semibold text-ink">
                Factory & Logistics
              </h2>
              <p className="text-body-lg text-ink">
                Dedicated heavy-duty trailer fleet delivering across the subcontinent. Mandatory
                delivery-site coordinates are captured with every RFQ for freight calculation.
              </p>
            </div>
          </Reveal>
        </section>

        <Reveal delay={0.15} className="md:col-span-5">
          <aside className="flex h-full flex-col gap-md">
            <div className="flex flex-1 flex-col justify-center gap-sm border border-outline bg-surface-low p-lg">
              <h2 className="text-headline-lg font-semibold text-ink">Need a bulk quote?</h2>
              <p className="text-body-lg text-ink-muted">
                Submit your pipe class, diameter and quantity requirements with delivery logistics for
                a detailed quotation within 24 hours.
              </p>
              <Button href="/rfq" className="w-fit">
                Request Bulk Quote
              </Button>
            </div>
          </aside>
        </Reveal>
      </div>
    </main>
  );
}
