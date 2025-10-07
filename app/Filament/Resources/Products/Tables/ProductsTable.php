<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('thumbnail')
                    ->label('Image')
                    ->circular()
                    ->size(40),
                    
                TextColumn::make('product_title')
                    ->label('Product Title')
                    ->searchable()
                    ->sortable()
                    ->limit(30),
                    
                TextColumn::make('category')
                    ->label('Category')
                    ->searchable()
                    ->sortable(),
                    
                TextColumn::make('brand')
                    ->label('Brand')
                    ->searchable()
                    ->sortable(),
                    
                TextColumn::make('price')
                    ->label('Price')
                    ->money('USD')
                    ->sortable(),
                    
                TextColumn::make('discount_percentage')
                    ->label('Discount')
                    ->suffix('%')
                    ->sortable()
                    ->toggleable(),
                    
                TextColumn::make('stock')
                    ->label('Stock')
                    ->numeric()
                    ->sortable()
                    ->color(fn (string $state): string => match (true) {
                        $state > 20 => 'success',
                        $state > 0 => 'warning',
                        default => 'danger',
                    }),
                    
                TextColumn::make('availability_status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'In Stock' => 'success',
                        'Low Stock' => 'warning',
                        'Out of Stock' => 'danger',
                        'Preorder' => 'info',
                        'Discontinued' => 'gray',
                        default => 'gray',
                    }),
                    
                TextColumn::make('rating')
                    ->label('Rating')
                    ->numeric()
                    ->sortable()
                    ->toggleable(),
                    
                TextColumn::make('sku')
                    ->label('SKU')
                    ->searchable()
                    ->toggleable(),
                    
                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->label('Category')
                    ->options(function () {
                        return \App\Models\ProductModel::distinct()
                            ->pluck('category', 'category')
                            ->filter()
                            ->toArray();
                    }),
                    
                SelectFilter::make('availability_status')
                    ->label('Availability')
                    ->options([
                        'In Stock' => 'In Stock',
                        'Out of Stock' => 'Out of Stock',
                        'Low Stock' => 'Low Stock',
                        'Preorder' => 'Preorder',
                        'Discontinued' => 'Discontinued',
                    ]),
                    
                SelectFilter::make('brand')
                    ->label('Brand')
                    ->options(function () {
                        return \App\Models\ProductModel::distinct()
                            ->pluck('brand', 'brand')
                            ->filter()
                            ->toArray();
                    }),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
