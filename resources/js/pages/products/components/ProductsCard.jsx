import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StarIcon } from "lucide-react"
import { Link } from "@inertiajs/react"

const ProductsCard = ({ product }) => {
  const { 
    id, 
    thumbnail, 
    product_title, 
    product_description, 
    price, 
    rating,
    brand,
    stock
  } = product;

  return (
    <Link className="w-full flex justify-center" href={`/products/${id}`}>
      <Card className="w-48">
        <CardContent className="p-1">
          <div className="aspect-square rounded-md bg-gray-100 mb-2 overflow-hidden">
            {thumbnail ? (
              <img 
                src={thumbnail} 
                alt={product_title || 'Product'} 
                className="w-full h-full object-cover mt-0"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                No Image
              </div>
            )}
          </div>
          
          {brand && (
            <p className="text-xs text-muted-foreground mb-1">{brand}</p>
          )}
          
          <CardTitle className="text-sm mb-1 line-clamp-2">
            {product_title || 'Untitled Product'}
          </CardTitle>
          
          <CardDescription className="text-xs mb-2 line-clamp-2">
            {product_description || 'No description available'}
          </CardDescription>
          
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex">
              {Array.from({ length: Math.floor(parseFloat(String(rating || 0))) }, (_, i) => (
                <StarIcon
                  key={i}
                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                />
              ))}
              {Array.from({ length: 5 - Math.floor(parseFloat(String(rating || 0))) }, (_, i) => (
                <StarIcon
                  key={`empty-${i}`}
                  className="h-3 w-3 text-gray-300"
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({rating ? parseFloat(String(rating)).toFixed(1) : '0.0'})
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">
              ${price ? parseFloat(String(price)).toFixed(2) : '0.00'}
            </span>
            <span className={`text-xs ${
              stock && stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stock && stock > 0 ? `${stock} left` : 'Out of stock'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default ProductsCard; 