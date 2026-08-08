export type PipeClass = 'NP2' | 'NP3' | 'NP4'

export type JointType = 'socket-spigot' | 'flush'

/**
 * A single product spec row as rendered in the Products spec tables.
 * Mirrors the NP2/NP3/NP4 tables in the stitch technical_specifications code.html.
 */
export interface ProductSpec {
  /** Internal diameter in mm. */
  diameter: number
  /** Wall thickness in mm. */
  wallThickness: number
  /** Nominal pipe length(s) in metres, e.g. "2.0 / 2.5". */
  length: string
  /** Approximate unit weight in kg, e.g. "75 / 95". */
  weight: string
  jointType: JointType
  /** Diameters available as single values only (stored as number for filtering). */
}

export interface Product {
  id: number
  productClass: PipeClass
  spec: ProductSpec
  /** Technical data sheet PDF media id (Payload media). */
  tdsPdf?: number
}

export interface ProductClassInfo {
  name: PipeClass
  title: string
  /** Short description / applications for the class. */
  description: string
  /** IS standard(s) the class conforms to. */
  standards: string[]
}

export type RfqStatus = 'pending' | 'quoted' | 'closed'

export interface RfqLineItem {
  productClass: PipeClass
  diameter: number
  quantity: number
}

export interface RfqSubmission {
  companyName: string
  panVat: string
  contactPerson: string
  contactEmail: string
  contactPhone?: string
  projectType: string
  lineItems: RfqLineItem[]
  deliverySite: string
  notes?: string
}

export interface Rfq extends RfqSubmission {
  id: number
  status: RfqStatus
  createdAt: string
  updatedAt: string
}

export interface Author {
  id: number
  name: string
  title: string
  /** Engineering credentials for E-E-A-T. */
  credentials?: string
  bio?: string
  /** Verified external profile URLs (LinkedIn etc.) for sameAs schema. */
  sameAs?: string[]
}

export interface BlogPostSummary {
  id: number
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  author: Pick<Author, 'name' | 'title'>
}

export interface SiteSettings {
  companyName: string
  tagline: string
  certifications: string[]
  contactEmail: string
  headOffice: string
  dailyOutputUnits: number
}
