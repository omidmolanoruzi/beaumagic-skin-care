import { Text } from "@modules/common/components/ui"
import InteractiveLink from "@modules/common/components/interactive-link"

const ValueProp = () => {
  return (
    <section
      className="w-full bg-cream border-b border-ui-border-base relative bg-cover bg-center"
      style={{ backgroundImage: "url('/home/anti-aging-beaumagic-hp-1.webp')" }}
    >
      {/* Soft overlay so text stays legible over the photo */}
      <div className="absolute inset-0 bg-[#b6b7a5]/70" />

      <div className="content-container py-24 small:py-32 flex flex-col items-center text-center gap-6 relative z-10">
        <span className="text-clay text-xs tracking-[0.25em] uppercase">
          Our story
        </span>

        <h2 className="font-serif text-espresso text-3xl small:text-5xl leading-[1.15] max-w-3xl">
          Canadian Skincare Meets Innovation
        </h2>

        <div className="flex flex-col gap-5 max-w-3xl">
          <Text className="text-taupe text-base small:text-lg leading-relaxed">
            At <strong className="text-espresso">BEAUMAGIC</strong>, we believe
            beautiful, healthy-looking skin isn&apos;t about turning back time.
            It&apos;s about embracing every stage of life with confidence,
            radiance, and care.
          </Text>
          <Text className="text-taupe text-base small:text-lg leading-relaxed">
            Proudly <strong className="text-espresso">made in Canada</strong>,
            BEAUMAGIC was founded on a simple belief: exceptional skincare should
            combine modern scientific innovation, carefully selected ingredients,
            and a luxurious daily experience.
          </Text>
          <Text className="text-taupe text-base small:text-lg leading-relaxed">
            Our <strong className="text-espresso">Advanced Anti-Aging Cream</strong>{" "}
            features an innovative formulation with peptides, Coenzyme Q10, jojoba
            oil, and antioxidant vitamins. Designed for women and men, it helps
            deliver lasting hydration, nourishment, and a smoother, more
            youthful-looking complexion.
          </Text>
          <Text className="text-taupe text-base small:text-lg leading-relaxed">
            Our philosophy is simple:{" "}
            <strong className="text-espresso">
              science-inspired skincare, purposeful ingredients, and advanced
              moisturizing care
            </strong>{" "}
            to help support the skin&apos;s natural moisture barrier and maintain a
            radiant, healthy-looking appearance.
          </Text>
          <Text className="text-espresso text-base small:text-lg leading-relaxed font-semibold">
            BEAUMAGIC — Hydration. Nourishment. Renewal.
          </Text>
        </div>

        <InteractiveLink href="/about">Read our story</InteractiveLink>
      </div>
    </section>
  )
}

export default ValueProp
