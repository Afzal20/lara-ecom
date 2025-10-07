import { useState, useEffect } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Navebar from "@/components/Navebar"

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    price: string | number; // Price comes as string from Laravel API
    product: {
        id: number;
        product_title: string;
        thumbnail: string;
        stock: number;
    };
}

const CartIndex = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<number | null>(null)

    // Helper function to safely convert price to number
    const getPrice = (price: string | number): number => {
        return typeof price === 'string' ? parseFloat(price) : price;
    }

    // Fetch cart items
    const fetchCartItems = async () => {
        try {
            const response = await fetch('/api/cart')

            if (!response.ok) {
                // If unauthorized, redirect to login
                if (response.status === 401) {
                    window.location.href = '/login'
                    return
                }
                throw new Error('Failed to fetch cart data')
            }

            // Check if response is actually JSON
            const contentType = response.headers.get('content-type')
            if (!contentType?.includes('application/json')) {
                throw new Error('Invalid response format')
            }

            const data = await response.json()
            setCartItems(data)
        } catch (error) {
            console.error('Error fetching cart:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCartItems()
    }, [])

    // Update quantity
    const updateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return

        setUpdating(itemId)
        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ quantity: newQuantity })
            })

            if (response.ok) {
                setCartItems(items =>
                    items.map(item =>
                        item.id === itemId ? { ...item, quantity: newQuantity } : item
                    )
                )
            }
        } catch (error) {
            console.error('Error updating quantity:', error)
        } finally {
            setUpdating(null)
        }
    }

    // Remove item
    const removeItem = async (itemId: number) => {
        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                }
            })

            if (response.ok) {
                setCartItems(items => items.filter(item => item.id !== itemId))
            }
        } catch (error) {
            console.error('Error removing item:', error)
        }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (getPrice(item.price) * item.quantity), 0)
    const tax = 0 // No tax for now
    const total = subtotal + tax

    if (loading) {
        return (
            <>
                <Navebar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">Loading...</div>
                </div>
            </>
        )
    }

    if (cartItems.length === 0) {
        return (
            <>
                <Navebar />
                <Head title="Shopping Cart" />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                        <Button asChild>
                            <Link href="/">Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Navebar />
            <Head title="Shopping Cart" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.product.thumbnail}
                                                alt={item.product.product_title}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-1">
                                                {item.product.product_title}
                                            </h3>
                                            <p className="text-2xl font-bold text-primary">
                                                ${getPrice(item.price).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1 || updating === item.id}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-12 text-center font-semibold">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.product.stock || updating === item.id}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Total for this item */}
                                        <div className="text-right">
                                            <p className="text-lg font-bold">
                                                ${(getPrice(item.price) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Remove Button */}
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Tax:</span>
                                    <span className="font-semibold">
                                        {tax > 0 ? `$${tax.toFixed(2)}` : '-'}
                                    </span>
                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <Button
                                    className="w-full"
                                    size="lg"
                                    asChild
                                >
                                    <Link href="/checkout">
                                        Proceed to Checkout
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    asChild
                                >
                                    <Link href="/">Continue Shopping</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartIndex