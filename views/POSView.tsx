import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CatalogService } from '../services/CatalogService';
import { Product } from '../types';

const POSView: React.FC = () => {
    const { cart, removeFromCart, updateCartItemQuantity, completeSale, addToCart, clearCart } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Payment State
    const [amountPaid, setAmountPaid] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('Cash');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Search Logic
    useEffect(() => {
        if (searchQuery.trim().length > 1) {
            const results = CatalogService.searchProducts(searchQuery).slice(0, 5); // Limit to 5 results
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleAddToCartFromSearch = (product: Product) => {
        const type = product.sub_category?.toLowerCase().includes('tire') ? 'tire' : 'part';
        addToCart(product, type);
        setSearchQuery(''); // Clear search after adding
    };

    // Quick Add Categories (Top Selling / Common)
    const quickCategories = ['All', 'Tires', 'Oil', 'Brakes', 'Batteries', 'Wipers'];

    // Calculations
    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);
    const taxRate = 0.0825;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    const change = amountPaid ? parseFloat(amountPaid) - total : 0;

    const handleCheckout = () => {
        completeSale(paymentMethod, 'Walk-in Customer');
        setIsPaymentModalOpen(false);
        setAmountPaid('');
    };

    return (
        <div className="flex flex-col lg:flex-row h-full bg-background-dark overflow-hidden">
            {/* Left Side: Product Selection & Search */}
            <div className="flex-1 flex flex-col border-r border-border-dark overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-border-dark bg-surface-dark z-20 relative">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Search Item Name, SKU, or Scan Barcode..."
                            className="w-full bg-background-dark border border-border-dark text-white rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-3.5 text-gray-500 hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        )}
                    </div>

                    {/* Search Dropdown */}
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-surface-dark border border-border-dark rounded-b-xl shadow-2xl mt-1 overflow-hidden z-50">
                            {searchResults.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => handleAddToCartFromSearch(product)}
                                    className="w-full text-left p-3 hover:bg-white/10 flex items-center gap-3 border-b border-white/5 last:border-0 transition-colors"
                                >
                                    <div className="h-10 w-10 bg-white/5 rounded flex items-center justify-center">
                                        <span className="material-symbols-outlined text-gray-400">inventory_2</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white font-medium text-sm">{product.name}</div>
                                        <div className="text-xs text-gray-400">{product.model_number || product.sku}</div>
                                    </div>
                                    <div className="text-primary font-bold">₱{product.price.toFixed(2)}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Categories */}
                <div className="p-2 border-b border-border-dark bg-surface-dark/50 flex gap-2 overflow-x-auto scrollbar-none">
                    {quickCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                : 'bg-surface-dark text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid (Common Items) */}
                <div className="flex-1 overflow-y-auto p-4 bg-background-dark scrollbar-thin">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {CatalogService.getAllProducts()
                            .filter(p => selectedCategory === 'All' || p.category === selectedCategory || p.sub_category === selectedCategory)
                            .slice(0, 20) // Show top 20 for quick access
                            .map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleAddToCartFromSearch(product)}
                                    className="bg-surface-dark p-3 rounded-xl border border-border-dark hover:border-primary/50 hover:bg-surface-darker transition-all group text-left flex flex-col h-full"
                                >
                                    <div className="h-24 w-full bg-white/5 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                                        <span className="material-symbols-outlined text-4xl text-gray-600 group-hover:text-primary transition-colors">
                                            {product.category === 'Services' ? 'build' : 'auto_parts'}
                                        </span>
                                    </div>
                                    <h4 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">{product.name}</h4>
                                    <div className="mt-auto flex justify-between items-end">
                                        <p className="text-xs text-gray-400">{product.sku || product.model_number}</p>
                                        <span className="text-primary font-bold text-sm bg-primary/10 px-2 py-0.5 rounded">₱{product.price.toFixed(2)}</span>
                                    </div>
                                </button>
                            ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Cart Summary & Checkout */}
            <div className="w-full lg:w-[450px] bg-surface-dark flex flex-col h-[50vh] lg:h-full shadow-2xl z-10">
                {/* Header */}
                <div className="p-4 border-b border-border-dark flex justify-between items-center bg-surface-darker">
                    <div>
                        <h2 className="text-xl font-bold text-white">Current Order</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Online • Walk-in Customer
                        </div>
                    </div>
                    <button
                        onClick={clearCart}
                        className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Clear Cart"
                    >
                        <span className="material-symbols-outlined">delete_sweep</span>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin bg-surface-dark">
                    {cart.map((item) => (
                        <div key={item.id} className="bg-background-dark/50 p-3 rounded-xl border border-border-dark flex gap-3 group hover:border-white/10 transition-colors">
                            <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-gray-500">
                                    {item.type === 'labor' ? 'build' : 'inventory_2'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-white font-medium text-sm truncate pr-2">{item.name}</h4>
                                    <span className="text-white font-bold text-sm cursor-pointer hover:text-primary transition-colors">
                                        ₱{(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">{item.specs?.size || 'Standard'}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 bg-surface-dark rounded-lg p-1 border border-white/5">
                                        <button
                                            onClick={() => updateCartItemQuantity(item.id, -1)}
                                            className="w-6 h-6 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-xs">remove</span>
                                        </button>
                                        <span className="text-sm font-bold text-white w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateCartItemQuantity(item.id, 1)}
                                            className="w-6 h-6 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-xs">add</span>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-500 hover:text-red-400 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity px-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {cart.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                            <span className="material-symbols-outlined text-6xl mb-2">shopping_cart_off</span>
                            <p>Cart is empty</p>
                        </div>
                    )}
                </div>

                {/* Totals Section */}
                <div className="bg-surface-darker p-6 border-t border-border-dark shrink-0">
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Subtotal</span>
                            <span className="text-white font-mono">₱{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Tax (8.25%)</span>
                            <span className="text-white font-mono">₱{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Discount</span>
                            <span className="text-green-400 font-mono">-₱0.00</span>
                        </div>
                        <div className="h-px bg-border-dark my-2"></div>
                        <div className="flex justify-between items-end">
                            <span className="text-lg font-bold text-white">Total</span>
                            <span className="text-3xl font-bold text-primary font-mono">₱{total.toFixed(2)}</span>
                        </div>
                    </div>

                    {!isPaymentModalOpen ? (
                        <button
                            disabled={cart.length === 0}
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>Charge ₱{total.toFixed(2)}</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    ) : (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                {['Cash', 'Card', 'Check'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`py-2 rounded-lg text-sm font-bold border ${paymentMethod === method ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'}`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl font-bold bg-surface-dark border border-gray-600 text-white hover:bg-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    className="flex-[2] py-3 rounded-xl font-bold bg-green-500 text-black hover:bg-green-400 shadow-lg shadow-green-500/20"
                                >
                                    Confirm Payment
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default POSView;
