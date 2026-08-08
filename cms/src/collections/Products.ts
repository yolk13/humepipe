import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'diameter',
    defaultColumns: ['productClass', 'diameter', 'wallThickness', 'length', 'weight', 'jointType', 'tdsPdf'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
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
      min: 100,
      max: 2000,
    },
    {
      name: 'wallThickness',
      type: 'number',
      required: true,
      min: 10,
      max: 300,
    },
    {
      name: 'length',
      type: 'text',
      required: true,
    },
    {
      name: 'weight',
      type: 'text',
      required: true,
    },
    {
      name: 'jointType',
      type: 'select',
      required: true,
      options: [
        { label: 'Socket & Spigot', value: 'socket-spigot' },
        { label: 'Flush Joint', value: 'flush' },
      ],
    },
    {
      name: 'tdsPdf',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
