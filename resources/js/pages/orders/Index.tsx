import { useState, useEffect } from "react"
import { Head } from "@inertiajs/react"
import { Package, Clock, CheckCircle, Truck } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navebar from "@/components/Navebar"

interface Order {
    id: number;
    status: string;
    total_amount: string | number; // Amount comes as string from Laravel API
    created_at: string;
    items: {
        id: number;
        quantity: number;
        price: string | number; // Price comes as string from Laravel API
        product: {
            product_title: string;
            thumbnail: string;
        };
    }[];
}

const OrdersIndex = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    // Helper function to safely convert price to number
    const getPrice = (price: string | number): number => {
        return typeof price === 'string' ? parseFloat(price) : price;
    }

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders')
                
                if (!response.ok) {
                    // If unauthorized, redirect to login
                    if (response.status === 401) {
                        window.location.href = '/login'
                        return
                    }
                    throw new Error('Failed to fetch orders')
                }
                
                // Check if response is actually JSON
                const contentType = response.headers.get('content-type')
                if (!contentType?.includes('application/json')) {
                    throw new Error('Invalid response format')
                }
                
                const data = await response.json()
                setOrders(data)
            } catch (error) {
                console.error('Error fetching orders:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4" />
            case 'processing':
                return <Package className="h-4 w-4" />
            case 'shipped':
                return <Truck className="h-4 w-4" />
            case 'delivered':
                return <CheckCircle className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'pending':
                return 'secondary'
            case 'processing':
                return 'default'
            case 'shipped':
                return 'default'
            case 'delivered':
                return 'default'
            default:
                return 'secondary'
        }
    }

    if (loading) {
        return (
            <>
                <Navebar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">Loading orders...</div>
                </div>
            </>
        )
    }

    return (
        <>
            <Navebar />
            <Head title="My Orders" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>
                
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
                        <p className="text-gray-600">When you place orders, they will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <Card key={order.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            Order #{order.id}
                                            <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                                                {getStatusIcon(order.status)}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Badge>
                                        </CardTitle>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">${getPrice(order.total_amount).toFixed(2)}</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                                <img
                                                    src={item.product.thumbnail}
                                                    alt={item.product.product_title}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-sm">{item.product.product_title}</h4>
                                                    <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">${(getPrice(item.price) * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default OrdersIndex