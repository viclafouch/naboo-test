import type { Metadata } from 'next'
import { Geist, Geist_Mono as GeistMono } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = GeistMono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata = {
  title: {
    template: '%s | Naboo Places',
    default: 'Naboo Places — Discover unique places to stay'
  },
  description:
    'Discover and book unique apartments, villas, cabins, and more across the world.'
} satisfies Metadata

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}

export default RootLayout
