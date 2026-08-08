import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Contech CMS — payload admin.',
  title: 'Contech CMS',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
