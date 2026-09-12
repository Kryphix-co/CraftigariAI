import os
import re

def process_page():
    path = "apps/web/src/app/page.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the "Featured Crafts" grid
    # It starts at <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> and ends at </section>
    pattern_featured = r'(<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">)(.*?)(</section>)'
    
    def repl_featured(m):
        return m.group(1) + """
    {MOCK_PRODUCTS.slice(0, 4).map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
   </div>
  """ + m.group(3)
  
    content = re.sub(pattern_featured, repl_featured, content, flags=re.DOTALL, count=1)

    # Find the "New Kiln Batches" grid
    # This also starts at <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    pattern_batches = r'(<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">)(.*?)(</section>)'
    
    def repl_batches(m):
        return m.group(1) + """
    {MOCK_PRODUCTS.slice(4, 8).map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
   </div>
  """ + m.group(3)
  
    content = re.sub(pattern_batches, repl_batches, content, flags=re.DOTALL, count=1)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def process_product():
    path = "apps/web/src/app/product/page.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the "Similar Products" grid
    # It starts at <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    pattern = r'(<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">)(.*?)(</section>)'
    
    def repl(m):
        return m.group(1) + """
    {MOCK_PRODUCTS.slice(0, 4).map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
   </div>
  """ + m.group(3)
  
    content = re.sub(pattern, repl, content, flags=re.DOTALL, count=1)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

process_page()
process_product()
print("Grids replaced.")
