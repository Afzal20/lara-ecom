import ProductsCard from "./components/ProductsCard"
import { Head } from "@inertiajs/react"
import NaNvbar from "@/components/Navebar"

interface Product {
  id: number;
  thumbnail?: string;
  product_title?: string;
  product_description?: string;
  price?: number | string;
  rating?: number | string;
  brand?: string;
  stock?: number;
}

interface IndexProps {
  products?: Product[];
}

// Assuming `products` is passed as a prop or fetched from a data source
const Index = ({ products = [] }: IndexProps) => {
  return (
    <>
      <NaNvbar />
      <Head title="Products" />
      <div className="container mx-auto px-4 py-8">        
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {products.map((product) => (
              <ProductsCard  
                key={product.id} 
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No products found</div>
            <p className="text-gray-400 mt-2">Try refreshing the page or check back later.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default Index