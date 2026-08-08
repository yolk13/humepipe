import type { Metadata } from "next";

import { getCatalog } from "@/lib/product-catalog";

import { ProductsView } from "./products-view";

export const metadata: Metadata = {
  title: "Product Specifications",
  description:
    "Dense specification tables for Contech hume pipes across NP2, NP3 and NP4 load classes: internal diameter, wall thickness, length, weight and joint types. Compliant with IS 458:2003.",
};

export default async function ProductsPage() {
  const catalog = await getCatalog();
  return <ProductsView catalog={catalog} />;
}
