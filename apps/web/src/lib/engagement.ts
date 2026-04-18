const VALID_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$/;
const ALLOWED_REACTIONS = ["🔥", "👀", "💡", "🎯"] as const;

export function isValidSlug(slug: string): boolean {
  return slug.length >= 1 && slug.length <= 128 && VALID_SLUG.test(slug);
}

export function isValidReaction(
  emoji: string,
): emoji is (typeof ALLOWED_REACTIONS)[number] {
  return (ALLOWED_REACTIONS as readonly string[]).includes(emoji);
}

export { ALLOWED_REACTIONS };

export async function hashIP(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash).slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getClientIP(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

export function json(
  data: unknown,
  status = 200,
  headers?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}
