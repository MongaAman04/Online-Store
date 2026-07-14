import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = "https://www.houseofsole.in";
const OUTPUT_PATH = join(__dirname, "public", "sitemap.xml");

const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, "serviceAccountKey.json"), "utf-8")
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const staticPages = [
  { loc: "/", changefreq: "daily", priority: "1.0" },
  { loc: "/products", changefreq: "daily", priority: "0.9" },
  { loc: "/about", changefreq: "monthly", priority: "0.8" },
  { loc: "/contact", changefreq: "monthly", priority: "0.9" },
];

const escapeXml = (str = "") =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const buildUrlEntry = ({ loc, changefreq, priority, lastmod }) => `
  <url>
    <loc>${escapeXml(SITE_URL + loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

async function generateSitemap() {
  console.log("Fetching products from Firestore...");

  const snapshot = await db.collection("products").get();

  const productEntries = snapshot.docs.map((doc) => {
    const data = doc.data();
    const lastmod = data.updatedAt?.toDate
      ? data.updatedAt.toDate().toISOString().split("T")[0]
      : undefined;

    return buildUrlEntry({
      loc: `/productdetails/${doc.id}`,
      changefreq: "weekly",
      priority: "0.8",
      lastmod,
    });
  });

  const staticEntries = staticPages.map(buildUrlEntry);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...productEntries].join("")}
</urlset>
`;

  writeFileSync(OUTPUT_PATH, xml, "utf-8");
  console.log(`✅ Sitemap generated with ${staticPages.length} static pages and ${productEntries.length} product pages.`);
  console.log(`📄 Written to: ${OUTPUT_PATH}`);
}

generateSitemap().catch((err) => {
  console.error("❌ Failed to generate sitemap:", err);
  process.exit(1);
});