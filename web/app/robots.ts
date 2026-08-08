import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const allowAi = {
    allow: ["/"],
  };
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "ChatGPT-User", ...allowAi },
      { userAgent: "OAI-SearchBot", ...allowAi },
      { userAgent: "Google-Extended", ...allowAi },
      { userAgent: "PerplexityBot", ...allowAi },
    ],
    sitemap: "https://contech.example/sitemap.xml",
  };
}
