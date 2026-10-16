import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading } from "@modules/common/components/ui"

const Hero = () => {
  return (
    <div className="h-[85vh] w-full relative overflow-hidden border-b border-ui-border-base bg-sand">
      {/*
        Full-bleed hero video at `public/BGM1.mp4` (web-optimized from BGM1.mov).
      */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/BGM1.mp4" type="video/mp4" />
      </video>

      {/* Soft warm overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#b6b7a5]/50 via-[#b6b7a5]/10 to-[#b6b7a5]/80" />

      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-6 small:p-32 gap-8">
        <Heading
          level="h1"
          className="text-4xl md:text-6xl leading-[1.05] text-espresso max-w-2xl"
        >
          Unlock Your Skin&apos;s Potential
        </Heading>
        <LocalizedClientLink href="/store">
          <Button variant="primary" size="large">
            Shop
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Hero
