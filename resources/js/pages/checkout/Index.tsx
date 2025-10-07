import { useState, useEffect } from "react"
import { Head, router } from "@inertiajs/react"
import { 
    ShoppingCart, 
    MapPin, 
    CreditCard, 
    CheckCircle, 
    Plus,
    Trash2,
    Edit
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/useCart"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Navebar from "@/components/Navebar"
import LayoutWithCart from "@/layouts/LayoutWithCart"

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    price: string | number; // Price comes as string from Laravel API
    product: {
        id: number;
        product_title: string;
        thumbnail: string;
    };
}

interface Address {
    id: number;
    first_name: string;
    last_name: string;
    company?: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
    email: string;
}

const CheckoutPage = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [addresses, setAddresses] = useState<Address[]>([])
    const [selectedAddress, setSelectedAddress] = useState<string>("")
    const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery")
    const [loading, setLoading] = useState(true)
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [processing, setProcessing] = useState(false)
    const { refreshCart } = useCart()

    // Helper function to safely convert price to number
    const getPrice = (price: string | number): number => {
        return typeof price === 'string' ? parseFloat(price) : price;
    }

    // Address form state
    const [addressForm, setAddressForm] = useState({
        first_name: "",
        last_name: "",
        company: "",
        address_1: "",
        address_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        phone: "",
        email: ""
    })

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cartResponse, addressResponse] = await Promise.all([
                    fetch('/api/cart'),
                    fetch('/api/addresses')
                ])
                
                // Check if responses are successful and contain JSON
                if (!cartResponse.ok || !addressResponse.ok) {
                    // If unauthorized, redirect to login
                    if (cartResponse.status === 401 || addressResponse.status === 401) {
                        window.location.href = '/login'
                        return
                    }
                    throw new Error('Failed to fetch data')
                }
                
                // Check if response is actually JSON
                const cartContentType = cartResponse.headers.get('content-type')
                const addressContentType = addressResponse.headers.get('content-type')
                
                if (!cartContentType?.includes('application/json') || !addressContentType?.includes('application/json')) {
                    throw new Error('Invalid response format')
                }
                
                const cartData = await cartResponse.json()
                const addressData = await addressResponse.json()
                
                setCartItems(cartData)
                setAddresses(addressData)
                
                if (addressData.length > 0) {
                    setSelectedAddress(addressData[0].id.toString())
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (getPrice(item.price) * item.quantity), 0)
    const tax = 0
    const total = subtotal + tax

    // Handle address form submission
    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            const response = await fetch('/api/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(addressForm)
            })

            if (response.ok) {
                const newAddress = await response.json()
                setAddresses([...addresses, newAddress.address])
                setSelectedAddress(newAddress.address.id.toString())
                setShowAddressForm(false)
                setAddressForm({
                    first_name: "",
                    last_name: "",
                    company: "",
                    address_1: "",
                    address_2: "",
                    city: "",
                    state: "",
                    postal_code: "",
                    country: "",
                    phone: "",
                    email: ""
                })
            }
        } catch (error) {
            console.error('Error saving address:', error)
        }
    }

    // Handle order submission
    const handleOrderSubmit = async () => {
        setProcessing(true)
        
        const selectedAddressData = addresses.find(addr => addr.id.toString() === selectedAddress)
        if (!selectedAddressData) return

        const fullAddress = `${selectedAddressData.address_1}, ${selectedAddressData.city}, ${selectedAddressData.state} ${selectedAddressData.postal_code}, ${selectedAddressData.country}`

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    shipping_address: fullAddress,
                    billing_address: fullAddress,
                    payment_method: paymentMethod,
                    notes: ""
                })
            })

            if (response.ok) {
                const orderData = await response.json()
                // Refresh cart count since order completion should clear cart
                await refreshCart()
                router.visit('/orders', { 
                    onSuccess: () => {
                        // Show success message or redirect
                    }
                })
            }
        } catch (error) {
            console.error('Error creating order:', error)
        } finally {
            setProcessing(false)
        }
    }

    const steps = [
        { number: 1, title: "Cart", icon: ShoppingCart },
        { number: 2, title: "Billing & Address", icon: MapPin },
        { number: 3, title: "Payment", icon: CreditCard }
    ]

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

    return (
        <LayoutWithCart>
            <Navebar />
            <Head title="Checkout" />
            <div className="container mx-auto px-4 py-8">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                currentStep >= step.number 
                                    ? 'bg-primary border-primary text-primary-foreground' 
                                    : 'border-gray-300 text-gray-400'
                            }`}>
                                {currentStep > step.number ? (
                                    <CheckCircle className="w-6 h-6" />
                                ) : (
                                    <step.icon className="w-5 h-5" />
                                )}
                            </div>
                            <span className={`ml-2 font-medium ${
                                currentStep >= step.number ? 'text-primary' : 'text-gray-400'
                            }`}>
                                {step.title}
                            </span>
                            {index < steps.length - 1 && (
                                <div className={`w-16 h-0.5 mx-4 ${
                                    currentStep > step.number ? 'bg-primary' : 'bg-gray-300'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Step 1: Cart Review */}
                        {currentStep === 1 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Review Your Cart</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                            <img
                                                src={item.product.thumbnail}
                                                alt={item.product.product_title}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-semibold">{item.product.product_title}</h4>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">${(getPrice(item.price) * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <Button 
                                        className="w-full mt-6" 
                                        onClick={() => setCurrentStep(2)}
                                    >
                                        Continue to Billing & Address
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 2: Billing & Address */}
                        {currentStep === 2 && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Billing & Address</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowAddressForm(true)}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add New Address
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {showAddressForm ? (
                                        <form onSubmit={handleAddressSubmit} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="first_name">First Name</Label>
                                                    <Input
                                                        id="first_name"
                                                        value={addressForm.first_name}
                                                        onChange={(e) => setAddressForm({...addressForm, first_name: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="last_name">Last Name</Label>
                                                    <Input
                                                        id="last_name"
                                                        value={addressForm.last_name}
                                                        onChange={(e) => setAddressForm({...addressForm, last_name: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="address_1">Address</Label>
                                                <Input
                                                    id="address_1"
                                                    value={addressForm.address_1}
                                                    onChange={(e) => setAddressForm({...addressForm, address_1: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="city">City</Label>
                                                    <Input
                                                        id="city"
                                                        value={addressForm.city}
                                                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="state">State</Label>
                                                    <Input
                                                        id="state"
                                                        value={addressForm.state}
                                                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="postal_code">Postal Code</Label>
                                                    <Input
                                                        id="postal_code"
                                                        value={addressForm.postal_code}
                                                        onChange={(e) => setAddressForm({...addressForm, postal_code: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="country">Country</Label>
                                                <Input
                                                    id="country"
                                                    value={addressForm.country}
                                                    onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={addressForm.email}
                                                    onChange={(e) => setAddressForm({...addressForm, email: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button type="submit">Save Address</Button>
                                                <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-4">
                                            <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                                                {addresses.map((address) => (
                                                    <div key={address.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                                                        <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} />
                                                        <Label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                                                            <div>
                                                                <p className="font-semibold">{address.first_name} {address.last_name}</p>
                                                                <p className="text-sm text-gray-600">
                                                                    {address.address_1}, {address.city}, {address.state} {address.postal_code}
                                                                </p>
                                                                <p className="text-sm text-gray-600">{address.country}</p>
                                                            </div>
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                            <div className="flex gap-2">
                                                <Button onClick={() => setCurrentStep(1)} variant="outline">
                                                    Back
                                                </Button>
                                                <Button 
                                                    onClick={() => setCurrentStep(3)}
                                                    disabled={!selectedAddress}
                                                >
                                                    Continue to Payment
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 3: Payment */}
                        {currentStep === 3 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Method</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                            <RadioGroupItem value="stripe" id="stripe" />
                                            <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                                                <div>
                                                    <p className="font-semibold">Credit or Debit Card</p>
                                                    <p className="text-sm text-gray-600">Pay securely with Stripe (Coming Soon)</p>
                                                </div>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                            <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                                            <Label htmlFor="cash_on_delivery" className="flex-1 cursor-pointer">
                                                <div>
                                                    <p className="font-semibold">Cash on Delivery</p>
                                                    <p className="text-sm text-gray-600">Pay when your order is delivered</p>
                                                </div>
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                    {paymentMethod === "stripe" && (
                                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                            <p className="text-sm text-gray-600 text-center">
                                                Stripe payment integration coming soon!
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-2 mt-6">
                                        <Button onClick={() => setCurrentStep(2)} variant="outline">
                                            Back
                                        </Button>
                                        <Button 
                                            onClick={handleOrderSubmit}
                                            disabled={processing || (paymentMethod === "stripe")}
                                            className="flex-1"
                                        >
                                            {processing ? "Processing..." : "Place Order"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
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
                                    <span>Vat 0%:</span>
                                    <span className="font-semibold">
                                        {tax > 0 ? `$${tax.toFixed(2)}` : '-'}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span>Sub total:</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                
                                <Separator />
                                
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                {currentStep === 3 && (
                                    <div className="pt-4">
                                        <Input
                                            placeholder="Email"
                                            type="email"
                                            className="mb-4"
                                        />
                                        <Button className="w-full">
                                            Apply
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </LayoutWithCart>
    )
}

export default CheckoutPage