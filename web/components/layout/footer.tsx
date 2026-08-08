import Link from "next/link";

const contactLinks = [
  { href: "/contact", label: "Contact Info" },
  { href: "/contact#factory", label: "Factory Location" },
];

const quickLinks = [
  { href: "/quality", label: "Quick Links" },
  { href: "/quality#certification", label: "ISO Certification" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-outline bg-inverse-surface">
      <div className="container-max grid grid-cols-1 gap-lg px-sm py-xl md:grid-cols-12 md:px-lg">
        <div className="mb-lg flex flex-col gap-sm md:col-span-4 md:mb-0">
          <div className="text-headline-md font-bold text-white">CONTECH</div>
          <p className="max-w-[300px] text-body-lg text-white/60">
            Heavy-Duty Hume Pipes for National Infrastructure.
          </p>
        </div>

        <nav className="flex flex-col gap-sm md:col-span-4" aria-label="Contact">
          {contactLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="w-fit text-body-lg text-white/60 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-sm md:col-span-4" aria-label="Company">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="w-fit text-body-lg text-white/60 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/30">
        <div className="container-max flex flex-col gap-xs px-sm py-md md:flex-row md:items-center md:justify-between md:px-lg">
          <p className="text-label-md uppercase tracking-wider text-white/60">
            © {new Date().getFullYear()} Contech Concrete and Allied Industries. All Rights Reserved.
          </p>
          <p className="text-label-md uppercase tracking-wider text-white/60">
            ISO 9001:2015 Certified
          </p>
        </div>
      </div>
    </footer>
  );
}
