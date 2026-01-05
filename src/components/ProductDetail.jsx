import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Hash, Tag, Ruler, DollarSign, Package, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProductDetail({ product, children, isOpen, onClose }) {
  if (!product) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left pr-8">
            {product.ten_san_pham || 'Không có tên'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image */}
          {product.link_anh_san_pham && product.link_anh_san_pham.trim() ? (
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
              <img 
                src={product.link_anh_san_pham} 
                alt={product.ten_san_pham} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          ) : (
            <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center">
              <Package className="w-16 h-16 text-muted-foreground/50" />
            </div>
          )}
          
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
            
            {product.do_vi_tinh && product.do_vi_tinh.trim() && (
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium">Đơn vị tính:</span>
                <Badge variant="outline">{product.do_vi_tinh}</Badge>
              </div>
            )}
            
            {product.gia_ban && product.gia_ban.trim() && (
              <>
                <Separator />
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-xl font-bold text-primary">{product.gia_ban}</span>
                </div>
              </>
            )}
          </div>
          
          {/* Children List */}
          {children && children.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3 text-sm">Sản phẩm con ({children.length}):</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {children.map(child => (
                    <div 
                      key={child.ID} 
                      className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium text-sm">{child.ten_san_pham || 'Không có tên'}</p>
                      {child.ma_san_pham && (
                        <p className="text-xs text-muted-foreground mt-1">{child.ma_san_pham}</p>
                      )}
                      {child.gia_ban && child.gia_ban.trim() && (
                        <p className="text-sm font-semibold text-primary mt-2">{child.gia_ban}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

