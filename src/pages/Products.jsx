import { useState, useMemo, useCallback, useDeferredValue, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useReadSheet } from '@/api/use-google-sheets'
import { ProductCard } from '@/components/ProductCard'
import { ProductSearch } from '@/components/ProductSearch'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { EmptyState } from '@/components/EmptyState'
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh'
import { parseProducts, groupProductsByParent, filterProducts, getProductType } from '@/api/products'
import { toast } from 'sonner'
import { Package, Search, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Products() {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const parentRef = useRef(null)
  
  // Data Layer: useQuery với staleTime 10 phút
  const { data, isLoading, error, refetch, isFetching } = useReadSheet({
    sheetName: 'san_pham'
  }, {
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
  
  const products = useMemo(() => {
    if (!data?.values) return []
    try {
      return parseProducts(data.values)
    } catch (err) {
      console.error('Error parsing products:', err)
      toast.error('Lỗi khi xử lý dữ liệu sản phẩm')
      return []
    }
  }, [data])
  
  const groupedProducts = useMemo(() => {
    return groupProductsByParent(products)
  }, [products])
  
  // Search: useDeferredValue để không làm đơ UI
  const deferredSearchValue = useDeferredValue(searchValue)
  
  // Filter và chỉ lấy parents/standalone (không có children)
  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, deferredSearchValue)
    // Chỉ lấy parents và standalone (filter out children)
    return filtered.filter(p => !p.id_san_pham_cha || !p.id_san_pham_cha.trim())
  }, [products, deferredSearchValue])
  
  // Virtualization: Setup virtualizer
  const virtualizer = useVirtualizer({
    count: filteredProducts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated height của mỗi ProductCard (px)
    overscan: 5, // Render 5 items ngoài viewport
  })
  
  const handleProductClick = useCallback((product) => {
    navigate(`/products/${product.ID}`, {
      state: { from: '/products' }
    })
  }, [navigate])
  
  const handleSearch = useCallback((value) => {
    // Search is handled by filteredProducts memo với useDeferredValue
  }, [])
  
  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])
  
  const handleClearSearch = useCallback(() => {
    setSearchValue('')
  }, [])
  
  const { containerRef, isPulling, progress, shouldRefresh, pullDistance } = usePullToRefresh({
    onRefresh: async () => {
      await refetch()
      toast.success('Đã làm mới danh sách')
    },
    disabled: isLoading,
  })
  
  // Combine refs for pull-to-refresh and virtualization
  const combinedRef = useCallback((node) => {
    containerRef.current = node
    parentRef.current = node
  }, [containerRef])
  
  return (
    <div 
      ref={combinedRef}
      className="flex-1 bg-gradient-to-b from-background to-muted/20 relative overflow-auto"
      style={{
        transform: isPulling ? `translateY(${Math.min(pullDistance * 0.5, 60)}px)` : 'translateY(0)',
        transition: isPulling ? 'none' : 'transform 0.3s ease-out',
      }}
    >
      {/* Pull to refresh indicator */}
      {isPulling && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 pointer-events-none z-10">
          <div className={cn(
            "flex flex-col items-center gap-2 transition-opacity",
            shouldRefresh ? "opacity-100" : "opacity-60"
          )}>
            <RefreshCw 
              className={cn(
                "h-6 w-6 text-primary transition-transform",
                shouldRefresh && "animate-spin"
              )} 
            />
            <span className="text-xs text-muted-foreground">
              {shouldRefresh ? 'Thả để làm mới' : 'Kéo để làm mới'}
            </span>
          </div>
        </div>
      )}
      
      <div className="container mx-auto max-w-md px-4 py-4 page-enter">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Sản phẩm
          </h1>
          <p className="text-sm text-muted-foreground">Quản lý và tìm kiếm sản phẩm</p>
        </div>
        
        <ProductSearch
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onSearch={handleSearch}
          isSearching={isFetching && !isLoading}
        />
        
        {isLoading ? (
          <div className="flex flex-col gap-3 mt-4">
            {[...Array(10)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="mt-4">
            <ErrorState
              title="Không thể tải danh sách sản phẩm"
              message={error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng kiểm tra kết nối và thử lại.'}
              onRetry={handleRetry}
            />
          </div>
        ) : (!products || products.length === 0) ? (
          <div className="mt-4">
            <EmptyState
              icon={Package}
              title="Chưa có sản phẩm nào"
              description="Danh sách sản phẩm hiện đang trống."
            />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={Search}
              title="Không tìm thấy sản phẩm"
              description={`Không tìm thấy sản phẩm nào với từ khóa "${searchValue}". Thử tìm kiếm với từ khóa khác.`}
              actionLabel="Xóa bộ lọc"
              onAction={handleClearSearch}
            />
          </div>
        ) : (
          <div className="flex flex-col mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">
                Tìm thấy <span className="font-semibold text-foreground">{filteredProducts.length}</span> sản phẩm
                {isFetching && (
                  <span className="ml-2 text-xs text-muted-foreground">(Đang tải...)</span>
                )}
              </p>
            </div>
            
            {/* Virtualized List */}
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const product = filteredProducts[virtualItem.index]
                if (!product) return null
                
                const children = groupedProducts.get(product.ID) || []
                const hasChildren = children.length > 0
                const type = getProductType(product, hasChildren)
                
                return (
                  <div
                    key={virtualItem.key}
                    data-index={virtualItem.index}
                    ref={virtualizer.measureElement}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    <div className="mb-3">
                      <ProductCard
                        product={product}
                        type={type}
                        childrenCount={children.length}
                        onClick={() => handleProductClick(product)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
