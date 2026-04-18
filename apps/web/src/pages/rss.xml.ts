import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const writeups = (await getCollection("writeups"))
    .filter((w) => w.data.published)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const items = writeups.map((writeup) => ({
    title: writeup.data.title,
    pubDate: writeup.data.date,
    description: writeup.data.summary,
    link: `/writeups/${writeup.id}`,
    categories: writeup.data.tags,
  }));

  return rss({
    title: "Paul Koeck",
    description:
      "Security writeups and research by Paul Koeck.",
    site: context.site!,
    items,
  });
}
