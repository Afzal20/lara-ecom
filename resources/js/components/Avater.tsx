import {
  LogOutIcon,
  ShoppingCartIcon,
  UserIcon,
  SettingsIcon,
  PackageIcon,
} from "lucide-react"
import { Link, usePage, router } from "@inertiajs/react"
import type { SharedData } from "@/types"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ThemeSwitch from "./themeSwitch"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/useCart"


export default function Avater() {
  const { auth } = usePage<SharedData>().props
  const { cartCount } = useCart()

  const handleLogout = () => {
    router.post('/logout')
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (!auth.user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={auth.user.avatar || ''} alt={`${auth.user.name}'s avatar`} />
            <AvatarFallback className="text-xs">
              {getUserInitials(auth.user.name)}
            </AvatarFallback>
          </Avatar>
          {/* Cart count badge - only show if there are items */}
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full border-2 border-background bg-destructive text-foreground text-xs flex items-center justify-center p-0">
              {cartCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {auth.user.name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {auth.user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Theme Switch */}
        <div className="px-2 py-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm">Theme</span>
            <ThemeSwitch />
          </div>
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          {/* Cart */}
          <DropdownMenuItem asChild>
            <Link href="/cart" className="cursor-pointer">
              <ShoppingCartIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Cart</span>
              {cartCount > 0 && (
                <Badge variant="secondary" className="ml-auto h-5 w-5 rounded-full text-xs">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </DropdownMenuItem>
          
          {/* Orders */}
          <DropdownMenuItem asChild>
            <Link href="/orders" className="cursor-pointer">
              <PackageIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Orders</span>
            </Link>
          </DropdownMenuItem>
          
          {/* Profile/Settings */}
          <DropdownMenuItem asChild>
            <Link href="/settings/profile" className="cursor-pointer">
              <UserIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Logout */}
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
