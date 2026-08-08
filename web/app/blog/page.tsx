import type { Metadata } from "next";

import { Reveal } from "@/components/motion";
import { Button, Tag } from "@/components/ui";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering guides on hume pipe selection, load classes (NP2/NP3/NP4), IS 458:2003 compliance and drainage system design from Contech's engineers.",
};

export default function BlogPage() {
  return (
    <main className="container-max px-sm pt-xl pb-xxl md:px-lg">
      <Reveal className="mb-xl">
        <Tag className="mb-sm">Technical Insights</Tag>
        <h1 className="mb-xs text-headline-xl-mobile font-bold text-ink md:text-headline-xl">Blog</h1>
        <p className="max-w-2xl text-body-lg text-ink-muted">
          Engineering guides on hume pipe selection, load classes, IS 458:2003 compliance and
          drainage design. New articles are published regularly.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <section className="flex flex-col items-start justify-center gap-sm border border-outline bg-surface-low p-lg text-center">
          <h2 className="text-headline-md font-semibold text-ink">
            Engineering articles are on the way
          </h2>
          <p className="mx-auto max-w-xl text-body-lg text-ink-muted">
            While the first guides are being drafted, browse the product specification tables or
            request a bulk quotation for your project.
          </p>
          <div className="mx-auto mt-sm flex flex-col gap-md sm:flex-row">
            <Button href="/products" variant="outline">
              View Specs
            </Button>
            <Button href="/rfq">Request Bulk Quote</Button>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
