import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    price: string | number;
    product: {
        id: number;
        product_title: string;
        thumbnail: string;
        stock: number;
    };
}

interface CartContextType {
    cartCount: number;
    cartItems: CartItem[];
    refreshCart: () => Promise<void>;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
    children: ReactNode;
    isAuthenticated: boolean;
}

export function CartProvider({ children, isAuthenticated }: CartProviderProps) {
    const [cartCount, setCartCount] = useState(0)
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const refreshCart = async () => {
        // Only fetch cart if user is authenticated
        if (!isAuthenticated) {
            setCartCount(0)
            setCartItems([])
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/cart')
            
            if (!response.ok) {
                throw new Error('Failed to fetch cart data')
            }
            
            const data: CartItem[] = await response.json()
            setCartItems(data)
            
            // Calculate total quantity
            const totalCount = data.reduce((sum, item) => sum + item.quantity, 0)
            setCartCount(totalCount)
        } catch (error) {
            console.error('Error fetching cart:', error)
            setCartCount(0)
            setCartItems([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        refreshCart()
    }, [isAuthenticated]) // Refresh when authentication status changes

    return (
        <CartContext.Provider value={{ cartCount, cartItems, refreshCart, isLoading }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        // Return a default context when not within provider (for SSR or initial render)
        return {
            cartCount: 0,
            cartItems: [],
            refreshCart: async () => {},
            isLoading: false
        }
    }
    return context
}