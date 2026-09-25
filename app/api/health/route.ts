import { NextResponse } from "next/server";

/**
 * Liveness probe for the container runtime (Docker HEALTHCHECK, Dokploy,
 * load balancers). Deliberately does not touch Postgres: the site serves
 * bundled fallback content when the database is unreachable, so a database
 * blip must not make the orchestrator kill an otherwise healthy container.
 * Database reachability belongs in monitoring, not in the liveness signal.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok", uptime: process.uptime() });
}
