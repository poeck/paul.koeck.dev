import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const writeups = (await getCollection("writeups"))
    .filter((w) => w.data.published)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const posts = (await getCollection("blog"))
    .filter((p) => p.data.published)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const items = [
    ...writeups.map((writeup) => ({
      title: writeup.data.title,
      pubDate: writeup.data.date,
      description: writeup.data.summary,
      link: `/writeups/${writeup.id}`,
      categories: writeup.data.tags,
    })),
    ...posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/blog/${post.id}`,
      categories: post.data.tags,
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: "Simon Koeck",
    description:
      "Security writeups, blog posts, and research by Simon Koeck.",
    site: context.site!,
    items,
  });
}
