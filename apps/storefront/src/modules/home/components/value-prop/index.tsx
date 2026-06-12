import { Text } from "@modules/common/components/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import CyclingWords from "./cycling-words"

const ValueProp = () => {
  return (
    <section className="w-full bg-cream border-b border-ui-border-base">
      <div className="content-container py-24 small:py-32 flex flex-col items-center text-center gap-8">
        <span className="text-clay text-xs tracking-[0.25em] uppercase">
          Our approach
        </span>

        <h2 className="font-serif text-espresso text-3xl small:text-5xl leading-[1.15] max-w-3xl">
          Our products are{" "}
          <CyclingWords />
        </h2>

        <Text className="text-taupe text-base small:text-lg max-w-xl leading-relaxed">
          We pare each piece back to what matters — honest materials, a quiet
          palette, and a fit made to be lived in. Nothing superfluous, nothing to
          prove.
        </Text>

        <InteractiveLink href="/about">Read our story</InteractiveLink>
      </div>
    </section>
  )
}

export default ValueProp
