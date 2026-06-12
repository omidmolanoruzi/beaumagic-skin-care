import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading } from "@modules/common/components/ui"

const Hero = () => {
  return (
    <div className="h-[85vh] w-full relative overflow-hidden border-b border-ui-border-base bg-sand">
      {/*
        Video-ready hero. Drop a clip at `public/hero.mp4` (and an optional
        still at `public/hero-poster.jpg`) and it plays full-bleed behind the
        copy. With no video present, the warm `bg-sand` + overlay still looks
        finished.
      */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Soft warm overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream/50 via-cream/10 to-cream/80" />

      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-6 small:p-32 gap-8">
        <Heading
          level="h1"
          className="text-4xl md:text-6xl leading-[1.05] text-espresso max-w-2xl"
        >
          Fewer, better things.
        </Heading>
        <LocalizedClientLink href="/store">
          <Button variant="primary" size="large">
            Shop the collection
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Hero
