import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Daily ICON Stats',
  description: 'Daily Statistics for the ICON Blockchain.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} px-2 py-2 min-h-screen overflow-scroll relative justify-center items-center pt-60 md:pt-60 pb-20 lg:pt-24`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
