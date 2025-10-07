

import { useState } from "react"
import { Head, Link, usePage, router } from "@inertiajs/react"
import { ChevronLeft, ChevronRight, Edit, Trash2, ShoppingCart, Heart, StarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Navebar from "@/components/Navebar"

interface Product {
    id: number;
    product_title?: string;
    product_description?: string;
    price?: number | string;
    discount_percentage?: number | string;
    rating?: number | string;
    stock?: number;
    brand?: string;
    category?: string;
    thumbnail?: string;
    images?: string[];
    tags?: string[];
    sku?: string;
    weight?: string;
    dimensions?: {
        width: string;
        height: string;
        depth: string;
    };
    warranty_information?: string;
    shipping_information?: string;
    availability_status?: string;
    return_policy?: string;
    minimum_order_quantity?: number;
    reviews?: {
        rating: number;
        comment: string;
        date: string;
        reviewerName: string;
        reviewerEmail: string;
    }[];
    meta?: {
        createdAt: string;
        updatedAt: string;
        barcode: string;
        qrCode: string;
    };
}

interface ProductsDetailsProps {
    product: Product;
}

function ProductsDetails({ product }: ProductsDetailsProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [cartMessage, setCartMessage] = useState('')

    // Handle image navigation
    const nextImage = () => {
        if (product.images && product.images.length > 1) {
            setCurrentImageIndex((prev) => 
                prev === product.images!.length - 1 ? 0 : prev + 1
            )
        }
    }

    const previousImage = () => {
        if (product.images && product.images.length > 1) {
            setCurrentImageIndex((prev) => 
                prev === 0 ? product.images!.length - 1 : prev - 1
            )
        }
    }

    // Format currency
    const formatCurrency = (amount: number | string) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(numAmount || 0)
    }

    // Calculate discounted price
    const calculateDiscountedPrice = () => {
        const basePrice = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0)
        const discountPercent = typeof product.discount_percentage === 'string' 
            ? parseFloat(product.discount_percentage) 
            : (product.discount_percentage || 0)
        
        if (discountPercent > 0) {
            return basePrice * (1 - discountPercent / 100)
        }
        return basePrice
    }

    // Get all available images (thumbnail + additional images)
    const getAllImages = () => {
        const allImages = []
        if (product.thumbnail) {
            allImages.push(product.thumbnail)
        }
        if (product.images && product.images.length > 0) {
            allImages.push(...product.images)
        }
        return allImages.length > 0 ? allImages : ['/placeholder-image.jpg']
    }

    const allImages = getAllImages()
    const discountedPrice = calculateDiscountedPrice()
    const originalPrice = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0)
    const rating = typeof product.rating === 'string' ? parseFloat(product.rating) : (product.rating || 0)

    // Add to cart functionality
    const addToCart = async () => {
        if (product.stock === 0) {
            setCartMessage('Product is out of stock')
            return
        }

        setIsAddingToCart(true)
        setCartMessage('')

        try {
            // Simulate API call - replace with actual implementation
            await new Promise(resolve => setTimeout(resolve, 1000))
            setCartMessage('Product added to cart successfully!')
            setTimeout(() => setCartMessage(''), 3000)
        } catch (error) {
            console.error('Error adding to cart:', error)
            setCartMessage('An error occurred. Please try again.')
        } finally {
            setIsAddingToCart(false)
        }
    }

    return (
        <>
            <Navebar />
            <Head title={product.product_title || 'Product Details'} />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <Link 
                        href="/" 
                        className="text-muted-foreground hover:text-foreground mb-4 inline-block"
                    >
                        ← Back to Products
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">
                        {product.product_title || 'Untitled Product'}
                    </h1>
                    {product.brand && (
                        <p className="text-muted-foreground">by {product.brand}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={allImages[currentImageIndex]}
                                alt={product.product_title || 'Product image'}
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Navigation Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                                        onClick={previousImage}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                                        onClick={nextImage}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {allImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                                            index === currentImageIndex 
                                                ? 'border-primary' 
                                                : 'border-transparent hover:border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.product_title} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="space-y-6">
                        {/* Price and Rating */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="text-4xl font-bold text-primary">
                                    {formatCurrency(discountedPrice)}
                                </div>
                                {product.discount_percentage && parseFloat(String(product.discount_percentage)) > 0 && (
                                    <>
                                        <div className="text-lg text-muted-foreground line-through">
                                            {formatCurrency(originalPrice)}
                                        </div>
                                        <Badge variant="destructive" className="text-sm">
                                            -{product.discount_percentage}% OFF
                                        </Badge>
                                    </>
                                )}
                            </div>
                            
                            {/* Rating */}
                            {rating > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {Array.from({ length: Math.floor(rating) }, (_, i) => (
                                            <StarIcon key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                        {Array.from({ length: 5 - Math.floor(rating) }, (_, i) => (
                                            <StarIcon key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        ({rating.toFixed(1)} rating)
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            <Badge variant={product.stock && product.stock > 0 ? "default" : "destructive"}>
                                {product.availability_status || 
                                 (product.stock && product.stock > 0 ? `${product.stock} in stock` : 'Out of stock')}
                            </Badge>
                            {product.minimum_order_quantity && product.minimum_order_quantity > 1 && (
                                <Badge variant="outline" className="text-xs">
                                    Min. order: {product.minimum_order_quantity}
                                </Badge>
                            )}
                        </div>

                        {/* Description */}
                        {product.product_description && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">About this product</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {product.product_description}
                                </p>
                            </div>
                        )}

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Separator />

                        {/* Product Specifications */}
                        <div className="space-y-2 text-sm">
                            <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {product.sku && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">SKU</span>
                                        <span className="font-medium">{product.sku}</span>
                                    </div>
                                )}
                                {product.brand && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Brand</span>
                                        <span className="font-medium">{product.brand}</span>
                                    </div>
                                )}
                                {product.category && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Category</span>
                                        <span className="font-medium">{product.category}</span>
                                    </div>
                                )}
                                {product.weight && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Weight</span>
                                        <span className="font-medium">{product.weight}</span>
                                    </div>
                                )}
                                {product.dimensions && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Dimensions</span>
                                        <span className="font-medium">
                                            {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Information */}
                        {(product.warranty_information || product.shipping_information || product.return_policy) && (
                            <>
                                <Separator />
                                <div className="space-y-2 text-sm">
                                    <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
                                    {product.warranty_information && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Warranty</span>
                                            <span className="font-medium">{product.warranty_information}</span>
                                        </div>
                                    )}
                                    {product.shipping_information && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span className="font-medium">{product.shipping_information}</span>
                                        </div>
                                    )}
                                    {product.return_policy && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Returns</span>
                                            <span className="font-medium">{product.return_policy}</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <Separator />

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {/* Cart message */}
                            {cartMessage && (
                                <div className={`p-3 rounded-lg text-sm ${
                                    cartMessage.includes('success') || cartMessage.includes('added') 
                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                        : 'bg-red-100 text-red-800 border border-red-200'
                                }`}>
                                    {cartMessage}
                                </div>
                            )}
                            
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium">Quantity:</span>
                                <div className="flex items-center border rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-1 hover:bg-gray-100 rounded-l-lg"
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-1 border-x">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock || 0, quantity + 1))}
                                        className="px-3 py-1 hover:bg-gray-100 rounded-r-lg"
                                        disabled={quantity >= (product.stock || 0)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart and Wishlist */}
                            <div className="flex gap-3">
                                <Button 
                                    className="flex-1" 
                                    size="lg"
                                    disabled={!product.stock || product.stock === 0 || isAddingToCart}
                                    onClick={addToCart}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    {isAddingToCart ? 'Adding...' : 
                                     (!product.stock || product.stock === 0) ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                                <Button variant="outline" size="lg">
                                    <Heart className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                {product.reviews && product.reviews.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
                        <div className="space-y-4">
                            {product.reviews.map((review, index) => (
                                <Card key={index}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-semibold">{review.reviewerName}</h4>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
                                                        <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                    {Array.from({ length: 5 - Math.floor(review.rating) }, (_, i) => (
                                                        <StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-sm text-muted-foreground">{review.date}</span>
                                        </div>
                                        <p className="text-muted-foreground">{review.comment}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default ProductsDetails