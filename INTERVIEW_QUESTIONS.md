# Laravel E-Commerce Project - Interview Questions & Answers

## Table of Contents
1. [Laravel Framework Questions](#laravel-framework-questions)
2. [Project Architecture Questions](#project-architecture-questions)
3. [Database Design Questions](#database-design-questions)
4. [Frontend & React Questions](#frontend--react-questions)
5. [Security Questions](#security-questions)
6. [Performance Questions](#performance-questions)
7. [Testing Questions](#testing-questions)
8. [DevOps & Deployment Questions](#devops--deployment-questions)
9. [E-commerce Specific Questions](#e-commerce-specific-questions)
10. [Code Quality Questions](#code-quality-questions)

---

## Laravel Framework Questions

### Q1: What version of Laravel is used in this project and what are its key features?

**Answer:**
This project uses Laravel 12, which includes:
- PHP 8.2+ requirement
- Enhanced performance and security features
- Improved Eloquent ORM capabilities
- Better testing support with built-in Pest integration
- Advanced routing with Laravel Wayfinder
- Enhanced middleware handling
- Improved queue system
- Better caching mechanisms

Key benefits of Laravel 12:
- Better type safety with PHP 8.2 features
- Improved developer experience
- Enhanced security features
- Better performance optimizations

### Q2: Explain the project structure and how it follows Laravel conventions.

**Answer:**
The project follows Laravel's MVC architecture:

```
app/
├── Http/
│   ├── Controllers/     # Business logic controllers
│   ├── Middleware/      # Request filtering
│   └── Requests/        # Form request validation
├── Models/              # Eloquent ORM models
└── Providers/           # Service providers for dependency injection

config/                  # Configuration files
database/
├── migrations/          # Database schema definitions
├── seeders/            # Database seeding
└── factories/          # Model factories for testing

resources/
├── js/                 # React/TypeScript frontend
├── css/               # Stylesheets
└── views/             # Blade templates

routes/                 # Route definitions
tests/                  # Pest testing framework
```

This structure promotes:
- Separation of concerns
- Maintainable code
- Easy testing
- Clear organization

### Q3: How is authentication implemented in this project?

**Answer:**
Authentication is implemented using **Laravel Fortify**, which provides:

**Features:**
- User registration and login
- Password reset functionality
- Email verification
- Two-factor authentication (2FA)
- Profile management

**Implementation:**
```php
// FortifyServiceProvider.php configures authentication views
// Routes defined in auth.php handle authentication endpoints
// Middleware 'auth' and 'verified' protect routes

Route::middleware(['auth', 'verified'])->group(function () {
    // Protected routes for cart, orders, checkout
});
```

**Benefits:**
- Headless authentication (works with SPA)
- Customizable views
- Built-in security features
- Easy integration with frontend frameworks

### Q4: What is Laravel Wayfinder and how is it used in this project?

**Answer:**
Laravel Wayfinder is an advanced routing package that provides:

**Features:**
- Enhanced route generation
- Better route organization
- Improved route caching
- Type-safe route parameters

**Usage in project:**
```json
// package.json
"@laravel/vite-plugin-wayfinder": "^0.1.3"

// Provides better integration between Laravel routes and React frontend
// Enables type-safe route generation in TypeScript
// Improves development experience with auto-completion
```

**Benefits:**
- Better developer experience
- Type safety for routes
- Improved performance
- Easier maintenance

---

## Project Architecture Questions

### Q5: Explain the frontend architecture using React, TypeScript, and Inertia.js.

**Answer:**
The frontend uses a modern stack:

**React 18 + TypeScript:**
- Component-based architecture
- Type safety for better development experience
- Modern React features (hooks, concurrent features)

**Inertia.js:**
- SPA experience without API complexity
- Server-side routing with client-side navigation
- Seamless Laravel integration
- No need for separate API endpoints

**Architecture Benefits:**
```typescript
// Type-safe components
interface ProductProps {
  product: Product;
}

const ProductDetails: React.FC<ProductProps> = ({ product }) => {
  // TypeScript ensures type safety
};

// Inertia provides seamless navigation
import { Inertia } from '@inertiajs/inertia';
Inertia.visit('/products/1'); // Client-side navigation
```

**File Structure:**
```
resources/js/
├── components/         # Reusable UI components
├── pages/             # Page components (mapped to routes)
├── layouts/           # Layout components
├── types/             # TypeScript type definitions
├── hooks/             # Custom React hooks
└── lib/               # Utility functions
```

### Q6: How is state management handled in the frontend?

**Answer:**
State management is handled through multiple approaches:

**1. React State Hooks:**
```typescript
// Local component state
const [cart, setCart] = useState<CartItem[]>([]);
const [loading, setLoading] = useState(false);
```

**2. Inertia.js Shared Data:**
```php
// Laravel shares data globally
Inertia::share([
    'auth' => fn () => Auth::user(),
    'flash' => fn () => session()->get('flash'),
]);
```

**3. Custom Hooks for API calls:**
```typescript
// Custom hooks for data fetching
const useCart = () => {
  const [cart, setCart] = useState([]);
  
  const addToCart = async (product: Product) => {
    // API call to add product
  };
  
  return { cart, addToCart };
};
```

**Benefits:**
- No complex state management library needed
- Server-side state synchronization
- Simple and maintainable
- Type-safe state updates

### Q7: How are API endpoints structured and why?

**Answer:**
The project uses a hybrid approach:

**1. Inertia Routes (Primary):**
```php
// web.php - Direct page rendering
Route::get('/', [ProductController::class, 'index'])->name('home');
Route::get('/products/{id}', [ProductController::class, 'show']);
```

**2. API Routes (For AJAX operations):**
```php
// API routes for dynamic operations
Route::get('/api/cart', [CartControllers::class, 'index']);
Route::post('/api/cart', [CartControllers::class, 'store']);
Route::put('/api/cart/{id}', [CartControllers::class, 'update']);
Route::delete('/api/cart/{id}', [CartControllers::class, 'destroy']);
```

**Benefits:**
- **Inertia routes:** Full page loads with SEO benefits
- **API routes:** Dynamic operations without page refresh
- **RESTful design:** Predictable URL patterns
- **Authentication:** Middleware protection for sensitive operations

---

## Database Design Questions

### Q8: Explain the database schema and relationships in this e-commerce system.

**Answer:**
The database schema follows e-commerce best practices:

**Core Tables:**
1. **users** - Customer accounts
2. **product_tables** - Product catalog
3. **cart_tables** - Shopping cart items
4. **order_tables** - Order information
5. **order_item_tables** - Order line items
6. **payment_address_tables** - Customer addresses

**Relationships:**
```php
// User Model relationships
class User extends Model {
    public function orders() {
        return $this->hasMany(OrderModel::class);
    }
    
    public function cartItems() {
        return $this->hasMany(CartModel::class);
    }
}

// Order Model relationships
class OrderModel extends Model {
    public function user() {
        return $this->belongsTo(User::class);
    }
    
    public function items() {
        return $this->hasMany(OrderItemModel::class, 'order_id');
    }
}

// Cart Model relationships
class CartModel extends Model {
    public function user() {
        return $this->belongsTo(User::class);
    }
    
    public function product() {
        return $this->belongsTo(ProductModel::class);
    }
}
```

**Design Benefits:**
- Normalized data structure
- Clear foreign key relationships
- Supports complex e-commerce operations
- Scalable for future features

### Q9: How are complex data types handled in the database?

**Answer:**
The project uses JSON columns for complex data:

**Product Model JSON Fields:**
```php
class ProductModel extends Model {
    protected $casts = [
        'tags' => 'array',           // ["electronics", "gadgets"]
        'dimensions' => 'array',      // {"width": 10, "height": 5}
        'reviews' => 'array',         // [{"user": "John", "rating": 5}]
        'meta' => 'array',           // {"barcode": "123", "qrCode": "abc"}
        'images' => 'array',         // ["url1.jpg", "url2.jpg"]
    ];
}
```

**Migration Definition:**
```php
// In migration file
$table->json('tags')->nullable();
$table->json('dimensions')->nullable();
$table->json('reviews')->nullable();
$table->json('meta')->nullable();
$table->json('images')->nullable();
```

**Benefits:**
- Flexible schema for varying product attributes
- No need for separate tables for simple arrays
- Easy to query and update
- Maintains relational integrity

**Usage:**
```php
// Creating product with JSON data
ProductModel::create([
    'product_title' => 'Laptop',
    'tags' => ['electronics', 'computers'],
    'dimensions' => ['width' => 30, 'height' => 20],
    'images' => ['laptop1.jpg', 'laptop2.jpg']
]);

// Querying JSON data
$products = ProductModel::whereJsonContains('tags', 'electronics')->get();
```

### Q10: How would you optimize database queries in this project?

**Answer:**
Several optimization strategies can be applied:

**1. Eager Loading:**
```php
// Avoid N+1 problem
$orders = OrderModel::with(['user', 'items.product'])->get();

// In CartController
$cartItems = CartModel::with('product')
    ->where('user_id', auth()->id())
    ->get();
```

**2. Database Indexes:**
```php
// Add indexes in migrations
$table->index('user_id');
$table->index('product_id');
$table->index(['user_id', 'product_id']); // Composite index
$table->index('created_at');
```

**3. Query Optimization:**
```php
// Use select to limit columns
$products = ProductModel::select(['id', 'product_title', 'price', 'thumbnail'])
    ->where('availability_status', 'In Stock')
    ->paginate(20);

// Use exists for checking relationships
$usersWithOrders = User::whereHas('orders')->get();
```

**4. Caching:**
```php
// Cache expensive queries
$popularProducts = Cache::remember('popular_products', 3600, function () {
    return ProductModel::where('rating', '>', 4)
        ->orderBy('rating', 'desc')
        ->limit(10)
        ->get();
});
```

---

## Frontend & React Questions

### Q11: How are components organized and what design patterns are used?

**Answer:**
The project follows React best practices:

**Component Organization:**
```
resources/js/
├── components/
│   ├── ui/             # Reusable UI components (ShadcN)
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── pages/              # Page-level components
│   ├── products/       # Product-related pages
│   ├── cart/          # Cart pages
│   └── orders/        # Order pages
└── layouts/           # Layout wrappers
```

**Design Patterns Used:**

**1. Composition Pattern:**
```typescript
// Reusable Button component
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, size, children, ...props }) => {
  return (
    <button className={cn(buttonVariants({ variant, size }))} {...props}>
      {children}
    </button>
  );
};
```

**2. Custom Hooks Pattern:**
```typescript
// Custom hook for cart management
const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  const addItem = useCallback((product: Product) => {
    // Add to cart logic
  }, []);
  
  const removeItem = useCallback((id: number) => {
    // Remove from cart logic
  }, []);
  
  return { items, addItem, removeItem };
};
```

**3. Provider Pattern:**
```typescript
// Context for global state
const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
```

### Q12: How is form validation handled on the frontend?

**Answer:**
Form validation is handled at multiple levels:

**1. TypeScript Type Safety:**
```typescript
interface ProductFormData {
  product_title: string;
  price: number;
  category?: string;
  stock?: number;
}
```

**2. React Form Validation:**
```typescript
const ProductForm: React.FC = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = (data: ProductFormData): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!data.product_title.trim()) {
      newErrors.product_title = 'Product title is required';
    }
    
    if (data.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm(formData)) {
      // Submit form
    }
  };
};
```

**3. Server-side Validation:**
```php
// ProductController validation
$validatedData = $request->validate([
    'product_title' => 'required|string|max:255',
    'price' => 'required|numeric|min:0',
    'stock' => 'nullable|integer|min:0',
]);
```

**4. Error Display:**
```typescript
const FormField: React.FC<FormFieldProps> = ({ name, error, children }) => {
  return (
    <div className="form-field">
      {children}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
```

### Q13: How is the UI component library (ShadcN) integrated and used?

**Answer:**
ShadcN UI is integrated as a modern component library:

**Integration:**
```json
// package.json dependencies
"@radix-ui/react-avatar": "^1.1.3",
"@radix-ui/react-dialog": "^1.1.6",
"@radix-ui/react-dropdown-menu": "^2.1.6",
"class-variance-authority": "^0.7.1",
"clsx": "^2.1.1"
```

**Component Structure:**
```typescript
// Button component with variants
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

**Benefits:**
- **Accessibility:** Built on Radix UI primitives
- **Customizable:** Easy theming and variant system
- **Type Safe:** Full TypeScript support
- **Modern:** Uses CSS-in-JS with Tailwind classes
- **Consistent:** Unified design system

---

## Security Questions

### Q14: What security measures are implemented in this project?

**Answer:**
Multiple security layers are implemented:

**1. Authentication & Authorization:**
```php
// Laravel Fortify provides secure authentication
// Routes protected with middleware
Route::middleware(['auth', 'verified'])->group(function () {
    // Protected routes
});

// Two-factor authentication support
// Email verification required
```

**2. CSRF Protection:**
```php
// Automatic CSRF protection for forms
// Inertia.js handles CSRF tokens automatically
```

**3. Input Validation:**
```php
// Server-side validation
$validatedData = $request->validate([
    'product_title' => 'required|string|max:255',
    'price' => 'required|numeric|min:0',
    'email' => 'required|email|unique:users,email',
]);
```

**4. SQL Injection Prevention:**
```php
// Eloquent ORM prevents SQL injection
ProductModel::where('id', $id)->first(); // Safe
// Raw queries use parameter binding when needed
```

**5. XSS Protection:**
```php
// Blade templates automatically escape output
{{ $product->product_title }} // Automatically escaped

// React components also prevent XSS
<div>{product.product_title}</div> // Safe in React
```

**6. Environment Security:**
```env
// Sensitive data in .env file
APP_KEY=base64:generated_key
DB_PASSWORD=secure_password
// .env file excluded from version control
```

### Q15: How is user data protected and privacy maintained?

**Answer:**
Data protection follows best practices:

**1. Password Security:**
```php
// Laravel Fortify uses bcrypt hashing
// Passwords are never stored in plain text
// Strong password requirements can be enforced
```

**2. Data Encryption:**
```php
// Sensitive data can be encrypted
use Illuminate\Support\Facades\Crypt;

// Encrypt sensitive data
$encrypted = Crypt::encryptString($sensitive_data);
// Decrypt when needed
$decrypted = Crypt::decryptString($encrypted);
```

**3. Database Security:**
```php
// User data access control
class CartControllers extends Controller {
    public function index() {
        // Users can only access their own cart
        return CartModel::where('user_id', auth()->id())->get();
    }
}
```

**4. HTTPS Enforcement:**
```php
// Force HTTPS in production
// Configure in AppServiceProvider
if (app()->environment('production')) {
    URL::forceScheme('https');
}
```

**5. Data Minimization:**
```php
// Only collect necessary data
// Regular data cleanup for old records
// User consent for data collection
```

---

## Performance Questions

### Q16: How is the application optimized for performance?

**Answer:**
Multiple optimization strategies are implemented:

**1. Frontend Optimization:**
```json
// Vite for fast builds and HMR
// TypeScript for better development experience
// Code splitting and lazy loading
{
  "scripts": {
    "dev": "vite",           // Fast development server
    "build": "vite build"    // Optimized production build
  }
}
```

**2. Database Optimization:**
```php
// Eager loading to prevent N+1 queries
$orders = OrderModel::with(['user', 'items'])->get();

// Pagination for large datasets
$products = ProductModel::paginate(20);

// Database indexing on foreign keys
$table->index('user_id');
$table->index('product_id');
```

**3. Caching Strategy:**
```php
// Laravel cache for expensive operations
$products = Cache::remember('featured_products', 3600, function () {
    return ProductModel::where('featured', true)->get();
});

// Opcache for PHP bytecode caching
// Redis/Memcached for session and cache storage
```

**4. Asset Optimization:**
```javascript
// Vite handles asset optimization
// Image optimization
// CSS and JS minification
// Tree shaking for unused code
```

**5. Queue System:**
```php
// Background job processing
// Email sending via queues
// Image processing in background
Queue::push(new ProcessImageJob($image));
```

### Q17: How would you scale this application for high traffic?

**Answer:**
Scaling strategies for high traffic:

**1. Horizontal Scaling:**
```yaml
# Load balancer configuration
# Multiple application servers
# Database read replicas
# CDN for static assets
```

**2. Database Scaling:**
```php
// Database read/write splitting
config(['database.default' => 'mysql_read']);
$products = ProductModel::all(); // Read from replica

config(['database.default' => 'mysql_write']);
ProductModel::create($data); // Write to master
```

**3. Caching Layers:**
```php
// Multiple cache layers
// Application cache (Redis)
// Database query cache
// HTTP cache (Varnish)
// CDN cache (CloudFlare)

// Cache invalidation strategy
Cache::tags(['products'])->flush(); // Clear product cache
```

**4. Queue Workers:**
```php
// Separate queue workers for different tasks
// Image processing queue
// Email queue
// Notification queue

// Multiple queue workers
php artisan queue:work --queue=high,medium,low
```

**5. Microservices Architecture:**
```php
// Separate services for:
// - User authentication service
// - Product catalog service
// - Order processing service
// - Payment processing service
// - Notification service
```

---

## Testing Questions

### Q18: What testing framework is used and how are tests structured?

**Answer:**
The project uses **Pest PHP** for testing:

**Framework Benefits:**
```php
// Pest provides modern, expressive syntax
// Built on top of PHPUnit
// Better developer experience
// More readable tests

// Example test structure
test('user can view products', function () {
    $products = ProductModel::factory()->count(3)->create();
    
    $response = $this->get('/');
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => 
        $page->component('products/Index')
             ->has('products', 3)
    );
});
```

**Test Categories:**

**1. Feature Tests:**
```php
// Test complete user flows
test('user can add product to cart', function () {
    $user = User::factory()->create();
    $product = ProductModel::factory()->create();
    
    $this->actingAs($user)
         ->post('/api/cart', [
             'product_id' => $product->id,
             'quantity' => 2
         ])
         ->assertOk();
    
    $this->assertDatabaseHas('cart_tables', [
        'user_id' => $user->id,
        'product_id' => $product->id,
        'quantity' => 2
    ]);
});
```

**2. Unit Tests:**
```php
// Test individual components
test('product calculates discounted price correctly', function () {
    $product = new ProductModel([
        'price' => 100,
        'discount_percentage' => 20
    ]);
    
    expect($product->getDiscountedPrice())->toBe(80.0);
});
```

**3. Database Tests:**
```php
// Test model relationships
test('order has many order items', function () {
    $order = OrderModel::factory()->create();
    $orderItems = OrderItemModel::factory()->count(3)->create([
        'order_id' => $order->id
    ]);
    
    expect($order->items)->toHaveCount(3);
});
```

### Q19: How do you test the React frontend components?

**Answer:**
Frontend testing strategies:

**1. Component Testing:**
```typescript
// Using React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';

test('renders product information correctly', () => {
    const product = {
        id: 1,
        product_title: 'Test Product',
        price: 99.99,
        thumbnail: 'image.jpg'
    };
    
    render(<ProductCard product={product} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
});
```

**2. Integration Testing:**
```typescript
// Test component interactions
test('adds product to cart when button clicked', async () => {
    const mockAddToCart = jest.fn();
    
    render(<ProductCard product={product} onAddToCart={mockAddToCart} />);
    
    fireEvent.click(screen.getByText('Add to Cart'));
    
    expect(mockAddToCart).toHaveBeenCalledWith(product);
});
```

**3. End-to-End Testing:**
```typescript
// Using Playwright or Cypress
test('complete purchase flow', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="product-1"]');
    await page.click('[data-testid="add-to-cart"]');
    await page.goto('/cart');
    await page.click('[data-testid="checkout"]');
    // ... continue with checkout flow
});
```

**4. Type Testing:**
```typescript
// TypeScript provides compile-time testing
interface ProductProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

// Type errors caught at compile time
const ProductCard: React.FC<ProductProps> = ({ product, onAddToCart }) => {
    // TypeScript ensures type safety
};
```

---

## DevOps & Deployment Questions

### Q20: How would you deploy this application to production?

**Answer:**
Production deployment strategy:

**1. Environment Setup:**
```bash
# Production server requirements
- PHP 8.2+
- Composer
- Node.js 18+
- Web server (Nginx/Apache)
- Database (MySQL/PostgreSQL)
- Redis (for caching/sessions)
- SSL certificate
```

**2. Build Process:**
```bash
# Automated deployment script
#!/bin/bash

# 1. Pull latest code
git pull origin main

# 2. Install dependencies
composer install --optimize-autoloader --no-dev
npm ci

# 3. Build frontend assets
npm run build

# 4. Run migrations
php artisan migrate --force

# 5. Cache optimization
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Set permissions
chmod -R 775 storage bootstrap/cache
```

**3. Environment Configuration:**
```env
# Production .env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=production_db

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Mail
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
```

**4. Web Server Configuration:**
```nginx
# Nginx configuration
server {
    listen 443 ssl;
    server_name yourdomain.com;
    root /var/www/laravel-ecom/public;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

**5. Process Management:**
```bash
# Supervisor for queue workers
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/laravel-ecom/artisan queue:work
autostart=true
autorestart=true
user=www-data
numprocs=4
```

### Q21: How do you implement CI/CD for this project?

**Answer:**
CI/CD pipeline implementation:

**1. GitHub Actions Workflow:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          
      - name: Install dependencies
        run: composer install
        
      - name: Run tests
        run: php artisan test
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install npm dependencies
        run: npm ci
        
      - name: Build assets
        run: npm run build
        
      - name: Run linting
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /var/www/laravel-ecom
            git pull origin main
            composer install --no-dev --optimize-autoloader
            npm ci && npm run build
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
            sudo supervisorctl restart laravel-worker:*
```

**2. Quality Gates:**
```yaml
# Quality checks before deployment
- name: Code Style Check
  run: ./vendor/bin/pint --test

- name: Static Analysis
  run: ./vendor/bin/phpstan analyse

- name: Security Check
  run: composer audit

- name: Frontend Type Check
  run: npm run type-check
```

**3. Database Migrations:**
```bash
# Safe migration strategy
php artisan migrate --pretend  # Preview migrations
php artisan migrate --force    # Run in production
php artisan migrate:rollback   # Rollback if needed
```

**4. Zero-Downtime Deployment:**
```bash
# Blue-green deployment strategy
# 1. Deploy to staging environment
# 2. Run health checks
# 3. Switch traffic to new version
# 4. Keep old version for quick rollback
```

---

## E-commerce Specific Questions

### Q22: How is the shopping cart functionality implemented?

**Answer:**
Shopping cart implementation:

**1. Cart Model Structure:**
```php
class CartModel extends Model {
    protected $table = 'cart_tables';
    
    protected $fillable = [
        'user_id',
        'product_id', 
        'quantity',
        'price',        // Store price at time of adding
    ];
    
    // Relationships
    public function user() {
        return $this->belongsTo(User::class);
    }
    
    public function product() {
        return $this->belongsTo(ProductModel::class);
    }
}
```

**2. Cart Controller Operations:**
```php
class CartControllers extends Controller {
    public function index() {
        // Get user's cart with product details
        $cartItems = CartModel::with('product')
            ->where('user_id', auth()->id())
            ->get();
            
        return response()->json($cartItems);
    }
    
    public function store(Request $request) {
        $validated = $request->validate([
            'product_id' => 'required|exists:product_tables,id',
            'quantity' => 'required|integer|min:1'
        ]);
        
        // Check if item already in cart
        $existingItem = CartModel::where([
            'user_id' => auth()->id(),
            'product_id' => $validated['product_id']
        ])->first();
        
        if ($existingItem) {
            // Update quantity
            $existingItem->update([
                'quantity' => $existingItem->quantity + $validated['quantity']
            ]);
        } else {
            // Add new item
            $product = ProductModel::findOrFail($validated['product_id']);
            CartModel::create([
                'user_id' => auth()->id(),
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'price' => $product->price // Store current price
            ]);
        }
        
        return response()->json(['message' => 'Item added to cart']);
    }
    
    public function update(Request $request, $id) {
        $cartItem = CartModel::where('user_id', auth()->id())
            ->findOrFail($id);
            
        $cartItem->update([
            'quantity' => $request->quantity
        ]);
        
        return response()->json(['message' => 'Cart updated']);
    }
    
    public function destroy($id) {
        CartModel::where('user_id', auth()->id())
            ->findOrFail($id)
            ->delete();
            
        return response()->json(['message' => 'Item removed']);
    }
}
```

**3. Frontend Cart Management:**
```typescript
// Custom hook for cart operations
const useCart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    
    const fetchCart = async () => {
        try {
            const response = await fetch('/api/cart');
            const data = await response.json();
            setCartItems(data);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    };
    
    const addToCart = async (productId: number, quantity: number) => {
        setLoading(true);
        try {
            await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf_token,
                },
                body: JSON.stringify({ product_id: productId, quantity }),
            });
            
            await fetchCart(); // Refresh cart
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const updateQuantity = async (itemId: number, quantity: number) => {
        try {
            await fetch(`/api/cart/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity }),
            });
            
            await fetchCart();
        } catch (error) {
            console.error('Failed to update cart:', error);
        }
    };
    
    const removeItem = async (itemId: number) => {
        try {
            await fetch(`/api/cart/${itemId}`, {
                method: 'DELETE',
            });
            
            await fetchCart();
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };
    
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };
    
    return {
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        getTotalPrice,
        fetchCart,
    };
};
```

**Benefits:**
- Persistent cart (survives browser sessions)
- Real-time updates
- Optimistic UI updates
- Error handling
- Price consistency (stored at add time)

### Q23: How is the order management system designed?

**Answer:**
Order management follows e-commerce best practices:

**1. Order Data Structure:**
```php
// Order Model
class OrderModel extends Model {
    protected $table = 'order_tables';
    
    protected $fillable = [
        'user_id',
        'status',              // pending, processing, shipped, delivered, cancelled
        'total_amount',
        'shipping_address',
        'billing_address', 
        'payment_method',
        'transaction_id',
        'notes',
    ];
    
    // Order statuses
    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_SHIPPED = 'shipped';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_CANCELLED = 'cancelled';
    
    public function items() {
        return $this->hasMany(OrderItemModel::class, 'order_id');
    }
}

// Order Item Model
class OrderItemModel extends Model {
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',              // Price at time of order
        'product_title',      // Snapshot of product title
    ];
}
```

**2. Order Creation Process:**
```php
class OrderControllers extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            'shipping_address' => 'required|string',
            'billing_address' => 'required|string',
            'payment_method' => 'required|string',
        ]);
        
        DB::transaction(function () use ($validated) {
            // Get user's cart
            $cartItems = CartModel::with('product')
                ->where('user_id', auth()->id())
                ->get();
                
            if ($cartItems->isEmpty()) {
                throw new Exception('Cart is empty');
            }
            
            // Calculate total
            $totalAmount = $cartItems->sum(function ($item) {
                return $item->price * $item->quantity;
            });
            
            // Create order
            $order = OrderModel::create([
                'user_id' => auth()->id(),
                'status' => OrderModel::STATUS_PENDING,
                'total_amount' => $totalAmount,
                'shipping_address' => $validated['shipping_address'],
                'billing_address' => $validated['billing_address'],
                'payment_method' => $validated['payment_method'],
            ]);
            
            // Create order items
            foreach ($cartItems as $cartItem) {
                OrderItemModel::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->price,
                    'product_title' => $cartItem->product->product_title,
                ]);
                
                // Update product stock
                $product = $cartItem->product;
                $product->decrement('stock', $cartItem->quantity);
            }
            
            // Clear cart
            CartModel::where('user_id', auth()->id())->delete();
            
            // Process payment (integrate with payment gateway)
            $this->processPayment($order, $validated['payment_method']);
        });
        
        return response()->json(['message' => 'Order created successfully']);
    }
    
    public function index() {
        $orders = OrderModel::with('items.product')
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return response()->json($orders);
    }
    
    public function show($id) {
        $order = OrderModel::with(['items.product'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);
            
        return response()->json($order);
    }
}
```

**3. Order Status Management:**
```php
// Order status updates
public function updateStatus(Request $request, $id) {
    $order = OrderModel::findOrFail($id);
    
    $validated = $request->validate([
        'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
    ]);
    
    $order->update(['status' => $validated['status']]);
    
    // Send notification to customer
    Mail::to($order->user->email)->send(new OrderStatusUpdated($order));
    
    return response()->json(['message' => 'Order status updated']);
}
```

**Benefits:**
- Complete order history
- Inventory management
- Order status tracking
- Data consistency with transactions
- Payment integration ready

### Q24: How would you implement a product search and filtering system?

**Answer:**
Advanced search and filtering implementation:

**1. Database Optimization:**
```php
// Add search indexes
Schema::table('product_tables', function (Blueprint $table) {
    $table->fullText(['product_title', 'product_description']); // Full-text search
    $table->index('category');
    $table->index('brand');
    $table->index('price');
    $table->index('rating');
    $table->index('availability_status');
});
```

**2. Search Controller:**
```php
class ProductSearchController extends Controller {
    public function search(Request $request) {
        $query = ProductModel::query();
        
        // Text search
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->whereFullText(['product_title', 'product_description'], $searchTerm)
                  ->orWhere('product_title', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('brand', 'LIKE', "%{$searchTerm}%");
        }
        
        // Category filter
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        
        // Price range filter
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        
        // Brand filter
        if ($request->filled('brands')) {
            $brands = explode(',', $request->brands);
            $query->whereIn('brand', $brands);
        }
        
        // Rating filter
        if ($request->filled('min_rating')) {
            $query->where('rating', '>=', $request->min_rating);
        }
        
        // Availability filter
        if ($request->filled('in_stock_only')) {
            $query->where('availability_status', 'In Stock');
        }
        
        // Tags filter (JSON search)
        if ($request->filled('tags')) {
            $tags = explode(',', $request->tags);
            foreach ($tags as $tag) {
                $query->whereJsonContains('tags', $tag);
            }
        }
        
        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        switch ($sortBy) {
            case 'price_low_high':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high_low':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'popularity':
                // Assuming we track views or sales
                $query->orderBy('views', 'desc');
                break;
            default:
                $query->orderBy($sortBy, $sortOrder);
        }
        
        // Pagination
        $perPage = $request->get('per_page', 20);
        $products = $query->paginate($perPage);
        
        return response()->json($products);
    }
    
    public function getFilters() {
        // Get available filter options
        $categories = ProductModel::distinct()->pluck('category')->filter();
        $brands = ProductModel::distinct()->pluck('brand')->filter();
        $priceRange = [
            'min' => ProductModel::min('price'),
            'max' => ProductModel::max('price')
        ];
        
        return response()->json([
            'categories' => $categories,
            'brands' => $brands,
            'price_range' => $priceRange,
        ]);
    }
}
```

**3. Frontend Search Interface:**
```typescript
interface SearchFilters {
    search?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    brands?: string[];
    min_rating?: number;
    in_stock_only?: boolean;
    tags?: string[];
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

const useProductSearch = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    
    const searchProducts = async (newFilters: SearchFilters, page = 1) => {
        setLoading(true);
        try {
            const searchParams = new URLSearchParams({
                ...newFilters,
                page: page.toString(),
            });
            
            const response = await fetch(`/api/search?${searchParams}`);
            const data = await response.json();
            
            setProducts(data.data);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                total: data.total,
            });
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const updateFilters = (newFilters: Partial<SearchFilters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        searchProducts(updatedFilters);
    };
    
    return {
        products,
        filters,
        loading,
        pagination,
        updateFilters,
        searchProducts,
    };
};

// Search Component
const ProductSearch: React.FC = () => {
    const { products, filters, updateFilters, loading } = useProductSearch();
    
    return (
        <div className="product-search">
            <div className="search-filters">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search || ''}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                />
                
                <select 
                    value={filters.category || ''}
                    onChange={(e) => updateFilters({ category: e.target.value })}
                >
                    <option value="">All Categories</option>
                    {/* Categories populated from API */}
                </select>
                
                <div className="price-range">
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={filters.min_price || ''}
                        onChange={(e) => updateFilters({ min_price: Number(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={filters.max_price || ''}
                        onChange={(e) => updateFilters({ max_price: Number(e.target.value) })}
                    />
                </div>
                
                <select
                    value={filters.sort_by || 'created_at'}
                    onChange={(e) => updateFilters({ sort_by: e.target.value })}
                >
                    <option value="created_at">Newest</option>
                    <option value="price_low_high">Price: Low to High</option>
                    <option value="price_high_low">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popularity">Most Popular</option>
                </select>
            </div>
            
            <div className="search-results">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
```

**4. Advanced Features:**
```php
// Elasticsearch integration for better search
class ElasticsearchService {
    public function indexProduct(ProductModel $product) {
        // Index product in Elasticsearch
    }
    
    public function search($query, $filters = []) {
        // Advanced search with Elasticsearch
        // Support for fuzzy matching, autocomplete, etc.
    }
}

// Search suggestions
public function suggestions(Request $request) {
    $query = $request->get('q');
    
    $suggestions = ProductModel::where('product_title', 'LIKE', "{$query}%")
        ->limit(10)
        ->pluck('product_title')
        ->unique();
        
    return response()->json($suggestions);
}
```

**Benefits:**
- Fast, efficient search
- Multiple filter combinations
- Real-time results
- Scalable with search engines
- Good user experience

---

## Code Quality Questions

### Q25: How do you ensure code quality and maintainability in this project?

**Answer:**
Code quality is maintained through multiple approaches:

**1. Code Standards & Linting:**
```json
// package.json scripts
{
  "scripts": {
    "lint": "eslint . --fix",
    "format": "prettier --write resources/",
    "type-check": "tsc --noEmit"
  }
}
```

```php
// Laravel Pint for PHP code style
// Run with: ./vendor/bin/pint
// Follows PSR-12 standards automatically
```

**2. Type Safety:**
```typescript
// TypeScript interfaces for type safety
interface Product {
    id: number;
    product_title: string;
    price: number;
    category?: string;
    availability_status: 'In Stock' | 'Out of Stock' | 'Preorder' | 'Discontinued' | 'Low Stock';
}

interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    price: number;
    product: Product;
}

// React component with type safety
interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    // TypeScript ensures type safety at compile time
};
```

**3. Code Organization:**
```php
// Service layer for business logic
class OrderService {
    public function createOrder(User $user, array $orderData): OrderModel {
        return DB::transaction(function () use ($user, $orderData) {
            // Complex order creation logic
            // Separated from controller
        });
    }
    
    public function updateOrderStatus(OrderModel $order, string $status): void {
        $order->update(['status' => $status]);
        
        // Send notifications
        event(new OrderStatusUpdated($order));
    }
}

// Repository pattern for data access
class ProductRepository {
    public function findByCategory(string $category): Collection {
        return ProductModel::where('category', $category)->get();
    }
    
    public function search(string $query, array $filters = []): LengthAwarePaginator {
        // Complex search logic
    }
}
```

**4. Design Patterns:**
```php
// Factory pattern for creating complex objects
class OrderFactory {
    public static function createFromCart(User $user, Collection $cartItems): OrderModel {
        // Create order with proper validation and calculations
    }
}

// Observer pattern for events
class OrderObserver {
    public function created(OrderModel $order) {
        // Send order confirmation email
        Mail::to($order->user)->send(new OrderConfirmation($order));
    }
    
    public function updated(OrderModel $order) {
        if ($order->isDirty('status')) {
            // Status changed, send notification
        }
    }
}
```

**5. Error Handling:**
```php
// Custom exceptions
class InsufficientStockException extends Exception {
    public function __construct(ProductModel $product, int $requestedQuantity) {
        $message = "Insufficient stock for {$product->product_title}. Requested: {$requestedQuantity}, Available: {$product->stock}";
        parent::__construct($message);
    }
}

// Global exception handling
class Handler extends ExceptionHandler {
    public function render($request, Throwable $exception) {
        if ($exception instanceof InsufficientStockException) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 422);
        }
        
        return parent::render($request, $exception);
    }
}
```

**6. Documentation:**
```php
/**
 * Create a new order from the user's cart
 * 
 * @param User $user The user creating the order
 * @param array $shippingData Shipping address and preferences
 * @param string $paymentMethod Payment method identifier
 * 
 * @return OrderModel The created order
 * 
 * @throws InsufficientStockException When product stock is insufficient
 * @throws PaymentFailedException When payment processing fails
 */
public function createOrder(User $user, array $shippingData, string $paymentMethod): OrderModel {
    // Implementation
}
```

### Q26: How do you handle error logging and monitoring?

**Answer:**
Comprehensive error handling and monitoring:

**1. Laravel Logging Configuration:**
```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['single', 'slack'],
    ],
    
    'single' => [
        'driver' => 'single',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
    ],
    
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'Laravel Log',
        'emoji' => ':boom:',
        'level' => 'critical',
    ],
],
```

**2. Custom Error Handling:**
```php
// Exception Handler
class Handler extends ExceptionHandler {
    protected $dontReport = [
        ValidationException::class,
        HttpException::class,
    ];
    
    public function report(Throwable $exception) {
        if ($this->shouldReport($exception)) {
            // Log to external service (Sentry, Bugsnag, etc.)
            if (app()->bound('sentry')) {
                app('sentry')->captureException($exception);
            }
            
            // Custom logging with context
            Log::error('Application Error', [
                'exception' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'user_id' => auth()->id(),
                'url' => request()->url(),
                'user_agent' => request()->userAgent(),
                'ip' => request()->ip(),
            ]);
        }
        
        parent::report($exception);
    }
    
    public function render($request, Throwable $exception) {
        // API error responses
        if ($request->expectsJson()) {
            return response()->json([
                'error' => 'An error occurred',
                'message' => app()->environment('production') 
                    ? 'Something went wrong' 
                    : $exception->getMessage(),
            ], 500);
        }
        
        return parent::render($request, $exception);
    }
}
```

**3. Application Monitoring:**
```php
// Custom middleware for monitoring
class MonitoringMiddleware {
    public function handle($request, Closure $next) {
        $startTime = microtime(true);
        
        $response = $next($request);
        
        $duration = microtime(true) - $startTime;
        
        // Log slow requests
        if ($duration > 2.0) {
            Log::warning('Slow Request', [
                'url' => $request->url(),
                'method' => $request->method(),
                'duration' => $duration,
                'memory_usage' => memory_get_peak_usage(true),
            ]);
        }
        
        // Track metrics
        $this->trackMetrics($request, $response, $duration);
        
        return $response;
    }
    
    private function trackMetrics($request, $response, $duration) {
        // Send metrics to monitoring service
        // e.g., StatsD, CloudWatch, Prometheus
    }
}
```

**4. Frontend Error Handling:**
```typescript
// Global error boundary
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }
    
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to service
        console.error('React Error:', error, errorInfo);
        
        // Send to monitoring service
        if (window.Sentry) {
            window.Sentry.captureException(error, {
                contexts: { react: errorInfo }
            });
        }
    }
    
    render() {
        if (this.state.hasError) {
            return <ErrorFallback />;
        }
        
        return this.props.children;
    }
}

// API error handling
const handleApiError = (error: Error) => {
    console.error('API Error:', error);
    
    // Show user-friendly message
    toast.error('Something went wrong. Please try again.');
    
    // Log to monitoring service
    if (window.Sentry) {
        window.Sentry.captureException(error);
    }
};
```

**5. Health Checks:**
```php
// Health check endpoint
Route::get('/health', function () {
    $checks = [
        'database' => $this->checkDatabase(),
        'cache' => $this->checkCache(),
        'storage' => $this->checkStorage(),
        'queue' => $this->checkQueue(),
    ];
    
    $healthy = collect($checks)->every(fn($check) => $check['status'] === 'ok');
    
    return response()->json([
        'status' => $healthy ? 'healthy' : 'unhealthy',
        'checks' => $checks,
        'timestamp' => now(),
    ], $healthy ? 200 : 503);
});

private function checkDatabase(): array {
    try {
        DB::connection()->getPdo();
        return ['status' => 'ok'];
    } catch (Exception $e) {
        return ['status' => 'error', 'message' => $e->getMessage()];
    }
}
```

This comprehensive set of interview questions covers all aspects of the Laravel e-commerce project, from basic framework knowledge to advanced architectural decisions, security considerations, and deployment strategies. Each answer provides detailed explanations with code examples that demonstrate deep understanding of the technologies and best practices used in the project.