import { ChevronDownIcon, User } from "lucide-react"
import { usePage } from "@inertiajs/react"
import type { SharedData } from "@/types"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function Profilebtn() {
  const { auth } = usePage<SharedData>().props
  
  // Get user initials for fallback
  const getInitials = (name?: string) => {
    if (!name) return "U"
    const names = name.split(" ")
    return names.length > 1 
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase()
  }

  const user = auth.user as { name?: string; profile_photo_url?: string } | undefined

  return (
    <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
      <Avatar className="h-8 w-8">
        <AvatarImage 
          src={user?.profile_photo_url} 
          alt={user?.name || "User"} 
        />
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          {getInitials(user?.name)}
        </AvatarFallback>
      </Avatar>
      <ChevronDownIcon size={16} className="ml-1 opacity-60" aria-hidden="true" />
    </Button>
  )
}
