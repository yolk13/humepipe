import type { CollectionConfig } from 'payload'

import { rfqConfirmationHtml, rfqConfirmationText } from '../emails/rfqConfirmation'

export const Rfq: CollectionConfig = {
  slug: 'rfqs',
  admin: {
    useAsTitle: 'companyName',
    defaultColumns: ['companyName', 'contactPerson', 'contactEmail', 'lineItems', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation !== 'create') return
        const reference = `RFQ-${doc.id}`
        try {
          await req.payload.sendEmail({
            to: doc.contactEmail,
            subject: `${reference} received — Contech Bulk Quote`,
            html: rfqConfirmationHtml(doc, reference),
            text: rfqConfirmationText(doc, reference),
          })
        } catch (err) {
          const detail = err instanceof Error ? err.message : String(err)
          req.payload.logger?.error(`RFQ confirmation email failed for ${reference}: ${detail}`)
        }
      },
    ],
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      required: true,
    },
    {
      name: 'panVat',
      type: 'text',
      required: true,
    },
    {
      name: 'contactPerson',
      type: 'text',
      required: true,
    },
    {
      name: 'contactEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'projectType',
      type: 'select',
      required: true,
      options: [
        'Public Infrastructure',
        'Commercial Construction',
        'Industrial Facility',
        'Highway / Roadworks',
      ],
    },
    {
      name: 'lineItems',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'productClass',
          type: 'select',
          required: true,
          options: [
            { label: 'NP2', value: 'NP2' },
            { label: 'NP3', value: 'NP3' },
            { label: 'NP4', value: 'NP4' },
          ],
        },
        {
          name: 'diameter',
          type: 'number',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'deliverySite',
      type: 'textarea',
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
        description: 'RFQ pipeline state.',
      },
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Closed', value: 'closed' },
      ],
    },
  ],
}
