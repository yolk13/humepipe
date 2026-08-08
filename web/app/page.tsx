import Link from "next/link";

import { CountUp, Marquee, Parallax, Reveal } from "@/components/motion";
import { Button, Card, SectionHeader, Tag } from "@/components/ui";

function BarsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d="M3 19h18M3 13h18M3 7h18" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d="M1 6h13v10H1zM14 9h4l4 4v3h-8" />
      <circle cx="6" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
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

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

const capacityCards = [
  {
    title: "High-Volume Output",
    copy: "Fully automated spinning process ensuring uniform compaction and zero voids across a daily capacity of 500+ units.",
    cta: "View Facility",
    href: "/quality",
    icon: <BarsIcon />,
  },
  {
    title: "NP2-NP4 Load Classes",
    copy: "Rigorous testing for crush strength and hydrostatic pressure. Compliant with IS 458:2003 standards for heavy traffic loads.",
    cta: "Read Test Reports",
    href: "/quality",
    icon: <ShieldIcon />,
    active: true,
  },
  {
    title: "Pan-India Transport",
    copy: "Dedicated fleet of heavy-duty trailers ensuring safe, on-time delivery directly to construction sites across the subcontinent.",
    cta: "Logistics Network",
    href: "/quality",
    icon: <TruckIcon />,
  },
];

const clients = ["NHAI", "L&T Infra", "CPWD", "Tata Projects"];

export default function Home() {
  return (
    <main className="pt-xl pb-xxl">
      <section className="container-max mt-xxl mb-xxl px-sm md:px-lg">
        <div className="flex flex-col gap-lg lg:flex-row">
          <div className="flex w-full flex-col justify-center lg:w-[62%] lg:pr-lg">
            <Reveal delay={0}>
              <Tag dot className="mb-md">
                ISO 9001:2015 Certified Manufacturing
              </Tag>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mb-md text-headline-xl-mobile font-bold text-ink md:text-headline-xl">
                Heavy-Duty Hume Pipes for National Infrastructure
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mb-xl max-w-[80%] text-headline-md font-normal text-ink-muted">
                Precision engineering for civil contractors and bulk buyers. Built to withstand immense
                pressure and stand the test of time.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-col gap-md sm:flex-row">
                <Button href="/rfq" size="lg">
                  Request Bulk Quote
                </Button>
                <Button href="/products" variant="outline" size="lg">
                  <DownloadIcon />
                  Download Specs
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="relative min-h-[600px] w-full overflow-hidden border border-outline bg-surface-mid lg:h-auto lg:w-[38%]">
            <Parallax speed={0.18} className="absolute -inset-y-6 inset-x-0">
              <div
                className="h-full w-full bg-[linear-gradient(135deg,#e8e8e8_0%,#dadada_55%,#c9c9ca_100%)]"
                aria-hidden="true"
              />
            </Parallax>
            <Reveal delay={0.4}>
              <div className="absolute bottom-md left-md flex items-center gap-sm border border-outline bg-surface p-sm">
                <div className="flex size-[42px] items-center justify-center border border-outline text-amber">
                  <BarsIcon />
                </div>
                <div>
                  <p className="text-label-md uppercase tracking-wider text-ink-muted">Daily Output</p>
                  <p className="text-headline-md font-semibold text-ink">
                    <CountUp to={500} suffix="+ Units" />
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-max mb-xxl border-y border-outline bg-surface-low px-sm py-lg md:px-lg">
        <p className="mb-md text-center text-label-md uppercase tracking-wider text-ink-muted">
          Trusted by Leading Infrastructure Developers
        </p>
        <Marquee className="opacity-70 grayscale">
          {clients.map((name) => (
            <div key={name} className="flex items-center gap-xs text-headline-md font-bold text-slate">
              <span className="block size-2 bg-royal" aria-hidden="true" />
              {name}
            </div>
          ))}
        </Marquee>
      </section>

      <section className="container-max mb-xxl px-sm md:px-lg">
        <Reveal>
          <SectionHeader
            title="Industrial Scale Capacity"
            description="Engineered for massive deployment, our facilities guarantee consistent quality and rapid delivery for critical national projects."
          />
        </Reveal>
        <div className="grid grid-cols-1 gap-md md:grid-cols-3">
          {capacityCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.08}>
              <Card
                accent={card.active}
                className="transition-colors duration-150 hover:border-royal"
                header={
                  <div className="flex flex-col gap-sm">
                    <div className="flex size-12 items-center justify-center border border-outline bg-surface-highest text-royal">
                      {card.icon}
                    </div>
                    <h3 className="text-headline-md font-semibold text-ink">{card.title}</h3>
                  </div>
                }
              >
                <p className="text-body-lg text-ink-muted">{card.copy}</p>
                <Link
                  href={card.href}
                  className="mt-md inline-flex items-center gap-xs text-label-md uppercase tracking-wider text-royal transition-colors duration-150 hover:text-royal-deep"
                >
                  {card.cta}
                  <ArrowIcon />
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
