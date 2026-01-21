import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useReadSheet } from '@/api/use-google-sheets'
import { parseProducts, groupProductsByParent } from '@/api/products'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Hash, Tag, Ruler, DollarSign, Package, ArrowLeft } from 'lucide-react'
import { ProductDetailSkeleton } from '@/components/ProductDetailSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { SmartImage } from '@/components/SmartImage'
import { toast } from 'sonner'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { useCustomBack } from '@/hooks/use-custom-back'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { handleBack } = useCustomBack('/products')

  const { data, isLoading, error, refetch } = useReadSheet({
    sheetName: 'san_pham'
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

  const product = useMemo(() => {
    return products.find(p => p.ID === id)
  }, [products, id])

  const children = useMemo(() => {
    if (!product) return []
    return groupedProducts.get(product.ID) || []
  }, [product, groupedProducts])

  const handleRetry = () => {
    refetch()
  }

  if (error) {
    toast.error('Lỗi khi tải dữ liệu sản phẩm')
  }

  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-md px-4 py-4">
          <div className="mb-4">
            <div className="h-10 w-24 bg-muted rounded-md animate-pulse" />
          </div>
          <ProductDetailSkeleton />
        </div>
      </div>
    )
  }

  if (error && !isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-md px-4 py-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <ErrorState
            title="Không thể tải thông tin sản phẩm"
            message={error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.'}
            onRetry={handleRetry}
          />
        </div>
      </div>
    )
  }

  if (!product && !isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-md px-4 py-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">Không tìm thấy sản phẩm</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-background to-muted/20 flex flex-col min-h-0">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shrink-0">
        <div className="container mx-auto max-w-md px-4 py-3">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="h-9 px-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </header>

      {/* Body Content - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="container mx-auto max-w-md px-4 py-4 pb-6 page-enter">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.ten_san_pham || 'Không có tên'}</h1>
              {product.ma_san_pham && (
                <p className="text-sm text-muted-foreground">Mã: {product.ma_san_pham}</p>
              )}
            </div>

            {/* Image */}
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
              <SmartImage
                src={product.link_anh_san_pham}
                alt={product.ten_san_pham}
                containerClassName="w-full h-full"
                skeletonClassName="w-full h-full"
                fallbackIcon={Package}
                fallbackIconSize={64}
              />
            </div>

            {/* Info */}
            <div className="space-y-3">
              {product.ma_san_pham && (
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium">Mã sản phẩm:</span>
                  <span className="text-sm">{product.ma_san_pham}</span>
                </div>
              )}

              {product.ma_vach && product.ma_vach.trim() && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium">Mã vạch:</span>
                  <span className="text-sm break-all">{product.ma_vach}</span>
                </div>
              )}

              {product.ten_khac && product.ten_khac.trim() && (
                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium mr-1">Tên khác:</span>
                    <span className="text-sm break-words">{product.ten_khac}</span>
                  </div>
                </div>
              )}

              {product.do_vi_tinh && product.do_vi_tinh.trim() && (
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium">Đơn vị tính:</span>
                  <Badge variant="outline">{product.do_vi_tinh}</Badge>
                </div>
              )}
            </div>

            {/* Price - Always visible if exists */}
            {product.gia_ban && product.gia_ban.trim() && (
              <>
                <Separator />
                <div className="flex items-center gap-3 py-2 mb-20">
                  <DollarSign className="w-6 h-6 text-primary shrink-0" />
                  <span className="text-2xl font-bold text-primary">{product.gia_ban}</span>
                </div>
              </>
            )}

            {/* Children List */}
            {children && children.length > 0 && (
              <>
                <Separator />
                <div className="mb-20">
                  <h4 className="font-semibold mb-3 text-sm">Sản phẩm con ({children.length}):</h4>
                  <div className="space-y-3">
                    {children.map(child => (
                      <div
                        key={child.ID}
                        onClick={() => navigate(`/products/${child.ID}`, {
                          state: { ...location.state } // Truyền tiếp state gốc qua các tầng con
                        })}
                        className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer active:scale-[0.99]"
                      >
                        <div className="flex gap-3">
                          {/* Image */}
                          <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                            <SmartImage
                              src={child.link_anh_san_pham}
                              alt={child.ten_san_pham}
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
                                <p className="font-medium text-sm leading-tight line-clamp-2">
                                  {child.ten_san_pham || 'Không có tên'}
                                </p>
                                {child.ma_san_pham && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Mã: {child.ma_san_pham}
                                  </p>
                                )}
                              </div>
                            </div>
                            {child.gia_ban && child.gia_ban.trim() && (
                              <div className="mt-2 flex items-center justify-end">
                                <span className="font-bold text-primary text-base">
                                  {child.gia_ban}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

