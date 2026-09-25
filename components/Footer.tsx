import Link from "next/link";
import { TEAM_MEMBERS } from "./teamMembers";
import { OFFICES } from "./offices";
import Logo from "./Logo";

// Site footer, used on every page. Every entry in every column links to a page that exists in
// its own right: the five capabilities, the company pages, the team, and one page per office.
const CAPABILITIES = [
  { label: "Technology & AI", href: "/technology-ai" },
  { label: "Growth & Marketing", href: "/growth-marketing" },
  { label: "UMIN AI", href: "/umin-ai" },
  { label: "Ventures", href: "/ventures" },
  { label: "Global Strategy", href: "/global-strategy" },
];
const COMPANY = [
  { label: "About", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Build With UMIN", href: "/build-with-umin" },
  { label: "All Services", href: "/services" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative bg-brand text-[12.6px]">
      <div className="mx-auto max-w-[1440px] px-6 pb-4 pt-10 md:px-12 lg:px-24">
        <div className="border-b border-white/10 pb-10">
          <Logo variant="light" height={72} className="h-[34px] w-auto" />
          <p className="mt-2 text-[15px] font-light text-footer-link">Higher Thinking. Greater Possibilities.</p>
        </div>

        <div className="grid grid-cols-1 gap-y-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
          <div className="px-3">
            <h4 className="text-[17.64px] font-semibold leading-[27px] text-white">CAPABILITIES</h4>
            <ul className="mt-2 text-footer-link">
              {CAPABILITIES.map((item) => (
                <li key={item.label} className="font-medium leading-6">
                  <Link href={item.href} className="transition-colors duration-200 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-3">
            <h4 className="text-[17.64px] font-semibold leading-[27px] text-white">COMPANY</h4>
            <ul className="mt-2 text-footer-link">
              {COMPANY.map((item) => (
                <li key={item.label} className="font-medium leading-6">
                  <Link href={item.href} className="transition-colors duration-200 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-3">
            <h4 className="text-[17.64px] font-semibold leading-[27px] text-white">TEAM</h4>
            <ul className="mt-2 text-footer-link">
              {TEAM_MEMBERS.map((member) => (
                <li key={member.slug} className="font-medium leading-6">
                  <Link href={`/team/${member.slug}`} className="transition-colors duration-200 hover:text-white">
                    {member.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-3">
            <h4 className="text-[17.64px] font-semibold leading-[27px] text-white">OFFICES</h4>
            <ul className="mt-2 text-footer-link">
              {OFFICES.map((office) => (
                <li key={office.slug} className="font-medium leading-6">
                  <Link href={`/offices/${office.slug}`} className="transition-colors duration-200 hover:text-white">
                    {office.city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-3">
            <h4 className="text-[17.64px] font-semibold leading-[27px] text-white">CONTACT</h4>
            <ul className="mt-2 text-footer-link">
              <li className="pb-2 font-medium leading-6">
                <span className="block text-[12.6px] leading-[15.12px]">EMAIL</span>
                <a href="mailto:info@uminglobal.com" className="text-[17px] font-bold text-white">
                  info@uminglobal.com
                </a>
              </li>
              <li className="font-medium leading-6">
                <span className="block text-[12.6px] leading-[15.12px]">NEW BUSINESS</span>
                <Link href="/contact" className="text-[15px] font-bold text-white hover:text-footer-link">
                  Send a project brief
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <span className="text-[13px] font-bold uppercase tracking-[2px] text-white">Build · Grow · Scale</span>
          {/* Operating entity and its Australian Business Number. This is the legal footer line
              every jurisdiction expects to find at the bottom of a company site, and the ABN is
              what makes the trading entity verifiable. */}
          <p className="text-white/70">
            © 2026 UMIN Global · Mevlam Pty Ltd · ABN 29 615 356 539
          </p>
        </div>
      </div>
    </footer>
  );
}
