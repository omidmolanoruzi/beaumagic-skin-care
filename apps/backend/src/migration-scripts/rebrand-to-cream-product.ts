import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows";

const CREAM_HANDLE = "cream";
const CREAM_IMAGE_URL = "http://localhost:8000/products/cream.png";
const NA_WAREHOUSE_NAME = "North American Warehouse";
const DEMO_APPAREL_HANDLES = ["t-shirt", "sweatshirt", "sweatpants", "shorts"];

export default async function rebrand_to_cream_product({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("Rebranding catalog to Restorative Cream (50ml / 100ml)...");

  const { data: existingCream } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: CREAM_HANDLE },
  });

  if (existingCream.length) {
    logger.info("Cream product already exists — skipping rebrand.");
    return;
  }

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  });

  const apparelIds = products
    .filter((p) => DEMO_APPAREL_HANDLES.includes(p.handle ?? ""))
    .map((p) => p.id);

  if (apparelIds.length) {
    logger.info(`Removing ${apparelIds.length} demo apparel products...`);
    await deleteProductsWorkflow(container).run({
      input: { ids: apparelIds },
    });
  }

  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  });

  let skincareCategory = categories.find((c) => c.name === "Skincare");

  if (!skincareCategory) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: [{ name: "Skincare", is_active: true }],
      },
    });
    skincareCategory = result[0];
  }

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfiles[0];

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id"],
  });
  const defaultSalesChannel = salesChannels[0];

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  });
  const stockLocation =
    stockLocations.find((sl) => sl.name === NA_WAREHOUSE_NAME) ??
    stockLocations[0];

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Restorative Cream",
          category_ids: [skincareCategory!.id],
          description:
            "A rich, restorative cream formulated with considered ingredients. One jar, two sizes — choose what fits your routine.",
          handle: CREAM_HANDLE,
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: CREAM_IMAGE_URL }],
          options: [
            {
              title: "Size",
              values: ["50ml", "100ml"],
            },
          ],
          variants: [
            {
              title: "50ml",
              sku: "CREAM-50ML",
              options: { Size: "50ml" },
              prices: [
                { amount: 45, currency_code: "cad" },
                { amount: 45, currency_code: "usd" },
              ],
            },
            {
              title: "100ml",
              sku: "CREAM-100ML",
              options: { Size: "100ml" },
              prices: [
                { amount: 72, currency_code: "cad" },
                { amount: 72, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
      ],
    },
  });

  if (stockLocation) {
    const { data: inventoryItems } = await query.graph({
      entity: "inventory_item",
      fields: ["id", "sku"],
      filters: { sku: ["CREAM-50ML", "CREAM-100ML"] },
    });

    const { data: existingLevels } = await query.graph({
      entity: "inventory_level",
      fields: ["inventory_item_id", "location_id"],
      filters: { location_id: stockLocation.id },
    });
    const stockedIds = new Set(
      existingLevels.map((l) => l.inventory_item_id)
    );

    const levelsToCreate = inventoryItems
      .filter((item) => !stockedIds.has(item.id))
      .map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 1000000,
        inventory_item_id: item.id,
      }));

    if (levelsToCreate.length) {
      await createInventoryLevelsWorkflow(container).run({
        input: { inventory_levels: levelsToCreate },
      });
    }
  }

  logger.info("Cream product rebrand complete.");
}
