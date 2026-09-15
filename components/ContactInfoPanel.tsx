import Reveal from "./Reveal";

// Contact details as a row of light cards instead of a dark full-bleed panel paired with an
// embedded map - the map added weight without adding information the address line didn't
// already carry, and stayed out of sync with a static export that has no live geocoding.
//
// Email is the only channel published: there is no phone number, so nothing here invites a call
// that would go unanswered. No street address either, since publishing a suite number the team
// hasn't confirmed is worse than not printing one.
const ROUTES = [
  { label: "Email", value: "info@uminglobal.com", href: "mailto:info@uminglobal.com" },
  { label: "New business", value: "Send a project brief", href: "/contact#brief" },
];

export default function ContactInfoPanel() {
  return (
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {ROUTES.map((route, index) => (
        <Reveal key={route.label} delay={index === 0 ? 0 : index < 3 ? 1 : 2} className="h-full">
          <div className="h-full rounded-card bg-white p-6 lg:p-7">
            <dt className="t-eyebrow text-label">{route.label}</dt>
            <dd className="pt-2">
              <a
                href={route.href}
                className="t-h3 font-bold text-ink transition-colors duration-200 hover:text-accent"
              >
                {route.value}
              </a>
            </dd>
          </div>
        </Reveal>
      ))}
      <Reveal delay={2} className="h-full">
        <div className="h-full rounded-card bg-white p-6 lg:p-7">
          <dt className="t-eyebrow text-label">Headquarters</dt>
          <dd className="pt-2">
            <p className="t-h3 font-bold text-ink">New York</p>
            <p className="t-small pt-3 text-body">Offices: New York · London · Melbourne · Istanbul · Dubai</p>
          </dd>
        </div>
      </Reveal>
    </dl>
  );
}
