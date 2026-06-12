import { Metadata } from "next"

import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "About — Medusa Store",
  description:
    "Considered goods, made to last. The story behind Medusa Store and the way we make things.",
}

const PILLARS = [
  {
    title: "Considered",
    body: "Every piece earns its place. We design slowly, edit ruthlessly, and keep only what we'd reach for ourselves.",
  },
  {
    title: "Crafted",
    body: "Honest materials and a maker's eye for detail — finished to a standard you can feel in the hand.",
  },
  {
    title: "Made to last",
    body: "Built for the long run, not the season. Pieces meant to be worn, kept, and quietly loved.",
  },
]

export default async function AboutPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  await props.params

  return (
    <div className="w-full bg-cream">
      {/* Hero band */}
      <section className="w-full bg-sand border-b border-ui-border-base">
        <div className="content-container py-24 small:py-40 flex flex-col items-center text-center gap-6">
          <span className="text-clay text-xs tracking-[0.25em] uppercase">
            Our story
          </span>
          <Heading
            level="h1"
            className="text-espresso text-4xl small:text-6xl leading-[1.05] max-w-3xl"
          >
            Considered goods, made to last
          </Heading>
          <Text className="text-taupe text-lg max-w-xl leading-relaxed">
            We started with a simple idea: fewer, better things — made with care
            and priced with honesty.
          </Text>
        </div>
      </section>

      {/* Brand story prose */}
      <section className="content-container py-20 small:py-28">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <Heading level="h2" className="text-espresso text-3xl">
            The way we make things
          </Heading>
          <Text className="text-taupe text-base small:text-lg leading-relaxed">
            Good design is mostly subtraction. We pare each piece back to what
            matters — a quiet palette, honest materials, and a fit made to be
            lived in. No loud logos, no seasonal noise; just well-made things you
            return to.
          </Text>
          <Text className="text-taupe text-base small:text-lg leading-relaxed">
            We work with makers who share that patience, and we'd rather release
            one piece we're proud of than ten we're not. It's a slower way to
            build a wardrobe — and, we think, a better one.
          </Text>
        </div>
      </section>

      {/* Value pillars */}
      <section className="w-full bg-sand border-y border-ui-border-base">
        <div className="content-container py-20 small:py-28">
          <div className="grid grid-cols-1 small:grid-cols-3 gap-12 small:gap-16">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="flex flex-col gap-3">
                <Heading level="h3" className="text-espresso text-2xl">
                  {pillar.title}
                </Heading>
                <Text className="text-taupe leading-relaxed">{pillar.body}</Text>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote band */}
      <section className="w-full bg-espresso text-cream">
        <div className="content-container py-24 small:py-36 flex justify-center">
          <p className="font-serif italic text-cream text-2xl small:text-4xl leading-snug text-center max-w-3xl">
            “Have nothing in your house that you do not know to be useful, or
            believe to be beautiful.”
          </p>
        </div>
      </section>

      {/* CTA band */}
      <section className="content-container py-20 small:py-28 flex flex-col items-center text-center gap-6">
        <Heading level="h2" className="text-espresso text-3xl small:text-4xl">
          Quietly made, made to keep
        </Heading>
        <Text className="text-taupe max-w-lg leading-relaxed">
          Explore the collection and find your next piece.
        </Text>
        <LocalizedClientLink href="/store">
          <Button variant="primary" size="large">
            Shop the collection
          </Button>
        </LocalizedClientLink>
      </section>
    </div>
  )
}
