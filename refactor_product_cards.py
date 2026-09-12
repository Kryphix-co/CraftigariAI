import os
import re

MOCK_PRODUCTS_CODE = """
const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "Handcrafted Terracotta Planter",
    artisan: "Master Ram Singh",
    region: "Rajasthan",
    category: "Pottery & Ceramics",
    price: 850,
    minQty: 20,
    leadTime: "14 Days Lead",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop",
    batch: "AM-104",
    featured: true,
  },
  {
    id: "p2",
    name: "Indigo Block Print Shawl",
    artisan: "Chhipa Guild",
    region: "Rajasthan",
    category: "Textiles & Weaving",
    price: 2400,
    minQty: 10,
    leadTime: "21 Days Lead",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop",
    batch: "BG-092",
    featured: true,
  },
  {
    id: "p3",
    name: "Handwoven Bamboo Basket",
    artisan: "Bodo Weavers Collective",
    region: "Assam",
    category: "Bamboo & Cane",
    price: 1200,
    minQty: 15,
    leadTime: "10 Days Lead",
    image: "https://images.unsplash.com/photo-1595865886071-7059db9ec227?q=80&w=800&auto=format&fit=crop",
    batch: "AS-014",
    featured: false,
  },
  {
    id: "p4",
    name: "Carved Wooden Serving Tray",
    artisan: "Nizam Artisans",
    region: "Uttar Pradesh",
    category: "Woodcraft",
    price: 1850,
    minQty: 25,
    leadTime: "18 Days Lead",
    image: "https://images.unsplash.com/photo-1549488344-c740b2efd488?q=80&w=800&auto=format&fit=crop",
    batch: "SH-201",
    featured: false,
  }
];
"""

def process_products_page():
    # 1. Update products/page.jsx
    path = "apps/web/src/app/products/page.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if 'import { ProductCard }' not in content:
        content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { ProductCard } from "@/components/buyer/ProductCard";')
    
    # Replace the Link map block with ProductCard
    link_block_pattern = r'<Link key=\{product\.id\}.*?</Link>'
    content = re.sub(link_block_pattern, '<ProductCard key={product.id} product={product} />', content, flags=re.DOTALL)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def process_page_jsx():
    # 2. Update page.jsx
    path = "apps/web/src/app/page.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Inject imports and mock products
    if 'import { ProductCard }' not in content:
        content = content.replace('import { BuyerHeader }', 'import { ProductCard } from "@/components/buyer/ProductCard";\nimport { BuyerHeader }')
        
    if 'const MOCK_PRODUCTS' not in content:
        content = content.replace('export default function Home() {', MOCK_PRODUCTS_CODE + '\nexport default function Home() {')

    # Replace "Featured Crafts" grid
    # We find the grid containing 4 identical cards
    featured_grid_pattern = r'(<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">)(.*?)(</section>)'
    
    def repl_grid(match):
        prefix = match.group(1)
        suffix = match.group(3)
        # We replace the inner content with a map over MOCK_PRODUCTS
        inner = """
          {MOCK_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        """
        return prefix + inner + suffix

    # Actually wait, there are TWO grids in page.jsx. Let's find both.
    # The first one is under "Featured Crafts"
    # The second is under "New Kiln Batches"
    content = re.sub(r'(<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">).*?(</div>\s*</div>\s*</section>)', lambda m: m.group(1) + '\n          {MOCK_PRODUCTS.map(product => (\n            <ProductCard key={product.id} product={product} />\n          ))}\n        ' + m.group(2), content, flags=re.DOTALL)

    # Now let's fix mobile responsiveness in page.jsx
    # Fix Hero Section
    content = content.replace('py-10 sm:py-12 lg:py-16', 'py-6 sm:py-12 lg:py-16')
    content = content.replace('text-3xl sm:text-4xl lg:text-[46px]', 'text-[28px] sm:text-4xl lg:text-[46px]')
    content = content.replace('leading-[1.12]', 'leading-tight')
    
    # Fix Categories Grid
    # Originally it's a grid grid-cols-1 sm:grid-cols-3...
    # Let's make it horizontal scroll on mobile
    cat_grid_pattern = r'<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">'
    content = content.replace(cat_grid_pattern, '<div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">')
    
    # We need to make the category cards flex shrink 0 on mobile
    cat_card_pattern = r'<div className="group relative aspect-square sm:aspect-\[4/5\] overflow-hidden bg-surface-muted">'
    content = content.replace(cat_card_pattern, '<div className="group relative aspect-square sm:aspect-[4/5] overflow-hidden bg-surface-muted min-w-[260px] sm:min-w-0 snap-start">')
    
    # Fix Form Spacing
    # The form container has py-16 sm:py-24
    content = content.replace('py-16 sm:py-24', 'py-10 sm:py-24')

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def process_product_page():
    # 3. Update product/page.jsx
    path = "apps/web/src/app/product/page.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Inject imports and mock products
    if 'import { ProductCard }' not in content:
        content = content.replace('import { BuyerHeader }', 'import { ProductCard } from "@/components/buyer/ProductCard";\nimport { BuyerHeader }')
        
    if 'const MOCK_PRODUCTS' not in content:
        content = content.replace('export default function ProductPage() {', MOCK_PRODUCTS_CODE + '\nexport default function ProductPage() {')

    # Replace "More from this Cluster" grid
    content = re.sub(r'(<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">).*?(</section>)', lambda m: m.group(1) + '\n          {MOCK_PRODUCTS.map(product => (\n            <ProductCard key={product.id} product={product} />\n          ))}\n        </div>\n      ' + m.group(2), content, flags=re.DOTALL)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

process_products_page()
process_page_jsx()
process_product_page()
print("Refactoring complete.")
