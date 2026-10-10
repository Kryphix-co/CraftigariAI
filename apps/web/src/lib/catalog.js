export const ARTISANS = {
  "ram-singh": {
    id: "ram-singh",
    name: "Master Ram Singh",
    location: "Amer, Rajasthan",
    region: "Rajasthan",
    specialization: "Terracotta & Pottery",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=500&auto=format&fit=crop",
    introduction:
      "Ram Singh creates functional terracotta using techniques practiced in his family workshop in Amer.",
    followerCount: 128,
  },
  "chhipa-guild": {
    id: "chhipa-guild",
    name: "Chhipa Guild",
    location: "Bagru, Rajasthan",
    region: "Rajasthan",
    specialization: "Block Printing & Textiles",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=500&auto=format&fit=crop",
    introduction:
      "A family-led printing guild working with hand-carved blocks, natural dyes, and regional textile traditions.",
    followerCount: 94,
  },
  "bodo-collective": {
    id: "bodo-collective",
    name: "Bodo Weavers Collective",
    location: "Kokrajhar, Assam",
    region: "Assam",
    specialization: "Bamboo & Cane",
    image: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=500&auto=format&fit=crop",
    introduction:
      "A small collective producing handwoven bamboo forms for everyday storage and home use.",
    followerCount: 76,
  },
  "nizam-artisans": {
    id: "nizam-artisans",
    name: "Nizam Artisans",
    location: "Saharanpur, Uttar Pradesh",
    region: "Uttar Pradesh",
    specialization: "Woodcraft",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=500&auto=format&fit=crop",
    introduction:
      "A woodcarving workshop creating serving and architectural pieces with hand-cut decorative details.",
    followerCount: 83,
  },
  "metalcraft-guild": {
    id: "metalcraft-guild",
    name: "Metalcraft Guild",
    location: "Moradabad, Uttar Pradesh",
    region: "Uttar Pradesh",
    specialization: "Metalcraft",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=500&auto=format&fit=crop",
    introduction:
      "A workshop group producing hand-finished brass objects for ritual and decorative use.",
    followerCount: 112,
  },
  "kala-raksha": {
    id: "kala-raksha",
    name: "Kala Raksha",
    location: "Kachchh, Gujarat",
    region: "Gujarat",
    specialization: "Textiles & Weaving",
    image: "https://images.unsplash.com/photo-1584444533036-7c9886f45cc3?q=80&w=500&auto=format&fit=crop",
    introduction:
      "A textile group preserving regional weaving and embroidery through contemporary household pieces.",
    followerCount: 145,
  },
  "khurja-potters": {
    id: "khurja-potters",
    name: "Khurja Master Potters",
    location: "Khurja, Uttar Pradesh",
    region: "Uttar Pradesh",
    specialization: "Pottery & Ceramics",
    image: "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=500&auto=format&fit=crop",
    introduction:
      "A group of ceramic workshops producing wheel-thrown and glazed tableware in Khurja.",
    followerCount: 167,
  },
  "manipur-cane": {
    id: "manipur-cane",
    name: "Manipur Cane Collective",
    location: "Imphal, Manipur",
    region: "Manipur",
    specialization: "Bamboo & Cane",
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f09?q=80&w=500&auto=format&fit=crop",
    introduction:
      "A cane-working collective making lightweight storage pieces with locally sourced material.",
    followerCount: 69,
  },
};

function processSteps(material, productName, image) {
  return [
    {
      id: "raw-material",
      stage: "raw-material",
      title: "Raw Material",
      description: `${material} is selected and prepared for the piece.`,
      image,
      imageUrl: image,
      order: 0,
    },
    {
      id: "making-crafting",
      stage: "making-crafting",
      title: "Making / Crafting",
      description: `${productName} is shaped and finished by hand.`,
      image,
      imageUrl: image,
      order: 1,
    },
    {
      id: "finished-product",
      stage: "finished-product",
      title: "Finished Product",
      description: "The completed piece is inspected and prepared for delivery.",
      image,
      imageUrl: image,
      order: 2,
    },
  ];
}

function product(data) {
  const artisanProfile = ARTISANS[data.artisanId] ?? null;

  return {
    minQty: 1,
    leadTime: "14 Days Lead",
    featured: false,
    ...data,
    artisanProfile,
    colours: data.colours ?? [],
    images: data.images ?? [data.image],
    isBackendProduct: false,
    isSampleProduct: true,
    makingProcess:
      data.makingProcess ??
      processSteps(data.material, data.name, data.image),
    publishedAt: data.publishedAt ?? null,
    tags:
      data.tags ??
      [data.category, data.craftType, data.material].filter(Boolean),
  };
}

export const STATIC_PRODUCTS = [
  product({
    id: "p1",
    name: "Handcrafted Terracotta Planter",
    artisanId: "ram-singh",
    artisan: "Master Ram Singh",
    region: "Rajasthan",
    category: "Pottery & Ceramics",
    craftType: "Terracotta pottery",
    material: "Natural terracotta clay",
    description:
      "A hand-shaped terracotta planter with a breathable clay body and a warm, naturally fired finish.",
    price: 850,
    minQty: 20,
    leadTime: "14 Days Lead",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200&auto=format&fit=crop",
    batch: "AM-104",
    featured: true,
  }),
  product({
    id: "p2",
    name: "Indigo Block Print Shawl",
    artisanId: "chhipa-guild",
    artisan: "Chhipa Guild",
    region: "Rajasthan",
    category: "Textiles & Weaving",
    craftType: "Hand block printing",
    material: "Cotton and indigo dye",
    description:
      "A soft cotton shawl printed by hand with carved blocks and layered indigo patterns.",
    price: 2400,
    minQty: 10,
    leadTime: "21 Days Lead",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1200&auto=format&fit=crop",
    batch: "BG-092",
    featured: true,
  }),
  product({
    id: "p3",
    name: "Handwoven Bamboo Basket",
    artisanId: "bodo-collective",
    artisan: "Bodo Weavers Collective",
    region: "Assam",
    category: "Bamboo & Cane",
    craftType: "Bamboo weaving",
    material: "Split bamboo",
    description:
      "A lightweight storage basket woven by hand from carefully prepared bamboo strips.",
    price: 1200,
    minQty: 15,
    leadTime: "10 Days Lead",
    image: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=1200&auto=format&fit=crop",
    batch: "AS-014",
  }),
  product({
    id: "p4",
    name: "Carved Wooden Serving Tray",
    artisanId: "nizam-artisans",
    artisan: "Nizam Artisans",
    region: "Uttar Pradesh",
    category: "Woodcraft",
    craftType: "Wood carving",
    material: "Seasoned mango wood",
    description:
      "A solid-wood serving tray with hand-carved edges and a smooth food-safe finish.",
    price: 1850,
    minQty: 25,
    leadTime: "18 Days Lead",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop",
    batch: "SH-201",
  }),
  product({
    id: "p5",
    name: "Brass Decorative Diya Set",
    artisanId: "metalcraft-guild",
    artisan: "Metalcraft Guild",
    region: "Uttar Pradesh",
    category: "Metalcraft",
    craftType: "Brass casting and finishing",
    material: "Brass",
    description:
      "A coordinated set of hand-finished brass diyas for festive and everyday settings.",
    price: 3200,
    minQty: 5,
    leadTime: "30 Days Lead",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop",
    batch: "MB-055",
    featured: true,
  }),
  product({
    id: "p6",
    name: "Handwoven Cushion Cover",
    artisanId: "kala-raksha",
    artisan: "Kala Raksha",
    region: "Gujarat",
    category: "Textiles & Weaving",
    craftType: "Handloom weaving",
    material: "Handwoven cotton",
    description:
      "A tactile cotton cushion cover combining regional weaving with a practical contemporary size.",
    price: 950,
    minQty: 50,
    leadTime: "25 Days Lead",
    image: "https://images.unsplash.com/photo-1584444533036-7c9886f45cc3?q=80&w=1200&auto=format&fit=crop",
    batch: "KC-088",
  }),
  product({
    id: "p7",
    name: "Ceramic Tableware Set",
    artisanId: "khurja-potters",
    artisan: "Khurja Master Potters",
    region: "Uttar Pradesh",
    category: "Pottery & Ceramics",
    craftType: "Glazed ceramics",
    material: "Glazed ceramic",
    description:
      "A wheel-thrown tableware set finished with a durable glaze for regular dining use.",
    price: 4500,
    minQty: 10,
    leadTime: "40 Days Lead",
    image: "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=1200&auto=format&fit=crop",
    batch: "KJ-312",
    featured: true,
  }),
  product({
    id: "p8",
    name: "Cane Storage Basket",
    artisanId: "manipur-cane",
    artisan: "Manipur Cane Collective",
    region: "Manipur",
    category: "Bamboo & Cane",
    craftType: "Cane weaving",
    material: "Natural cane",
    description:
      "A flexible cane basket woven for lightweight household storage and everyday handling.",
    price: 1600,
    minQty: 15,
    leadTime: "20 Days Lead",
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f09?q=80&w=1200&auto=format&fit=crop",
    batch: "MN-042",
  }),
];

export const CRAFT_CATEGORIES = [
  "All Crafts",
  "Pottery & Ceramics",
  "Textiles & Weaving",
  "Bamboo & Cane",
  "Woodcraft",
  "Metalcraft",
];

export const REGIONS = [
  "All Regions",
  "Rajasthan",
  "Assam",
  "Uttar Pradesh",
  "Gujarat",
  "Manipur",
];

export function getArtisanById(id) {
  return ARTISANS[id] ?? null;
}

export function getStaticProductById(id) {
  return STATIC_PRODUCTS.find((item) => item.id === id) ?? null;
}
