import type { Metadata } from "next";

import { RfqForm } from "./rfq-form";

export const metadata: Metadata = {
  title: "Request for Quote",
  description:
    "Submit a bulk RFQ for Contech hume pipes. Compile multi-item specifications (NP2, NP3, NP4) with delivery site logistics and receive a detailed quotation within 24 hours.",
};

export default function RfqPage() {
  return <RfqForm />;
}
