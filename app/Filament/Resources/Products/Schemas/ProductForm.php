<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('product_title')
                    ->label('Product Title')
                    ->required()
                    ->maxLength(255)
                    ->placeholder('Enter product title')
                    ->columnSpan(2),
                
                Textarea::make('product_description')
                    ->label('Description')
                    ->required()
                    ->rows(4)
                    ->columnSpan(2)
                    ->placeholder('Enter product description'),
                
                TextInput::make('category')
                    ->label('Category')
                    ->placeholder('Enter product category'),
                    
                TextInput::make('brand')
                    ->label('Brand')
                    ->placeholder('Enter brand name'),
                
                TextInput::make('price')
                    ->label('Price')
                    ->required()
                    ->numeric()
                    ->prefix('$')
                    ->step(0.01)
                    ->placeholder('0.00'),
                
                TextInput::make('discount_percentage')
                    ->label('Discount (%)')
                    ->numeric()
                    ->suffix('%')
                    ->placeholder('0'),
                
                TextInput::make('stock')
                    ->label('Stock Quantity')
                    ->numeric()
                    ->placeholder('0'),
                
                TextInput::make('sku')
                    ->label('SKU')
                    ->unique(ignoreRecord: true)
                    ->placeholder('Enter SKU'),
                
                TextInput::make('minimum_order_quantity')
                    ->label('Min Order Qty')
                    ->required()
                    ->numeric()
                    ->default(1),
                
                Select::make('availability_status')
                    ->label('Availability')
                    ->options([
                        'In Stock' => 'In Stock',
                        'Out of Stock' => 'Out of Stock',
                        'Low Stock' => 'Low Stock',
                        'Preorder' => 'Preorder',
                        'Discontinued' => 'Discontinued',
                    ])
                    ->default('In Stock')
                    ->required(),
                
                TextInput::make('weight')
                    ->label('Weight (kg)')
                    ->numeric()
                    ->step(0.01)
                    ->placeholder('0.00'),
                
                TextInput::make('rating')
                    ->label('Rating')
                    ->numeric()
                    ->step(0.1)
                    ->placeholder('0.0'),
                
                Textarea::make('dimensions')
                    ->label('Dimensions')
                    ->placeholder('Length x Width x Height')
                    ->columnSpan(2),
                
                Textarea::make('tags')
                    ->label('Tags')
                    ->placeholder('Separate tags with commas')
                    ->columnSpan(2),
                
                TextInput::make('warranty_information')
                    ->label('Warranty Information')
                    ->placeholder('e.g., 1 year manufacturer warranty'),
                
                TextInput::make('shipping_information')
                    ->label('Shipping Information')
                    ->placeholder('e.g., Ships within 2-3 business days'),
                
                TextInput::make('return_policy')
                    ->label('Return Policy')
                    ->placeholder('e.g., 30-day return policy')
                    ->columnSpan(2),
                
                TextInput::make('thumbnail')
                    ->label('Thumbnail URL')
                    ->url()
                    ->placeholder('https://example.com/image.jpg'),
                
                Textarea::make('images')
                    ->label('Additional Images')
                    ->placeholder('Enter image URLs, one per line'),
                
                Textarea::make('reviews')
                    ->label('Reviews')
                    ->rows(3)
                    ->columnSpan(2)
                    ->placeholder('Product reviews'),
                
                Textarea::make('meta')
                    ->label('Metadata')
                    ->rows(3)
                    ->columnSpan(2)
                    ->placeholder('Additional metadata'),
            ])
            ->columns(2);
    }
}
