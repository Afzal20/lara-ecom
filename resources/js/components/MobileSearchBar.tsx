import { useState, useEffect, useRef } from 'react'
import { SearchIcon } from 'lucide-react'
import { router } from '@inertiajs/react'

interface MobileSearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export default function MobileSearchBar({ 
  placeholder = "Search products...", 
  onSearch 
}: MobileSearchBarProps) {
  const [isActive, setIsActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const initialViewportHeight = useRef<number>(0)

  useEffect(() => {
    // Store initial viewport height
    initialViewportHeight.current = window.innerHeight

    const handleResize = () => {
      const currentHeight = window.innerHeight
      const heightDifference = initialViewportHeight.current - currentHeight
      
      // If height decreased significantly (likely keyboard opened)
      if (heightDifference > 150 && document.activeElement === inputRef.current) {
        setIsKeyboardOpen(true)
        if (containerRef.current) {
          containerRef.current.style.position = 'absolute'
          containerRef.current.style.bottom = '0px'
        }
      } else {
        setIsKeyboardOpen(false)
        if (containerRef.current) {
          containerRef.current.style.position = 'fixed'
          containerRef.current.style.bottom = '0px'
        }
      }
    }

    const handleFocus = () => {
      setIsActive(true)
      // Small delay to ensure keyboard detection works
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }
      }, 100)
    }

    const handleBlur = () => {
      setIsActive(false)
      setIsKeyboardOpen(false)
      if (containerRef.current) {
        containerRef.current.style.position = 'fixed'
      }
    }

    const handleSubmit = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && document.activeElement === inputRef.current) {
        e.preventDefault()
        handleSearch()
      }
    }

    // Add event listeners
    window.addEventListener('resize', handleResize)
    document.addEventListener('keydown', handleSubmit)
    
    if (inputRef.current) {
      inputRef.current.addEventListener('focus', handleFocus)
      inputRef.current.addEventListener('blur', handleBlur)
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keydown', handleSubmit)
      
      if (inputRef.current) {
        inputRef.current.removeEventListener('focus', handleFocus)
        inputRef.current.removeEventListener('blur', handleBlur)
      }
    }
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim())
      } else {
        // Default behavior - navigate to products page with search
        router.get('/products', { search: searchQuery.trim() })
      }
      
      // Clear search and blur input
      setSearchQuery('')
      if (inputRef.current) {
        inputRef.current.blur()
      }
    }
  }

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      handleSearch()
    } else {
      // Focus input if empty
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  return (
    <>
      {/* Bottom padding to prevent content from being hidden behind search bar */}
      <div className="h-20 md:hidden" />
      
      {/* Mobile Search Bar */}
      <div 
        ref={containerRef}
        className={`
          fixed bottom-0 left-0 right-0 z-50 
          bg-background/95 backdrop-blur-md border-t
          p-3 pb-safe transition-all duration-200 ease-in-out
          md:hidden
          ${isActive ? 'shadow-lg border-primary/20' : 'shadow-md'}
        `}
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className={`
                w-full px-4 py-3 pr-12 
                text-base rounded-full 
                border-2 transition-all duration-200
                focus:outline-none focus:ring-0
                placeholder:text-muted-foreground/60
                ${isActive 
                  ? 'border-primary bg-background shadow-sm' 
                  : 'border-border bg-muted/50'
                }
              `}
              // Prevent zoom on iOS Safari
              style={{ fontSize: '16px' }}
            />
            
            {/* Search Icon/Button */}
            <button
              onClick={handleSearchClick}
              className={`
                absolute right-2 top-1/2 -translate-y-1/2
                p-2 rounded-full transition-all duration-200
                min-h-[44px] min-w-[44px] flex items-center justify-center
                ${searchQuery.trim() 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 scale-100' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
              aria-label={searchQuery.trim() ? 'Search' : 'Focus search'}
            >
              <SearchIcon size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Cancel Button (when active) */}
          {isActive && (
            <button
              onClick={() => {
                setSearchQuery('')
                if (inputRef.current) {
                  inputRef.current.blur()
                }
              }}
              className="
                text-sm font-medium text-muted-foreground 
                hover:text-foreground px-3 py-2 
                transition-colors duration-200
                min-h-[44px] flex items-center
              "
              aria-label="Cancel search"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </>
  )
}
