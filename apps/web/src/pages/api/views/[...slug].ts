import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { isValidSlug, getClientIP, hashIP, json } from "../../../lib/engagement";

export const prerender = false;

const RL_HEADERS = {
  "X-RateLimit-Limit": "20",
  "X-RateLimit-Window": "60",
};

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug!;
  if (!isValidSlug(slug)) return json({ error: "Invalid slug" }, 400);

  const views = parseInt((await env.ENGAGEMENT.get(`v:${slug}`)) || "0", 10);
  return json({ views });
};

export const POST: APIRoute = async ({ params, request }) => {
  const slug = params.slug!;
  if (!isValidSlug(slug)) return json({ error: "Invalid slug" }, 400);

  const ip = getClientIP(request);

  const { success } = await env.RATE_LIMITER.limit({ key: ip });
  if (!success) {
    return json({ error: "Rate limited" }, 429, {
      ...RL_HEADERS,
      "Retry-After": "60",
    });
  }

  const ipHash = await hashIP(ip);
  const dedupKey = `dedup:v:${ipHash}:${slug}`;
  const [already, currentRaw] = await Promise.all([
    env.ENGAGEMENT.get(dedupKey),
    env.ENGAGEMENT.get(`v:${slug}`),
  ]);
  const current = parseInt(currentRaw || "0", 10);

  if (already) return json({ views: current, deduplicated: true }, 200, RL_HEADERS);

  const views = current + 1;
  await Promise.all([
    env.ENGAGEMENT.put(`v:${slug}`, views.toString()),
    env.ENGAGEMENT.put(dedupKey, "1", { expirationTtl: 86400 }),
  ]);

  return json({ views }, 200, RL_HEADERS);
};
