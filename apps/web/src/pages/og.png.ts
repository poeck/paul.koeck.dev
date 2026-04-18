import type { APIRoute } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const fontData = await readFile(
  resolve(process.cwd(), "public/fonts/outfit-regular.ttf"),
);

export const GET: APIRoute = async () => {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          backgroundColor: "#09090b",
          fontFamily: "Outfit",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                fontSize: "56px",
                fontWeight: 500,
                color: "#fafafa",
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
              },
              children: "Paul Koeck",
            },
          },
          {
            type: "div",
            props: {
              style: {
                fontSize: "24px",
                color: "#71717a",
                marginTop: "16px",
              },
              children:
                "Security researcher and developer",
            },
          },
          {
            type: "div",
            props: {
              style: {
                color: "#3f3f46",
                fontSize: "18px",
                marginTop: "auto",
              },
              children: "paul.koeck.dev",
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
