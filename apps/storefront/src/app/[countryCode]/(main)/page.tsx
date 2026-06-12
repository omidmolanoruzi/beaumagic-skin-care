import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import ValueProp from "@modules/home/components/value-prop"
import Collection from "@modules/home/components/collection"
import { getRegion } from "@lib/data/regions"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Medusa Store — Fewer, better things",
  description:
    "A small, considered collection. Fewer, better things — made to last. Shop the collection.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <ValueProp />
      <Collection region={region} countryCode={countryCode} />
    </>
  )
}
