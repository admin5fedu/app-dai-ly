import { useState, useEffect, useRef } from 'react'

export function usePullToRefresh({ onRefresh, threshold = 80, disabled = false }) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const containerRef = useRef(null)

  useEffect(() => {
    if (disabled) return

    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e) => {
      if (window.scrollY !== 0) return
      startY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      if (startY.current === 0) return
      
      const currentY = e.touches[0].clientY
      const distance = currentY - startY.current

      if (distance > 0 && window.scrollY === 0) {
        e.preventDefault()
        setPullDistance(distance)
        setIsPulling(distance > 20)
      }
    }

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold && onRefresh) {
        await onRefresh()
      }
      setIsPulling(false)
      setPullDistance(0)
      startY.current = 0
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onRefresh, threshold, disabled, pullDistance])

  const progress = Math.min(pullDistance / threshold, 1)

  return {
    containerRef,
    isPulling,
    progress,
    shouldRefresh: pullDistance >= threshold,
    pullDistance,
  }
}
