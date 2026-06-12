import { listProducts } from "@lib/data/products"
import { getPricesForVariant } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@modules/common/components/ui"
import ProductPreview from "@modules/products/components/product-preview"
import { unstable_noStore as noStore } from "next/cache"

// Products to feature on the homepage, in display order.
const FEATURED_HANDLES = ["cream"]
const FALLBACK_LIMIT = 2

type VariantWithPrice = HttpTypes.StoreProductVariant & {
  calculated_price?: {
    calculated_amount: number
  }
}

type VariantDisplayItem = {
  product: HttpTypes.StoreProduct
  variant: HttpTypes.StoreProductVariant
  displayTitle: string
}

function getVariantSizeLabel(variant: HttpTypes.StoreProductVariant) {
  return (
    variant.title ||
    variant.options?.find((option) => option.value)?.value ||
    ""
  )
}

function expandProductVariants(
  product: HttpTypes.StoreProduct
): VariantDisplayItem[] {
  const variants = [...(product.variants ?? [])].sort((a, b) => {
    const priceA =
      getPricesForVariant(a as VariantWithPrice)?.calculated_price_number ?? 0
    const priceB =
      getPricesForVariant(b as VariantWithPrice)?.calculated_price_number ?? 0
    return priceA - priceB
  })

  return variants
    .map((variant) => {
      const sizeLabel = getVariantSizeLabel(variant)
      if (!sizeLabel) {
        return null
      }

      return {
        product,
        variant,
        displayTitle: `Cream ${sizeLabel}`,
      }
    })
    .filter((item): item is VariantDisplayItem => Boolean(item))
}

export default async function Collection({
  region,
  countryCode,
}: {
  region: HttpTypes.StoreRegion
  countryCode: string
}) {
  noStore()

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    countryCode,
    queryParams: {
      limit: 20,
      fields: "*variants.calculated_price",
    },
  })

  const featuredByHandle = FEATURED_HANDLES.map((handle) =>
    products?.find((p) => p.handle === handle)
  ).filter((p): p is HttpTypes.StoreProduct => Boolean(p))

  const displayProducts =
    featuredByHandle.length > 0
      ? featuredByHandle
      : (products?.slice(0, FALLBACK_LIMIT) ?? [])

  const displayItems = displayProducts.flatMap((product) => {
    if ((product.variants?.length ?? 0) > 1) {
      return expandProductVariants(product)
    }

    return [{ product, variant: undefined, displayTitle: undefined }]
  })

  if (!displayItems.length) {
    return null
  }

  return (
    <section className="w-full bg-sand border-b border-ui-border-base">
      <div className="content-container py-16 small:py-24">
        <div className="flex flex-col items-center text-center gap-2 mb-12">
          <span className="text-clay text-xs tracking-[0.25em] uppercase">
            Now available
          </span>
          <Heading level="h2" className="text-espresso text-3xl small:text-4xl">
            The collection
          </Heading>
        </div>

        <ul className="grid grid-cols-1 small:grid-cols-2 gap-x-8 gap-y-12 max-w-3xl mx-auto">
          {displayItems.map((item) => (
            <li key={item.variant?.id ?? item.product.id}>
              <ProductPreview
                product={item.product}
                region={region}
                isFeatured
                variant={item.variant}
                displayTitle={item.displayTitle}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
