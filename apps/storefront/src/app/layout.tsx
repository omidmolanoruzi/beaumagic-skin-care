import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"
import "styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="light"
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <body className="font-sans bg-cream text-espresso antialiased">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
