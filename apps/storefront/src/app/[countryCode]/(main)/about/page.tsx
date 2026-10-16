import { Metadata } from "next"

import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "About Beau magic | Anti-aging skincare",
  description:
    "Beau magic makes effective anti-aging skincare with science, quality, and consistency. Learn how our formulations nourish, protect, and rejuvenate your skin.",
  keywords: [
    "Beau magic",
    "anti-aging skincare",
    "Restorative Cream",
    "skincare ingredients",
    "skin barrier",
  ],
  openGraph: {
    title: "About Beau magic | Anti-aging skincare",
    description:
      "Effective anti-aging skincare starts with science, quality, and consistency. Discover the story behind Beau magic.",
    type: "website",
    siteName: "Beau magic",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Beau magic | Anti-aging skincare",
    description:
      "Beau magic makes effective anti-aging skincare with science, quality, and consistency.",
  },
}

const INGREDIENTS = [
  {
    title: "Palmitoyl Tripeptide-38",
    body: "A cosmetic peptide used in anti-aging formulations to help support the appearance of smoother, firmer-looking skin.",
    image: "/ingredients/palmitoyl-tripeptide-38.png",
  },
  {
    title: "Jojoba Oil",
    body: "A nourishing emollient that helps soften skin, maintain moisture, and support a smooth, comfortable feel.",
    image: "/ingredients/jojoba.png",
  },
  {
    title: "Vitamins C & E",
    body: "Antioxidant ingredients commonly incorporated into skincare to help care for skin exposed to everyday environmental stressors.",
    image: "/ingredients/vitamins.png",
  },
  {
    title: "Coenzyme Q10",
    body: "An antioxidant ingredient valued in skincare formulations focused on maintaining healthy-looking skin.",
    image: "/ingredients/Q10.png",
  },
]

const PHILOSOPHY = [
  {
    title: "Hydration",
    body: "Moisture for soft, supple-feeling skin.",
  },
  {
    title: "Nourishment",
    body: "Comforting care with conditioning ingredients.",
  },
  {
    title: "Renewal",
    body: "A daily ritual for refreshed, radiant-looking skin.",
  },
]

export default async function AboutPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  await props.params

  return (
    <div className="w-full bg-cream">
      {/* Hero band */}
      <section className="w-full border-b border-ui-border-base">
        <h1 className="sr-only">BEAUMAGIC Where Beauty Meets Innovation</h1>
        <img
          src="/about/anti-aging-beaumagic-about-1.webp?v=2"
          alt="BEAUMAGIC advanced anti-aging cream. Beauty meets innovation. Canadian-made skincare."
          className="w-full h-auto object-cover"
        />
      </section>

      {/* Brand story prose */}
      <section className="content-container py-20 small:py-28">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <Heading level="h2" className="text-espresso text-3xl">
            Canadian-Made Skincare. Timeless Confidence.
          </Heading>
          <Text className="text-taupe text-base small:text-lg leading-relaxed">
            At BEAUMAGIC, we believe that aging is a natural part of life, but how
            we care for our skin can make every stage feel extraordinary.
          </Text>
          <Text className="text-taupe text-base small:text-lg leading-relaxed">
            Born from a passion for beauty, innovation, and quality, BEAUMAGIC
            introduces a modern approach to anti-aging skincare.
          </Text>
          <Text className="text-taupe text-base small:text-lg leading-relaxed">
            Our Advanced Anti-Aging Cream brings together carefully selected
            skincare ingredients in a thoughtfully developed formulation designed
            to hydrate, nourish, and improve the appearance of skin.
          </Text>
          <Text className="text-taupe text-base small:text-lg leading-relaxed">
            Proudly made in Canada, BEAUMAGIC is created for women and men who
            believe that confidence, self-care, and radiant-looking skin have no
            age limit.
          </Text>
        </div>
      </section>

      {/* Science */}
      <section className="w-full border-y border-ui-border-base">
        <div className="content-container py-20 small:py-28 flex flex-col gap-16">
          <div className="max-w-3xl flex flex-col gap-4">
            <span className="text-clay text-xs tracking-[0.25em] uppercase">
              The Science Behind BEAUMAGIC
            </span>
            <Heading level="h2" className="text-espresso text-3xl small:text-4xl">
              Advanced Ingredients. Thoughtful Formulation.
            </Heading>
            <Text className="text-taupe text-base small:text-lg leading-relaxed">
              We believe effective skincare begins with understanding what skin
              needs. Our formulation combines ingredients commonly used in modern
              skincare for their moisturizing, conditioning, and antioxidant
              properties.
            </Text>
          </div>

          <div className="divide-y divide-ui-border-base">
            {INGREDIENTS.map((ingredient) => (
              <div key={ingredient.title} className="flex items-start gap-4 p-4 small:p-5">
                <img
                  src={ingredient.image}
                  alt=""
                  className="h-24 w-24 shrink-0 rounded-xl object-contain bg-white"
                />
                <div className="flex flex-col gap-1">
                  <Heading level="h3" className="text-espresso text-lg">
                    {ingredient.title}
                  </Heading>
                  <Text className="text-espresso leading-relaxed">{ingredient.body}</Text>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-3xl flex flex-col gap-6">
            <Heading level="h2" className="text-espresso text-3xl">
              Proudly Made in Canada
            </Heading>
            <Text className="text-taupe text-base small:text-lg leading-relaxed">
              Quality is at the heart of the BEAUMAGIC philosophy. Our Advanced
              Anti-Aging Cream is made in Canada, bringing together thoughtful
              ingredient selection and a modern approach to skincare formulation.
            </Text>
            <Text className="text-taupe text-base small:text-lg leading-relaxed">
              From the feel of the cream to the simplicity of a day-and-night
              routine, every aspect of BEAUMAGIC is intended to make daily skincare
              feel effortless and luxurious.
            </Text>
          </div>

          <div className="flex flex-col gap-10">
            <Heading level="h2" className="text-espresso text-3xl">
              Our Philosophy
            </Heading>
            <div className="grid grid-cols-1 small:grid-cols-3 gap-12 small:gap-16">
              {PHILOSOPHY.map((item) => (
                <div key={item.title} className="flex flex-col gap-3">
                  <Heading level="h3" className="text-espresso text-2xl">
                    {item.title}
                  </Heading>
                  <Text className="text-taupe leading-relaxed">{item.body}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="w-full bg-espresso text-cream">
        <div className="content-container py-24 small:py-36 flex flex-col items-center text-center gap-6">
          <Heading level="h2" className="text-cream text-3xl small:text-4xl">
            Our Vision
          </Heading>
          <p className="font-serif text-cream text-2xl small:text-4xl leading-snug max-w-3xl">
            A world where aging is celebrated, skincare is empowering, and
            effective daily care is accessible without unnecessary complexity.
          </p>
        </div>
      </section>

      {/* CTA band */}
      <section className="content-container py-20 small:py-28 flex flex-col items-center text-center gap-6">
        <Heading level="h2" className="text-espresso text-3xl small:text-4xl">
          Confidence Has No Age.
        </Heading>
        <Text className="text-taupe max-w-2xl leading-relaxed">
          Your skin tells your story. We believe every chapter deserves to glow.
          It&apos;s a commitment to caring for your skin, embracing your natural
          beauty, and making each day a little more radiant.
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
