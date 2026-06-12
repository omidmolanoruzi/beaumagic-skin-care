import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/framework/utils";
import {
  createInventoryLevelsWorkflow,
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  deleteRegionsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
  upsertVariantPricesWorkflow,
} from "@medusajs/medusa/core-flows";

const NA_WAREHOUSE_NAME = "North American Warehouse";
const DEMO_PRICE_CAD = 15;
const SHIPPING_AMOUNT = 10;

export default async function setup_north_america_regions({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  logger.info("Setting up North America regions (Canada CAD + United States USD)...");

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"],
  });

  const europeRegion = regions.find((r) => r.name === "Europe");
  if (europeRegion) {
    logger.info("Removing Europe region...");
    await deleteRegionsWorkflow(container).run({
      input: { ids: [europeRegion.id] },
    });
  }

  let canadaRegion = regions.find((r) => r.name === "Canada");
  let usRegion = regions.find((r) => r.name === "United States");

  if (!canadaRegion) {
    logger.info("Creating Canada region...");
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Canada",
            currency_code: "cad",
            countries: ["ca"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    canadaRegion = result[0];
  }

  if (!usRegion) {
    logger.info("Creating United States region...");
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "United States",
            currency_code: "usd",
            countries: ["us"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    usRegion = result[0];
  }

  const { data: taxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["country_code"],
  });
  const existingTaxCountries = new Set(
    taxRegions.map((tr) => tr.country_code?.toLowerCase())
  );
  const taxCountriesToCreate = ["ca", "us"].filter(
    (code) => !existingTaxCountries.has(code)
  );

  if (taxCountriesToCreate.length) {
    logger.info("Creating tax regions for ca, us...");
    await createTaxRegionsWorkflow(container).run({
      input: taxCountriesToCreate.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    });
  }

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id"],
  });
  const store = stores[0];

  if (store) {
    logger.info("Updating store currencies and default region...");
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: [
            { currency_code: "cad", is_default: true },
            { currency_code: "usd", is_default: false },
          ],
          default_region_id: canadaRegion!.id,
        },
      },
    });
  }

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  });
  let naStockLocation = stockLocations.find((sl) => sl.name === NA_WAREHOUSE_NAME);

  if (!naStockLocation) {
    logger.info("Creating North American stock location and fulfillment...");
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: NA_WAREHOUSE_NAME,
            address: {
              city: "Toronto",
              country_code: "CA",
              address_1: "",
            },
          },
        ],
      },
    });
    naStockLocation = stockLocationResult[0];

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: naStockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    });

    const { data: shippingProfileResult } = await query.graph({
      entity: "shipping_profile",
      fields: ["id"],
    });
    const shippingProfile = shippingProfileResult[0];

    const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "North American Warehouse delivery",
      type: "shipping",
      service_zones: [
        {
          name: "North America",
          geo_zones: [
            { country_code: "ca", type: "country" },
            { country_code: "us", type: "country" },
          ],
        },
      ],
    });

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: naStockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    });

    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Ship in 2-3 days.",
            code: "standard",
          },
          prices: [
            { currency_code: "cad", amount: SHIPPING_AMOUNT },
            { currency_code: "usd", amount: SHIPPING_AMOUNT },
            { region_id: canadaRegion!.id, amount: SHIPPING_AMOUNT },
            { region_id: usRegion!.id, amount: SHIPPING_AMOUNT },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
        {
          name: "Express Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Express",
            description: "Ship in 24 hours.",
            code: "express",
          },
          prices: [
            { currency_code: "cad", amount: SHIPPING_AMOUNT },
            { currency_code: "usd", amount: SHIPPING_AMOUNT },
            { region_id: canadaRegion!.id, amount: SHIPPING_AMOUNT },
            { region_id: usRegion!.id, amount: SHIPPING_AMOUNT },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    });

    const { data: salesChannels } = await query.graph({
      entity: "sales_channel",
      fields: ["id"],
    });
    const defaultSalesChannel = salesChannels[0];

    if (defaultSalesChannel) {
      await linkSalesChannelsToStockLocationWorkflow(container).run({
        input: {
          id: naStockLocation.id,
          add: [defaultSalesChannel.id],
        },
      });
    }

    const { data: inventoryItems } = await query.graph({
      entity: "inventory_item",
      fields: ["id"],
    });

    const { data: existingLevels } = await query.graph({
      entity: "inventory_level",
      fields: ["inventory_item_id", "location_id"],
      filters: { location_id: naStockLocation.id },
    });
    const stockedItemIds = new Set(
      existingLevels.map((l) => l.inventory_item_id)
    );

    const levelsToCreate = inventoryItems
      .filter((item) => !stockedItemIds.has(item.id))
      .map((item) => ({
        location_id: naStockLocation!.id,
        stocked_quantity: 1000000,
        inventory_item_id: item.id,
      }));

    if (levelsToCreate.length) {
      logger.info("Seeding inventory at North American warehouse...");
      await createInventoryLevelsWorkflow(container).run({
        input: { inventory_levels: levelsToCreate },
      });
    }
  }

  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: [
      "id",
      "product_id",
      "prices.amount",
      "prices.currency_code",
    ],
  });

  const variantsNeedingCad = variants.filter(
    (v) =>
      !v.prices?.some(
        (p) => p.currency_code?.toLowerCase() === "cad"
      )
  );

  if (variantsNeedingCad.length) {
    logger.info(`Adding CAD prices to ${variantsNeedingCad.length} variants...`);
    const variantIds = variantsNeedingCad.map((v) => v.id);
    await upsertVariantPricesWorkflow(container).run({
      input: {
        variantPrices: variantsNeedingCad.map((variant) => ({
          variant_id: variant.id,
          product_id: variant.product_id!,
          prices: [
            {
              amount: DEMO_PRICE_CAD,
              currency_code: "cad",
            },
            {
              amount: DEMO_PRICE_CAD,
              currency_code: "usd",
            },
          ],
        })),
        previousVariantIds: variantIds,
      },
    });
  }

  logger.info("North America region setup complete.");
}
