import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const fontData = await readFile(
  resolve(process.cwd(), "public/fonts/outfit-regular.ttf"),
);

const severityColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#3b82f6",
  info: "#71717a",
};

export const getStaticPaths: GetStaticPaths = async () => {
  const writeups = await getCollection("writeups");
  return writeups
    .filter((w) => w.data.published)
    .map((entry) => ({
      params: { slug: entry.id },
      props: { entry },
    }));
};

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as {
    entry: Awaited<ReturnType<typeof getCollection>>[number];
  };
  const { title, severity, platform } = entry.data;
  const color = severityColors[severity] ?? "#71717a";

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px 80px",
          backgroundColor: "#09090b",
          fontFamily: "Outfit",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "16px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      color,
                      fontSize: "14px",
                      fontWeight: 600,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.1em",
                    },
                    children: severity,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { color: "#52525b", fontSize: "14px" },
                    children: "/",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { color: "#71717a", fontSize: "18px" },
                    children: platform,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                flex: 1,
                display: "flex",
                alignItems: "center",
                fontSize: title.length > 40 ? "44px" : "52px",
                fontWeight: 500,
                color: "#fafafa",
                lineHeight: 1.2,
                letterSpacing: "-0.025em",
              },
              children: title,
            },
          },
          {
            type: "div",
            props: {
              style: {
                color: "#3f3f46",
                fontSize: "18px",
              },
              children: "simonkoeck.com",
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Outfit", data: fontData, weight: 400, style: "normal" },
        { name: "Outfit", data: fontData, weight: 500, style: "normal" },
      ],
    },
  );

  const resvg = new Resvg(svg);
  const pngBuffer = resvg.render().asPng();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
};
