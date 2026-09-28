-- Keep the current public navigation available while the admin tree is first opened.
INSERT INTO "NavigationItem" ("id", "label", "href", "sortOrder", "updatedAt") VALUES
  ('default-home', 'Home', '/', 0, CURRENT_TIMESTAMP),
  ('default-about', 'About', '/about', 1, CURRENT_TIMESTAMP),
  ('default-what-we-do', 'What We Do', '/what-we-do', 2, CURRENT_TIMESTAMP),
  ('default-team', 'Team', '/team', 3, CURRENT_TIMESTAMP),
  ('default-offices', 'Offices', '/offices', 4, CURRENT_TIMESTAMP),
  ('default-insights', 'Insights', '/insights', 5, CURRENT_TIMESTAMP),
  ('default-contact', 'Contact', '/contact', 6, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "NavigationItem" ("id", "label", "href", "parentId", "sortOrder", "updatedAt") VALUES
  ('default-what-we-do-technology-ai', 'Technology & AI', '/technology-ai', 'default-what-we-do', 0, CURRENT_TIMESTAMP),
  ('default-what-we-do-growth-marketing', 'Growth & Marketing', '/growth-marketing', 'default-what-we-do', 1, CURRENT_TIMESTAMP),
  ('default-what-we-do-umin-ai', 'UMIN AI', '/umin-ai', 'default-what-we-do', 2, CURRENT_TIMESTAMP),
  ('default-what-we-do-ventures', 'Ventures', '/ventures', 'default-what-we-do', 3, CURRENT_TIMESTAMP),
  ('default-what-we-do-global-strategy', 'Global Strategy', '/global-strategy', 'default-what-we-do', 4, CURRENT_TIMESTAMP),
  ('default-what-we-do-services', 'All Services', '/services', 'default-what-we-do', 5, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
