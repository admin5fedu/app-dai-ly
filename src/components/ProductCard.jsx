import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SmartImage } from './SmartImage'

/**
 * Custom comparison function for React.memo
 * Only re-render if these props change
 */
function areEqual(prevProps, nextProps) {
  return (
    prevProps.product.ID === nextProps.product.ID &&
    prevProps.product.ten_san_pham === nextProps.product.ten_san_pham &&
    prevProps.product.ma_san_pham === nextProps.product.ma_san_pham &&
    prevProps.product.link_anh_san_pham === nextProps.product.link_anh_san_pham &&
    prevProps.product.gia_ban === nextProps.product.gia_ban &&
    prevProps.product.do_vi_tinh === nextProps.product.do_vi_tinh &&
    prevProps.type === nextProps.type &&
    prevProps.childrenCount === nextProps.childrenCount
  )
}

function ProductCardComponent({ product, type, childrenCount, onClick }) {
  if (!product) return null

  return (
    <Card 
      className={cn(
        'transition-all duration-200 cursor-pointer',
        'hover:shadow-md hover:border-primary/20',
        'active:scale-[0.99]',
        'min-h-[100px]' // Chiều cao tối thiểu để tránh layout shift
      )}
      onClick={onClick}
      style={{ contentVisibility: 'auto' }} // CSS containment for performance
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Image with SmartImage component */}
          <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
            <SmartImage
              src={product.link_anh_san_pham}
              alt={product.ten_san_pham}
              containerClassName="rounded-lg"
              skeletonClassName="rounded-lg"
              fallbackIcon={Package}
              fallbackIconSize={32}
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                  {product.ten_san_pham || 'Không có tên'}
                </h3>
                {product.ma_san_pham && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.ma_san_pham}
                  </p>
                )}
              </div>
              {type === 'parent' && childrenCount > 0 && (
                <Badge variant="secondary" className="shrink-0 text-xs flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {childrenCount}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-2.5">
              <div className="flex gap-1.5 flex-wrap">
                {type === 'parent' && (
                  <Badge variant="secondary" className="text-xs">Nhóm</Badge>
                )}
                {type === 'child' && (
                  <Badge variant="outline" className="text-xs">Chi tiết</Badge>
                )}
                {product.do_vi_tinh && product.do_vi_tinh.trim() && (
                  <Badge variant="outline" className="text-xs">
                    {product.do_vi_tinh}
                  </Badge>
                )}
              </div>
            </div>
            {product.gia_ban && product.gia_ban.trim() && (
              <div className="mt-2 flex items-center justify-end">
                <span className="font-bold text-primary text-base">
                  {product.gia_ban}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Export memoized component với custom comparison
export const ProductCard = memo(ProductCardComponent, areEqual)
