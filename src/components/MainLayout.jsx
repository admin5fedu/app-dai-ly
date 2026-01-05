import Header from './Header'
import BottomNav from './BottomNav'

/**
 * MainLayout Component
 * - Mobile-first layout với flex structure
 * - Safe area support cho iPhone có notch
 * - Fixed header và footer
 * - Proper padding để nội dung không bị đè
 */
export function MainLayout({ children, showHeader = true, showBottomNav = true }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Sticky Header */}
      {showHeader && (
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <Header />
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full pb-40 supports-[padding:max(0px)]:pb-[max(160px,calc(80px+env(safe-area-inset-bottom)+80px))]">
        {children}
      </main>

      {/* Fixed Bottom Navigation */}
      {showBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom">
          <BottomNav />
        </div>
      )}
    </div>
  )
}

