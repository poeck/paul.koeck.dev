import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import {
  isValidSlug,
  isValidReaction,
  getClientIP,
  ALLOWED_REACTIONS,
  json,
} from "../../../lib/engagement";

const MAX_COUNT_PER_EMOJI = 20;

const RL_HEADERS = {
  "X-RateLimit-Limit": "20",
  "X-RateLimit-Window": "60",
};

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug!;
  if (!isValidSlug(slug)) return json({ error: "Invalid slug" }, 400);

  const raw = await env.ENGAGEMENT.get(`r:${slug}`);
  const reactions: Record<string, number> = raw ? JSON.parse(raw) : {};
  return json({ reactions, allowed: [...ALLOWED_REACTIONS] });
};

export const POST: APIRoute = async ({ params, request }) => {
  const slug = params.slug!;
  if (!isValidSlug(slug)) return json({ error: "Invalid slug" }, 400);

  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return json({ error: "Expected JSON" }, 415);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("reactions" in body) ||
    typeof (body as { reactions: unknown }).reactions !== "object" ||
    (body as { reactions: unknown }).reactions === null
  ) {
    return json({ error: "Missing reactions object" }, 400);
  }

  const incoming = (body as { reactions: Record<string, unknown> }).reactions;
  const deltas: Record<string, number> = {};

  for (const [emoji, count] of Object.entries(incoming)) {
    if (!isValidReaction(emoji)) return json({ error: "Invalid reaction" }, 400);
    if (typeof count !== "number" || !Number.isInteger(count) || count < 1) {
      return json({ error: "Invalid count" }, 400);
    }
    deltas[emoji] = Math.min(count, MAX_COUNT_PER_EMOJI);
  }

  if (Object.keys(deltas).length === 0) {
    return json({ error: "Empty reactions" }, 400);
  }

  const ip = getClientIP(request);
  const { success } = await env.RATE_LIMITER.limit({ key: ip });
  if (!success) {
    return json({ error: "Rate limited" }, 429, {
      ...RL_HEADERS,
      "Retry-After": "60",
    });
  }

  const raw = await env.ENGAGEMENT.get(`r:${slug}`);
  const reactions: Record<string, number> = raw ? JSON.parse(raw) : {};
  for (const [emoji, count] of Object.entries(deltas)) {
    reactions[emoji] = (reactions[emoji] || 0) + count;
  }
  await env.ENGAGEMENT.put(`r:${slug}`, JSON.stringify(reactions));

  return json({ reactions }, 200, RL_HEADERS);
};
