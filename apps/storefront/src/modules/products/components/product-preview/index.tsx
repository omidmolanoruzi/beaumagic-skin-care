import { Text } from "@modules/common/components/ui"
import { getPricesForVariant, getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

type VariantWithPrice = HttpTypes.StoreProductVariant & {
  calculated_price?: {
    calculated_amount: number
    original_amount: number
    currency_code: string
    calculated_price: {
      price_list_type: string
    }
  }
}

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
  variant,
  displayTitle,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  variant?: HttpTypes.StoreProductVariant
  displayTitle?: string
}) {
  const { cheapestPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const variantPrice = variant
    ? getPricesForVariant(variant as VariantWithPrice)
    : null

  const price = variantPrice ?? cheapestPrice
  const title = displayTitle ?? product.title
  const href = variant
    ? `/products/${product.handle}?v_id=${variant.id}`
    : `/products/${product.handle}`

  return (
    <LocalizedClientLink href={href} className="group">
      <div
        data-testid="product-wrapper"
        className={isFeatured ? "text-center" : undefined}
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div
          className={
            isFeatured
              ? "flex flex-col items-center gap-3 mt-4"
              : "flex txt-compact-medium mt-4 justify-between items-center"
          }
        >
          <Text
            className="text-espresso text-sm tracking-wide uppercase"
            data-testid="product-title"
          >
            {title}
          </Text>
          <div className="flex items-center gap-x-2">
            {price && <PreviewPrice price={price} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
