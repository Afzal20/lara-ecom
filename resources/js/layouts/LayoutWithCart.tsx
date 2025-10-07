import { ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import type { SharedData } from '@/types'
import { CartProvider } from '@/hooks/useCart'

interface LayoutWithCartProps {
    children: ReactNode;
}

export default function LayoutWithCart({ children }: LayoutWithCartProps) {
    const { auth } = usePage<SharedData>().props
    
    return (
        <CartProvider isAuthenticated={!!auth.user}>
            {children}
        </CartProvider>
    )
}