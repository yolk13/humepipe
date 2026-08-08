"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { cn } from "@/components/cn";
import { SpecTable, type SpecColumn } from "@/components/ui";
import type { PipeClass, ProductSpec } from "@contech/shared";

const classes: PipeClass[] = ["NP2", "NP3", "NP4"];

const classInfo: Record<
  PipeClass,
  { title: string; description: string; features: string[] }
> = {
  NP2: {
    title: "NP2 Class Applications",
    description:
      "Reinforced concrete pipes designed for light traffic conditions. Ideal for drainage in pedestrian zones, agricultural culverts, and non-commercial vehicle access areas.",
    features: ["Conforms to IS: 458 - 2003", "SRC / OPC Cement Base", "Light duty load bearing"],
  },
  NP3: {
    title: "NP3 Class Applications",
    description:
      "Medium-to-heavy duty pipes for road culverts, stormwater mains and under-embankment drains where commercial vehicle traffic applies sustained loading.",
    features: ["Conforms to IS: 458 - 2003", "28-day cube strength verified", "Heavy duty load bearing"],
  },
  NP4: {
    title: "NP4 Class Applications",
    description:
      "Very heavy duty pipes engineered for railway culverts, deep burial runs, high-traffic highways and airport infrastructure where extreme loads are expected.",
    features: ["Conforms to IS: 458 - 2003", "Hydrostatically pressure tested", "Very heavy duty load bearing"],
  },
};

const columns: SpecColumn<ProductSpec>[] = [
  {
    key: "diameter",
    label: "Internal Dia (mm)",
    render: (row) => <span className="font-semibold text-slate-deep">{row.diameter}</span>,
  },
  { key: "wallThickness", label: "Wall Thickness (mm)", render: (row) => String(row.wallThickness) },
  { key: "length", label: "Length (m)", render: (row) => row.length },
  { key: "weight", label: "Approx Weight (kg)", render: (row) => row.weight },
  {
    key: "jointType",
    label: "Joint Type",
    render: (row) => (row.jointType === "socket-spigot" ? "Spigot & Socket" : "Flush Joint"),
  },
];

export function ProductsView({ catalog }: { catalog: Record<PipeClass, ProductSpec[]> }) {
  const [active, setActive] = useState<PipeClass>("NP2");
  const reduced = useReducedMotion();
  const info = classInfo[active];

  return (
    <main className="container-max px-sm pt-xl pb-xxl md:px-lg">
      <header className="mb-xl text-center">
        <h1 className="mb-sm text-headline-xl-mobile font-bold text-ink md:text-headline-xl">
          Product Specifications
        </h1>
        <p className="mx-auto max-w-[800px] text-body-lg text-ink-muted">
          Detailed technical data for Contech Hume Pipes. Select a class below to view manufacturing
          tolerances and weight specifications.
        </p>
      </header>

      <div className="mb-lg flex justify-center border-b border-outline-variant">
        {classes.map((cls) => (
          <button
            key={cls}
            type="button"
            onClick={() => setActive(cls)}
            aria-current={active === cls ? "page" : undefined}
            className={cn(
              "px-lg py-sm text-headline-md transition-colors duration-150 focus:outline-none",
              active === cls
                ? "border-b-4 border-royal font-semibold text-royal"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {cls}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={active}
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -12 }}
          transition={{ duration: reduced ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mb-xxl"
          id={`${active.toLowerCase()}-data`}
        >
          <div className="mb-md flex flex-col gap-lg xl:flex-row">
            <div className="w-full xl:w-[62%]">
              <SpecTable columns={columns} rows={catalog[active]} minWidth="700px" />
            </div>

            <div className="flex w-full flex-col gap-md xl:w-[38%]">
              <div className="border border-outline bg-surface-lowest p-md">
                <h3 className="mb-sm text-headline-md font-semibold text-ink">{info.title}</h3>
                <p className="mb-md text-body-lg text-ink-muted">{info.description}</p>
                <div className="mb-md h-px w-full bg-outline-variant" />
                <ul className="space-y-xs text-body-lg text-slate-deep">
                  {info.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-xs">
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-[250px] w-full border border-outline bg-[linear-gradient(135deg,#e8e8e8_0%,#dadada_55%,#c9c9ca_100%)]" aria-hidden="true" />
            </div>
          </div>

          <a
            href={`/tds/${active}.pdf`}
            className="inline-flex items-center gap-xs border-2 border-slate-deep bg-transparent px-md py-sm text-label-md uppercase tracking-wider text-slate-deep transition-colors duration-150 hover:bg-surface-high"
          >
            <DownloadIcon />
            Download {active} Technical Data Sheet (PDF)
          </a>
        </motion.section>
      </AnimatePresence>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="shrink-0 text-royal" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d="M12 3v12M6 9l6 6 6-6M4 21h16" />
    </svg>
  );
}
