import type { Metadata } from "next";

import { cn } from "@/components/cn";
import { Reveal } from "@/components/motion";

export const metadata: Metadata = {
  title: "Quality Assurance",
  description:
    "Contech hume pipes are verified through the three-edge bearing test and hydrostatic pressure testing in full compliance with IS 458 codes. ISO 9001:2015 certified manufacturing.",
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className={cn("shrink-0", className)} aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function QualityPage() {
  return (
    <main className="pt-xl">
      <section
        id="certification"
        className="container-max flex flex-col gap-sm border-b border-outline-variant px-sm py-xl md:px-lg"
      >
        <Reveal>
          <h1 className="text-headline-xl-mobile font-bold uppercase tracking-tight text-ink md:text-headline-xl">
            Quality Assurance
          </h1>
          <p className="max-w-3xl text-body-lg text-ink-muted">
            Rigorous testing protocols ensuring maximum structural integrity and adherence to stringent
            industrial standards.
          </p>
        </Reveal>
      </section>

      <section className="container-max border-b border-outline-variant px-sm py-xxl md:px-lg">
        <div className="flex flex-col items-center justify-between gap-lg md:flex-row">
          <Reveal className="w-full md:w-7/12">
            <div className="relative">
              <div
                className="absolute inset-0 -z-10 translate-x-3 translate-y-3 border-2 border-royal"
                aria-hidden="true"
              />
              <div className="h-[500px] w-full border border-outline bg-[linear-gradient(135deg,#e8e8e8_0%,#dadada_55%,#c9c9ca_100%)]" />
            </div>
          </Reveal>

          <Reveal delay={0.15} className="w-full md:w-5/12">
            <div className="flex flex-col gap-md">
            <h2 className="text-headline-lg font-semibold text-ink">Three-Edge Bearing Test</h2>
            <div className="h-[2px] w-[68px] bg-amber" aria-hidden="true" />
            <p className="text-justify text-body-lg text-ink-muted">
              To guarantee the structural resilience of our RCC pipes under heavy earth and traffic
              loads, each batch is subjected to the rigorous Three-Edge Bearing Test in strict
              compliance with IS 458 codes. This protocol simulates extreme subterranean stress
              conditions by applying concentrated radial loads across the longitudinal axis of the
              pipe. The structural integrity is continuously monitored via electronic load cells,
              ensuring that the ultimate load-bearing capacity significantly exceeds standard
              environmental stress factors before micro-fractures appear. This zero-tolerance approach
              to compressive strength verification ensures permanent subterranean stability.
            </p>
            <div className="mt-sm flex items-center gap-sm">
              <CheckIcon className="text-amber" />
              <span className="text-label-md uppercase tracking-wider text-ink">IS 458 Compliant</span>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      <section className="container-max px-sm py-xxl md:px-lg">
        <div className="flex flex-col items-center justify-between gap-lg md:flex-row-reverse">
          <Reveal className="w-full md:w-7/12">
            <div className="relative">
              <div
                className="absolute inset-0 -z-10 -translate-x-3 translate-y-3 border-2 border-royal"
                aria-hidden="true"
              />
              <div className="h-[500px] w-full border border-outline bg-[linear-gradient(135deg,#e8e8e8_0%,#dadada_55%,#c9c9ca_100%)]" />
            </div>
          </Reveal>

          <Reveal delay={0.15} className="w-full md:w-5/12">
            <div className="flex flex-col gap-md">
            <h2 className="text-headline-lg font-semibold text-ink">Hydrostatic Pressure Test</h2>
            <div className="h-[2px] w-[68px] bg-royal" aria-hidden="true" />
            <p className="text-justify text-body-lg text-ink-muted">
              Ensuring absolute impermeability is critical for sanitary and storm sewer
              infrastructure. The Hydrostatic Pressure Test systematically verifies the porosity and
              water-tightness of our concrete matrix. By sealing the pipe ends with mechanical
              bulkheads and subjecting the internal chamber to sustained, elevated hydraulic
              pressure, we meticulously inspect for any signs of seepage, sweating, or pressure drops
              over a specified duration. This intensive internal pressurization mimics maximum flow
              scenarios, validating the density of the compacted concrete and confirming that the
              structural matrix remains uncompromisingly watertight over decades of subterranean
              service.
            </p>
            <div className="mt-sm flex items-center gap-sm">
              <CheckIcon className="text-royal" />
              <span className="text-label-md uppercase tracking-wider text-ink">
                Zero Seepage Verification
              </span>
            </div>
          </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
