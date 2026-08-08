import type { PipeClass, ProductSpec } from "@contech/shared";

const CMS_URL = process.env.CMS_URL ?? "http://localhost:3001";

export const seedCatalog: Record<PipeClass, ProductSpec[]> = {
  NP2: [
    { diameter: 150, wallThickness: 25, length: "2.0 / 2.5", weight: "75 / 95", jointType: "socket-spigot" },
    { diameter: 250, wallThickness: 30, length: "2.0 / 2.5", weight: "140 / 175", jointType: "socket-spigot" },
    { diameter: 300, wallThickness: 35, length: "2.5", weight: "230", jointType: "socket-spigot" },
    { diameter: 450, wallThickness: 45, length: "2.5", weight: "420", jointType: "socket-spigot" },
    { diameter: 600, wallThickness: 55, length: "2.5", weight: "680", jointType: "socket-spigot" },
    { diameter: 900, wallThickness: 75, length: "2.5", weight: "1350", jointType: "flush" },
    { diameter: 1200, wallThickness: 100, length: "2.5", weight: "2400", jointType: "flush" },
  ],
  NP3: [
    { diameter: 150, wallThickness: 30, length: "2.0 / 2.5", weight: "90 / 110", jointType: "socket-spigot" },
    { diameter: 250, wallThickness: 38, length: "2.0 / 2.5", weight: "170 / 210", jointType: "socket-spigot" },
    { diameter: 300, wallThickness: 42, length: "2.5", weight: "275", jointType: "socket-spigot" },
    { diameter: 450, wallThickness: 55, length: "2.5", weight: "505", jointType: "socket-spigot" },
    { diameter: 600, wallThickness: 65, length: "2.5", weight: "800", jointType: "socket-spigot" },
    { diameter: 900, wallThickness: 90, length: "2.5", weight: "1580", jointType: "flush" },
    { diameter: 1200, wallThickness: 120, length: "2.5", weight: "2800", jointType: "flush" },
  ],
  NP4: [
    { diameter: 150, wallThickness: 34, length: "2.0 / 2.5", weight: "105 / 130", jointType: "socket-spigot" },
    { diameter: 250, wallThickness: 42, length: "2.0 / 2.5", weight: "190 / 235", jointType: "socket-spigot" },
    { diameter: 300, wallThickness: 48, length: "2.5", weight: "320", jointType: "socket-spigot" },
    { diameter: 450, wallThickness: 62, length: "2.5", weight: "575", jointType: "socket-spigot" },
    { diameter: 600, wallThickness: 75, length: "2.5", weight: "930", jointType: "socket-spigot" },
    { diameter: 900, wallThickness: 105, length: "2.5", weight: "1850", jointType: "flush" },
    { diameter: 1200, wallThickness: 140, length: "2.5", weight: "3300", jointType: "flush" },
  ],
};

const CLASS_KEYS: PipeClass[] = ["NP2", "NP3", "NP4"];

interface CmsProductDoc {
  productClass: PipeClass;
  diameter: number;
  wallThickness: number;
  length: string;
  weight: string;
  jointType: ProductSpec["jointType"];
}

/** Fetch the live spec tables from the Payload CMS, falling back to the bundled seed. */
export async function getCatalog(): Promise<Record<PipeClass, ProductSpec[]>> {
  try {
    const res = await fetch(`${CMS_URL}/api/products?limit=200`, { cache: "no-store" });
    if (!res.ok) throw new Error(`CMS responded with ${res.status}`);
    const { docs } = (await res.json()) as { docs: CmsProductDoc[] };

    const catalog: Record<PipeClass, ProductSpec[]> = { NP2: [], NP3: [], NP4: [] };
    for (const doc of docs) {
      if (CLASS_KEYS.includes(doc.productClass)) {
        catalog[doc.productClass].push({
          diameter: doc.diameter,
          wallThickness: doc.wallThickness,
          length: doc.length,
          weight: doc.weight,
          jointType: doc.jointType,
        });
      }
    }
    if (catalog.NP2.length === 0 && catalog.NP3.length === 0 && catalog.NP4.length === 0) {
      throw new Error("CMS returned an empty catalog");
    }
    return catalog;
  } catch (err) {
    console.warn("[catalog] CMS unavailable, using bundled seed:", err);
    return seedCatalog;
  }
}
