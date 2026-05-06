import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CatalogService } from '../services/CatalogService';
import { Product } from '../types';

const CatalogView: React.FC = () => {
    const { addToCart, inventory } = useStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [filters, setFilters] = useState({
        priceRange: [0, 10000], // Updated default range
        vehicleType: [] as string[],
        season: 'All-Season',
        speedRating: [] as string[],
        category: 'All Categories',
        brand: 'All Brands',
        width: '',
        ratio: '',
        rim: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    // Load initial data
    useEffect(() => {
        setProducts(CatalogService.getAllProducts());
    }, []);

    // Get dynamic filter options
    const filterOptions = useMemo(() => CatalogService.getFilters(), []);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        let result = CatalogService.searchProducts(searchQuery, {
            brand: filters.brand,
            category: filters.category
        });

        // Client-side filtering for other attributes not handled by service yet
        if (filters.width) result = result.filter(p => p.specs?.size?.includes(filters.width));
        if (filters.ratio) result = result.filter(p => p.specs?.size?.includes(filters.ratio)); // Rough match
        if (filters.rim) result = result.filter(p => p.specs?.size?.includes(`R${filters.rim}`));

        return result;
    }, [products, searchQuery, filters]);

    const displayedProducts = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, page]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const handleAddToCart = (product: Product) => {
        // Determine type based on category or other props
        const type = product.sub_category?.toLowerCase().includes('tire') ? 'tire' : 'part';
        addToCart(product, type);
    };

    return (
        <div className="flex flex-1 overflow-hidden bg-background-dark">
            {/* Filters Sidebar */}
            <aside className="w-72 bg-surface-dark border-r border-border-dark flex flex-col overflow-y-auto hidden lg:flex shrink-0">
                <div className="p-4 border-b border-border-dark flex justify-between items-center sticky top-0 bg-surface-dark z-10">
                    <h3 className="font-bold text-lg text-white">Filters</h3>
                    <button
                        onClick={() => {
                            setFilters({
                                priceRange: [0, 10000],
                                vehicleType: [],
                                season: 'All-Season',
                                speedRating: [],
                                category: 'All Categories',
                                brand: 'All Brands',
                                width: '',
                                ratio: '',
                                rim: '',
                            });
                            setSearchQuery('');
                        }}
                        className="text-xs text-primary hover:underline"
                    >
                        Reset All
                    </button>
                </div>

                {/* Categories */}
                <div className="p-5 border-b border-border-dark">
                    <span className="font-semibold text-sm text-gray-200 block mb-3">Category</span>
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-surface-darker border border-border-dark text-white text-sm rounded px-2 py-1"
                    >
                        <option>All Categories</option>
                        {filterOptions.categories.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                </div>

                {/* Brands */}
                <div className="p-5 border-b border-border-dark">
                    <span className="font-semibold text-sm text-gray-200 block mb-3">Brand</span>
                    <select
                        value={filters.brand}
                        onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                        className="w-full bg-surface-darker border border-border-dark text-white text-sm rounded px-2 py-1"
                    >
                        <option>All Brands</option>
                        {filterOptions.brands.map(brand => <option key={brand}>{brand}</option>)}
                    </select>
                </div>

                {/* Price Range (Visual only for now) */}
                <div className="p-5 border-b border-border-dark">
                    <button className="flex items-center justify-between w-full mb-4 group">
                        <span className="font-semibold text-sm text-gray-200">Price Range</span>
                        <span className="material-symbols-outlined text-gray-500 group-hover:text-primary text-sm">expand_less</span>
                    </button>
                    <div className="px-2">
                        {/* Mock slider */}
                        <div className="h-1 w-full bg-border-dark rounded-full relative mb-4">
                            <div className="absolute left-0 right-0 h-full bg-primary rounded-full"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 font-mono">
                            <span>₱0</span>
                            <span>₱10k+</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Filter Bar */}
                <div className="bg-surface-dark border-b border-border-dark p-6 shadow-md z-10">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Catalog</h2>
                            <div className="text-sm text-gray-400">Showing <span className="text-primary font-bold">{filteredProducts.length}</span> results {searchQuery && <span>for <span className="text-white italic">"{searchQuery}"</span></span>}</div>
                        </div>
                        <div className="flex flex-wrap gap-4 items-end bg-background-dark p-4 rounded-xl border border-border-dark">
                            <div className="flex-1 min-w-[300px]">
                                <label className="text-xs font-medium text-gray-400 mb-1 block">Search Catalog</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search Part #, Model, Brand..."
                                        className="w-full bg-surface-dark border border-border-dark text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pl-10"
                                    />
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500">search</span>
                                </div>
                            </div>

                            {/* Tire Specific Filters */}
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="w-24">
                                    <label className="text-xs font-medium text-gray-400 mb-1 block">Width</label>
                                    <input
                                        type="text"
                                        value={filters.width}
                                        onChange={(e) => setFilters(prev => ({ ...prev, width: e.target.value }))}
                                        placeholder="205"
                                        className="w-full bg-surface-dark border border-border-dark text-white text-sm rounded-lg p-2.5"
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="text-xs font-medium text-gray-400 mb-1 block">Ratio</label>
                                    <input
                                        type="text"
                                        value={filters.ratio}
                                        onChange={(e) => setFilters(prev => ({ ...prev, ratio: e.target.value }))}
                                        placeholder="55"
                                        className="w-full bg-surface-dark border border-border-dark text-white text-sm rounded-lg p-2.5"
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="text-xs font-medium text-gray-400 mb-1 block">Rim</label>
                                    <input
                                        type="text"
                                        value={filters.rim}
                                        onChange={(e) => setFilters(prev => ({ ...prev, rim: e.target.value }))}
                                        placeholder="16"
                                        className="w-full bg-surface-dark border border-border-dark text-white text-sm rounded-lg p-2.5"
                                    />
                                </div>
                            </div>

                            <button className="bg-primary hover:bg-primary-hover text-black font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined">filter_alt</span>
                                Apply
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="overflow-y-auto p-6 flex-1 scrollbar-thin">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                        {displayedProducts.map((product) => (
                            <div key={product.id} className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden group hover:border-primary/50 transition-all duration-300 flex flex-col">
                                <div className="relative h-48 bg-white p-4 flex items-center justify-center">
                                    {product.badge && (
                                        <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded ${product.badge === 'Best Seller' ? 'bg-primary text-black' : 'bg-black text-primary'
                                            }`}>
                                            {product.badge}
                                        </div>
                                    )}
                                    {/* Placeholder for image since actual files are missing */}
                                    <div className="h-full w-full flex items-center justify-center text-gray-300">
                                        <span className="material-symbols-outlined text-6xl">auto_parts</span>
                                    </div>

                                    <div className="absolute bottom-2 right-2 flex gap-1 text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`material-symbols-outlined text-sm ${i < 4 ? 'icon-filled' : ''}`}>
                                                star
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{product.brand_title || 'Generic'}</h4>
                                            <h3 className="text-lg font-bold text-white leading-tight line-clamp-2" title={product.name}>{product.name}</h3>
                                        </div>
                                        <div className="text-right shrink-0 ml-2">
                                            <div className="text-xl font-bold text-primary">₱{product.price.toFixed(2)}</div>
                                            <div className="text-xs text-gray-500">each</div>
                                        </div>
                                    </div>
                                    <div className="bg-background-dark rounded-lg p-2 mb-4 border border-border-dark">
                                        <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-xs">
                                            <div className="text-gray-500">Part #:</div>
                                            <div className="text-white font-mono font-medium text-right truncate" title={product.model_number}>{product.model_number || product.specs?.partNumber || '-'}</div>
                                            <div className="text-gray-500">Position:</div>
                                            <div className="text-white font-mono font-medium text-right truncate" title={product.position}>{product.position || '-'}</div>
                                            <div className="text-gray-500">Vehicle:</div>
                                            <div className="text-white font-mono font-medium text-right truncate" title={product.vehicle_model}>{product.vehicle_model || '-'}</div>
                                        </div>
                                    </div>
                                    <div className="mt-auto space-y-3">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={`w-2 h-2 rounded-full ${(inventory[product.id] ?? product.stock) > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                                                }`}></span>
                                            <span className={`font-medium ${(inventory[product.id] ?? product.stock) > 0 ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                {(inventory[product.id] ?? product.stock) > 5 ? `In Stock (${inventory[product.id] ?? product.stock})` :
                                                    (inventory[product.id] ?? product.stock) > 0 ? `Low Stock (${inventory[product.id] ?? product.stock})` : 'Out of Stock'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button className="bg-surface-darker hover:bg-border-dark text-white border border-border-dark py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                                                Quote
                                            </button>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="bg-primary hover:bg-primary-hover text-black py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-lg shadow-primary/10 active:scale-95"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                                                Add to POS
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {displayedProducts.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center text-center text-gray-500 min-h-[350px]">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                                <span className="text-lg">No products found</span>
                                <p className="text-sm mt-2">Try adjusting your filters or search query.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                <div className="p-4 bg-surface-dark border-t border-border-dark flex justify-between items-center z-10">
                    <div className="text-sm text-gray-400">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 bg-background-dark border border-border-dark rounded-lg text-white disabled:opacity-50 hover:bg-surface-darker transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 bg-background-dark border border-border-dark rounded-lg text-white disabled:opacity-50 hover:bg-surface-darker transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default CatalogView;
