import { useId } from "react"
import { SearchIcon, ShoppingCart, Menu } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import type { SharedData } from "@/types"

import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Avater from "./Avater"

// Navigation links configuration
const navigationLinks = [

] as const

export default function Navebar() {
  const id = useId()
  const { auth } = usePage<SharedData>().props

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="text-primary hover:text-primary/90 transition-colors">
          <Logo />
        </Link>

        {/* Search */}
        <div className="relative hidden md:block flex-1 max-w-md">
          <Input
            id={id}
            className="peer h-9 ps-9 pe-3"
            placeholder="Search products..."
            type="search"
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <SearchIcon size={16} strokeWidth={2} aria-hidden="true" />
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {auth.user ? (
            <>
              <Avater />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          {auth.user ? (
            <>
              <Avater />
            </>
          ) : (
            <>
              <Button asChild size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
    
    {/* Spacer div to prevent content from being hidden behind fixed navbar */}
    <div className="h-20"></div>
  </>
  )
}
