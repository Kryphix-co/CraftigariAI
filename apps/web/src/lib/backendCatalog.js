export const BACKEND_CATALOG_EVENT = "craftigari:backend-catalog-change";

export function mapBackendArtisan(artisan) {
  if (!artisan) return null;
  const id = String(artisan.id ?? artisan._id ?? "");
  return {
    followerCount: 0,
    id,
    image: artisan.profilePhoto || null,
    introduction: artisan.bio || "No artisan introduction has been added.",
    location: artisan.location || "Location not added",
    name: artisan.name || "Craftigari artisan",
    region: artisan.location || "Location not added",
    specialization:
      artisan.craftSpecialization || "Craft specialization not added",
  };
}

export function mapBackendProduct(product) {
  const artisanProfile =
    product.artisan && typeof product.artisan === "object"
      ? mapBackendArtisan(product.artisan)
      : null;
  const artisanId = artisanProfile?.id || String(product.artisan ?? "");
  const images = Array.isArray(product.images) ? product.images : [];
  const id = String(product.id);

  return {
    artisan: artisanProfile?.name || "Craftigari artisan",
    artisanId,
    artisanProfile,
    batch: id.slice(0, 8).toUpperCase(),
    category: product.category || "Other Crafts",
    craftType: product.craftType || product.category || "Craft",
    description: product.description || "Description not added.",
    colours: product.colours ?? [],
    featured: false,
    id,
    image: images[0] || null,
    images,
    isBackendProduct: true,
    leadTime: "Contact artisan",
    makingProcess: (product.makingProcess ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((step) => ({
        ...step,
        image: step.imageUrl || null,
      })),
    material: (product.materials ?? []).join(", ") || "Material not added",
    minQty: 1,
    name: product.title || "Untitled craft product",
    price: Number(product.price) || 0,
    tags: product.tags ?? [],
    publishedAt: product.publishedAt,
    region: artisanProfile?.location || "Location not added",
  };
}
