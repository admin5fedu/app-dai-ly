import { ProductCard } from './ProductCard'
import { getProductType } from '@/api/products'

export function ProductList({ products, groupedProducts, onProductClick }) {
  return (
    <div className="space-y-3">
      {products.map(product => {
        // Skip children - they'll be shown under their parent
        if (product.id_san_pham_cha && product.id_san_pham_cha.trim()) {
          return null
        }
        
        const children = groupedProducts.get(product.ID) || []
        const hasChildren = children.length > 0
        const type = getProductType(product, hasChildren)
        
        return (
          <ProductCard
            key={product.ID}
            product={product}
            type={type}
            childrenCount={children.length}
            onClick={() => onProductClick(product)}
          />
        )
      })}
    </div>
  )
}
