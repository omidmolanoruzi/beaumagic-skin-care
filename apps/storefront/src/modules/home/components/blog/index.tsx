import { Text } from "@modules/common/components/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import CyclingWords from "./cycling-words"

const Blog = () => {
  return (
    <section
      className="w-full bg-cream border-b border-ui-border-base relative bg-cover bg-center"
      style={{ backgroundImage: "url('/beaumagic-antiagingIm-1.jpg')" }}
    >
      {/* Soft overlay so text stays legible over the photo */}
      <div className="absolute inset-0 bg-[#b6b7a5]/70" />

      <div className="content-container py-24 small:py-32 flex flex-col items-center text-center gap-8 relative z-10">
        <span className="text-clay text-xs tracking-[0.25em] uppercase">
          Blog
        </span>

        <h2 className="font-serif text-espresso text-3xl small:text-5xl leading-[1.15] max-w-3xl flex flex-col items-center">
          <span>Read about</span>
          <CyclingWords />
        </h2>

        <Text className="text-taupe text-base small:text-lg max-w-xl leading-relaxed">
          Practical notes on routines, ingredients, and anti-aging care — written
          to help you understand your skin and choose what actually works.
        </Text>

        <InteractiveLink href="/blog">Read the blog</InteractiveLink>
      </div>
    </section>
  )
}

export default Blog
