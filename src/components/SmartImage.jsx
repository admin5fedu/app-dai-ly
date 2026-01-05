import { useState, useEffect, useRef } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * SmartImage Component
 * - Lazy loading với Intersection Observer
 * - Skeleton loading state
 * - Fallback khi lỗi
 * - Optimized cho mobile
 */
export function SmartImage({ 
  src, 
  alt, 
  className = '',
  containerClassName = '',
  skeletonClassName = '',
  fallbackIcon: FallbackIcon = Package,
  fallbackIconSize = 32
}) {
  const [imageState, setImageState] = useState('loading') // 'loading' | 'loaded' | 'error'
  const [shouldLoad, setShouldLoad] = useState(false)
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  useEffect(() => {
    // Nếu không có src, set error ngay
    if (!src || !src.trim()) {
      setImageState('error')
      return
    }

    // Reset state khi src thay đổi
    setImageState('loading')
    setShouldLoad(false)

    // Nếu browser không support Intersection Observer, load ngay
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }

    // Setup Intersection Observer cho lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before visible
        threshold: 0.01
      }
    )

    observerRef.current = observer

    const currentImgRef = imgRef.current
    if (currentImgRef) {
      observer.observe(currentImgRef)
    }

    return () => {
      if (observer && currentImgRef) {
        observer.unobserve(currentImgRef)
      }
      if (observer) {
        observer.disconnect()
      }
    }
  }, [src])

  const handleLoad = () => {
    setImageState('loaded')
  }

  const handleError = () => {
    setImageState('error')
  }

  return (
    <div 
      ref={imgRef}
      className={cn(
        'w-full h-full flex items-center justify-center overflow-hidden',
        containerClassName
      )}
    >
      {imageState === 'loading' && (
        <Skeleton className={cn('w-full h-full', skeletonClassName)} />
      )}
      
      {shouldLoad && imageState !== 'error' && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-200',
            imageState === 'loaded' ? 'opacity-100' : 'opacity-0',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      )}
      
      {imageState === 'error' && (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <FallbackIcon 
            className={cn('text-muted-foreground/50', `w-${fallbackIconSize} h-${fallbackIconSize}`)}
            style={{ width: `${fallbackIconSize}px`, height: `${fallbackIconSize}px` }}
          />
        </div>
      )}
    </div>
  )
}

