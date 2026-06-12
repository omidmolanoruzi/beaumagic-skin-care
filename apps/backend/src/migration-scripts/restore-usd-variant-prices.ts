import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { upsertVariantPricesWorkflow } from "@medusajs/medusa/core-flows";

const DEMO_PRICE = 15;

export default async function restore_usd_variant_prices({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("Restoring USD variant prices alongside CAD...");

  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "product_id", "prices.currency_code"],
  });

  const variantsNeedingUsd = variants.filter(
    (v) =>
      !v.prices?.some(
        (p) => p.currency_code?.toLowerCase() === "usd"
      )
  );

  if (!variantsNeedingUsd.length) {
    logger.info("All variants already have USD prices.");
    return;
  }

  const variantIds = variantsNeedingUsd.map((v) => v.id);

  await upsertVariantPricesWorkflow(container).run({
    input: {
      variantPrices: variantsNeedingUsd.map((variant) => ({
        variant_id: variant.id,
        product_id: variant.product_id!,
        prices: [
          { amount: DEMO_PRICE, currency_code: "cad" },
          { amount: DEMO_PRICE, currency_code: "usd" },
        ],
      })),
      previousVariantIds: variantIds,
    },
  });

  logger.info(`Restored USD prices on ${variantsNeedingUsd.length} variants.`);
}
