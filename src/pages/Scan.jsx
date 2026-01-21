import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import { useReadSheet } from '@/api/use-google-sheets'
import { parseProducts } from '@/api/products'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProductCard } from '@/components/ProductCard'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'
import { EmptyState } from '@/components/EmptyState'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { QrCode, Search, Camera, X, Package, AlertCircle, Upload, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function Scan() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false)
  const html5QrCodeRef = useRef(null)
  const scannerContainerRef = useRef(null)
  const isScannerStartedRef = useRef(false)
  const fileInputRef = useRef(null)

  const { data, isLoading } = useReadSheet({
    sheetName: 'san_pham'
  })

  const products = useMemo(() => {
    if (!data?.values) return []
    try {
      return parseProducts(data.values)
    } catch (err) {
      console.error('Error parsing products:', err)
      return []
    }
  }, [data])

  // Debounce search term với 300ms delay
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true)
      const timer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm)
        setIsSearching(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setDebouncedSearchTerm('')
      setIsSearching(false)
    }
  }, [searchTerm])

  // Hàm trích xuất mã từ kết quả quét (xử lý URL)
  const extractCodeFromResult = (result) => {
    if (!result) return ''

    const trimmed = result.trim()

    // Nếu là URL, lấy phần path cuối cùng
    try {
      const url = new URL(trimmed)
      const pathParts = url.pathname.split('/').filter(p => p)
      // Lấy phần cuối cùng của path, nếu không có thì lấy hostname
      return pathParts.length > 0 ? pathParts[pathParts.length - 1] : url.hostname.replace('www.', '')
    } catch {
      // Không phải URL hợp lệ, trả về nguyên văn
      return trimmed
    }
  }

  // Tìm kiếm sản phẩm theo ID, ten_san_pham, ma_vach
  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return []

    const term = debouncedSearchTerm.trim().toLowerCase()
    const results = products.filter(product => {
      const id = String(product.ID || '').toLowerCase()
      const tenSanPham = (product.ten_san_pham || '').toLowerCase()
      const maVach = (product.ma_vach || '').toLowerCase()
      const tenKhac = (product.ten_khac || '').toLowerCase()

      return id === term ||
        id.includes(term) ||
        tenSanPham.includes(term) ||
        maVach === term ||
        maVach.includes(term) ||
        tenKhac.includes(term)
    })

    return results.slice(0, 20) // Giới hạn 20 kết quả
  }, [products, debouncedSearchTerm])

  // Khởi tạo và cleanup camera
  useEffect(() => {
    if (!isScanning) {
      // Nếu không scanning, đảm bảo cleanup
      if (html5QrCodeRef.current && isScannerStartedRef.current) {
        const scanner = html5QrCodeRef.current
        isScannerStartedRef.current = false
        scanner.stop().catch(() => { }).then(() => {
          try {
            scanner.clear()
          } catch (e) { }
          html5QrCodeRef.current = null
        }).catch(() => {
          try {
            scanner.clear()
          } catch (e) { }
          html5QrCodeRef.current = null
        })
      }
      return
    }

    // Đảm bảo container đã được render
    if (!scannerContainerRef.current) {
      // Retry sau một chút nếu container chưa sẵn sàng
      const timeoutId = setTimeout(() => {
        if (scannerContainerRef.current && isScanning) {
          // Trigger lại effect bằng cách set state (nhưng không làm được trong effect)
          // Thay vào đó, ta sẽ đợi container render xong
        }
      }, 100)
      return () => clearTimeout(timeoutId)
    }

    let html5QrCode = null
    let isMounted = true

    const startScanning = async () => {
      try {
        // Đảm bảo container vẫn tồn tại
        if (!scannerContainerRef.current || !isScanning) {
          return
        }

        html5QrCode = new Html5Qrcode(scannerContainerRef.current.id)
        html5QrCodeRef.current = html5QrCode

        setCameraPermissionDenied(false)

        // Bắt đầu quét với qrbox hình vuông (hỗ trợ cả QR code và barcode)
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }, // Hình vuông để quét QR code tốt hơn (vẫn quét được barcode)
            aspectRatio: 1.0,
          },
          async (decodedText, decodedResult) => {
            // Kiểm tra component vẫn mounted và đang scanning
            if (!isMounted || !isScanning) return

            // Khi quét thành công: rung điện thoại
            if ('vibrate' in navigator) {
              navigator.vibrate(200)
            }

            // Dừng scanner trước khi cập nhật state
            try {
              await html5QrCode.stop()
              html5QrCode.clear()
              isScannerStartedRef.current = false
              html5QrCodeRef.current = null
            } catch (e) {
              // Ignore cleanup errors
            }

            // Trích xuất mã từ kết quả quét và điền vào ô search
            const extractedCode = extractCodeFromResult(decodedText)
            setSearchTerm(extractedCode)
            setIsScanning(false)

            toast.success('Quét mã thành công!')
          },
          (errorMessage) => {
            // Ignore scanning errors (thường là lỗi không quét được trong quá trình scan)
            // Đây là lỗi bình thường khi scanner đang tìm mã, không cần xử lý
          }
        )

        if (isMounted && isScanning) {
          isScannerStartedRef.current = true
        }
      } catch (error) {
        console.error('Camera error:', error)
        isScannerStartedRef.current = false

        if (!isMounted) return

        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setCameraPermissionDenied(true)
          setIsScanning(false)
          toast.error('Quyền truy cập camera bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.')
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          setIsScanning(false)
          toast.error('Không tìm thấy camera. Vui lòng kiểm tra thiết bị của bạn.')
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          setIsScanning(false)
          toast.error('Camera đang được sử dụng bởi ứng dụng khác. Vui lòng thử lại.')
        } else {
          setIsScanning(false)
          toast.error('Không thể mở camera. Vui lòng thử lại.')
        }

        // Cleanup on error
        if (html5QrCode) {
          try {
            html5QrCode.clear()
          } catch (e) { }
          html5QrCodeRef.current = null
        }
      }
    }

    startScanning()

    return () => {
      isMounted = false

      // Cleanup khi component unmount hoặc isScanning thay đổi
      if (html5QrCodeRef.current) {
        const scanner = html5QrCodeRef.current
        isScannerStartedRef.current = false

        if (scanner) {
          scanner.stop().catch(() => { }).then(() => {
            try {
              scanner.clear()
            } catch (e) { }
            html5QrCodeRef.current = null
          }).catch(() => {
            try {
              scanner.clear()
            } catch (e) { }
            html5QrCodeRef.current = null
          })
        }
      }
    }
  }, [isScanning])

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  const handleClear = () => {
    setSearchTerm('')
    setIsScanning(false)
  }

  const handleProductClick = (product) => {
    navigate(`/products/${product.ID}`, {
      state: { from: '/scan' }
    })
  }

  const handleScanClick = async () => {
    setIsScanning(true)
    setCameraPermissionDenied(false)
  }

  const handleStopScan = () => {
    setIsScanning(false)
    // Cleanup sẽ được xử lý bởi useEffect
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Tạo một container tạm thời để scan file (không cần hiển thị)
      const tempDivId = 'temp-file-scanner'
      let tempDiv = document.getElementById(tempDivId)
      if (!tempDiv) {
        tempDiv = document.createElement('div')
        tempDiv.id = tempDivId
        tempDiv.style.position = 'fixed'
        tempDiv.style.top = '-9999px'
        tempDiv.style.left = '-9999px'
        document.body.appendChild(tempDiv)
      }

      const html5QrCode = new Html5Qrcode(tempDivId)

      // Sử dụng scanFile() là instance method, không phải static method
      const result = await html5QrCode.scanFile(file, true)

      // Cleanup container tạm thời
      try {
        html5QrCode.clear()
      } catch (clearError) {
        // Ignore cleanup errors
      } finally {
        // Xóa container tạm thời sau khi scan xong
        try {
          const tempDivToRemove = document.getElementById(tempDivId)
          if (tempDivToRemove && tempDivToRemove.parentNode) {
            tempDivToRemove.parentNode.removeChild(tempDivToRemove)
          }
        } catch (e) {
          // Ignore cleanup errors
        }
      }

      // Khi quét thành công: rung điện thoại
      if ('vibrate' in navigator) {
        navigator.vibrate(200)
      }

      // Trích xuất mã từ kết quả quét và điền vào ô search
      const extractedCode = extractCodeFromResult(result)
      setSearchTerm(extractedCode)
      toast.success('Quét mã thành công từ ảnh!')
    } catch (error) {
      console.error('Error scanning image:', error)
      toast.error('Không thể quét mã từ ảnh. Vui lòng thử lại với ảnh khác.')
    } finally {
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-md px-4 py-4 page-enter">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            Quét mã sản phẩm
          </h1>
          <p className="text-sm text-muted-foreground">
            Quét mã vạch hoặc tìm kiếm sản phẩm
          </p>
        </div>

        {/* Camera Permission Alert */}
        {cameraPermissionDenied && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Quyền truy cập camera bị từ chối</AlertTitle>
            <AlertDescription>
              Vui lòng cấp quyền truy cập camera trong cài đặt trình duyệt để sử dụng tính năng quét mã.
              <br />
              <strong>Hướng dẫn:</strong> Vào Cài đặt trình duyệt → Quyền → Camera → Cho phép
            </AlertDescription>
          </Alert>
        )}

        {/* Search Input */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Quét mã vạch hoặc nhập ID, tên, tên khác..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-10 h-12 text-base"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-accent transition-colors"
                    type="button"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={isScanning ? handleStopScan : handleScanClick}
                  variant={isScanning ? "destructive" : "default"}
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {isScanning ? 'Dừng quét' : 'Mở camera quét mã'}
                </Button>
                <Button
                  onClick={handleImageUpload}
                  variant="outline"
                  className="shrink-0 px-4"
                  disabled={isScanning}
                  title="Chọn ảnh từ máy"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Camera Scanner */}
        {isScanning && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="space-y-3">
                <p className="text-sm font-medium text-center">Đưa mã vạch vào khung quét</p>
                <div
                  id="qr-reader"
                  ref={scannerContainerRef}
                  className="w-full rounded-lg overflow-hidden bg-black/5 dark:bg-black/20"
                  style={{ minHeight: '300px' }}
                />
                <p className="text-xs text-center text-muted-foreground">
                  Quét mã QR hoặc mã vạch vào khung hình
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : debouncedSearchTerm.trim() && searchResults.length === 0 && !isSearching ? (
          <EmptyState
            icon={Search}
            title="Không tìm thấy sản phẩm"
            description={`Không tìm thấy sản phẩm nào với "${debouncedSearchTerm}". Thử tìm kiếm với từ khóa khác.`}
            actionLabel="Xóa bộ lọc"
            onAction={handleClear}
          />
        ) : debouncedSearchTerm.trim() && searchResults.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                Tìm thấy <span className="font-semibold text-foreground">{searchResults.length}</span> sản phẩm
                {searchResults.length >= 20 && (
                  <span className="ml-2 text-xs text-muted-foreground">(hiển thị 20 kết quả đầu tiên)</span>
                )}
              </p>
            </div>
            {searchResults.map(product => (
              <ProductCard
                key={product.ID}
                product={product}
                type="standalone"
                childrenCount={0}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        ) : (
          // Chưa tìm kiếm
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quét mã sản phẩm</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Nhập mã vạch, ID hoặc tên sản phẩm vào ô tìm kiếm phía trên, hoặc bấm nút "Mở camera quét mã" để quét mã vạch.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
