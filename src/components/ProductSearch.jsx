import { Input } from '@/components/ui/input'
import { Search, X, Loader2 } from 'lucide-react'
import { debounce } from '@/lib/utils/debounce'
import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ProductSearch({ searchValue, setSearchValue, onSearch, isSearching = false }) {
  const [isDebouncing, setIsDebouncing] = useState(false)
  const debouncedSearchRef = useRef(
    debounce((value) => {
      onSearch(value)
      setIsDebouncing(false)
    }, 300)
  )
  
  useEffect(() => {
    if (searchValue.trim()) {
      setIsDebouncing(true)
      debouncedSearchRef.current(searchValue)
    } else {
      setIsDebouncing(false)
      onSearch('')
    }
  }, [searchValue])
  
  const showLoading = isDebouncing || isSearching
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <Input
        placeholder="Tìm kiếm theo tên, mã sản phẩm, mã vạch..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className={cn("pl-10 pr-10 h-11", showLoading && "pr-16")}
      />
      {showLoading && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2">
          <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
        </div>
      )}
      {searchValue && !showLoading && (
        <button
          onClick={() => {
            setSearchValue('')
            onSearch('')
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-accent transition-colors"
          type="button"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}
