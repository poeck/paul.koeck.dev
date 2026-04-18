import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const writeups = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/writeups" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    severity: z.enum(["info", "low", "medium", "high", "critical"]),
    platform: z.string(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    cvss: z.number().min(0).max(10).optional(),
    cve: z.string().regex(/^CVE-\d{4}-\d{4,}$/).optional(),
    ghsa: z.string().regex(/^GHSA-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/).optional(),
    ghsaUrl: z.string().url().optional(),
    published: z.boolean().default(true),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
    description: z.string(),
    hero: z.string().optional(),
    order: z.number().default(0),
    active: z.boolean().default(false),
  }),
});

export const collections = { writeups, projects };
