import React, { useMemo, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { CHART_DATA } from '../constants';
import { useStore } from '../context/StoreContext';
import { CatalogService } from '../services/CatalogService';

const DashboardView: React.FC = () => {
    const { salesHistory, inventory } = useStore();
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // Calculate Stats
    const stats = useMemo(() => {
        const totalSales = salesHistory.reduce((sum, sale) => sum + sale.total, 0);
        const totalOrders = salesHistory.length;

        // Calculate inventory value (mock calculation since we don't have cost for all, assuming static 100 stock for now)
        const products = CatalogService.getAllProducts();
        const totalItems = products.length;
        // Mock refined inventory count based on StoreContext inventory updates
        const currentInventoryCount = products.reduce((acc, p) => {
            return acc + (inventory[p.id] ?? p.stock);
        }, 0);

        // Simple mock value
        const totalValue = totalSales * 1.5; // Just a placeholder formula

        return { totalSales, totalOrders, totalItems, currentInventoryCount, totalValue };
    }, [salesHistory, inventory]);

    // Get Products for Table
    const allProducts = useMemo(() => CatalogService.getAllProducts(), []);
    const displayedProducts = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return allProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [allProducts, page]);

    const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background-dark">
            {/* Header */}
            <header className="h-16 shrink-0 border-b border-border-dark flex items-center justify-between px-6 bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-2 text-sm text-text-subtle">
                    <span>Admin</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-white font-medium">Growth Dashboard</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-text-subtle hover:text-white rounded-full hover:bg-surface-dark transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="h-8 w-[1px] bg-border-dark"></div>
                    <button className="flex items-center gap-2 bg-primary hover:bg-yellow-400 text-background-dark px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-primary/10">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Add New Item
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Sales Trend Chart */}
                    <div className="lg:col-span-2 bg-surface-dark p-6 rounded-xl border border-border-dark flex flex-col h-80 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-white text-lg font-bold">Sales Trend</h3>
                                <p className="text-text-subtle text-xs">Monthly Revenue Growth</p>
                            </div>
                            <div className="flex items-center gap-2 bg-green-900/30 px-3 py-1 rounded-full border border-green-500/20">
                                <span className="material-symbols-outlined text-green-400 text-sm">trending_up</span>
                                <span className="text-green-400 text-sm font-bold">+12.5%</span>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={CHART_DATA}>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#cbc190', fontSize: 10 }}
                                        dy={10}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#36321d' }}
                                        contentStyle={{ backgroundColor: '#221f10', borderColor: '#3a3520', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#f4d125' }}
                                    />
                                    <Bar dataKey="value" fill="#f4d125" radius={[4, 4, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <div className="bg-surface-dark p-6 rounded-xl border border-border-dark h-80 flex flex-col">
                        <h3 className="text-white text-lg font-bold mb-4">Top Selling Products</h3>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                            {[
                                { rank: 1, name: 'Michelin Defender', sold: 124, revenue: '18.2k' },
                                { rank: 2, name: 'Synth. Oil Change', sold: 89, revenue: '6.4k' },
                                { rank: 3, name: 'Brake Svc Pack', sold: 56, revenue: '12.1k' },
                                { rank: 4, name: 'Goodyear Assurance', sold: 42, revenue: '5.8k' },
                            ].map((item) => (
                                <div key={item.rank} className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded bg-white/5 flex items-center justify-center font-bold text-lg ${item.rank === 1 ? 'text-primary' : 'text-white/50'}`}>
                                        {item.rank}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white text-sm font-medium">{item.name}</p>
                                        <p className="text-text-subtle text-xs">{item.sold} units sold</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white text-sm font-bold">₱{item.revenue}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col gap-6 h-80">
                        {/* Overall Sales */}
                        <div className="bg-surface-dark p-5 rounded-xl border border-border-dark flex-1 relative overflow-hidden flex flex-col justify-center">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-text-subtle text-xs font-medium uppercase tracking-wider">Total Revenue</p>
                                    <h3 className="text-white text-3xl font-bold mt-1">₱{stats.totalSales.toLocaleString()}</h3>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <span className="material-symbols-outlined text-primary">attach_money</span>
                                </div>
                            </div>
                            <p className="text-xs text-text-subtle mt-2">{stats.totalOrders} Transactions</p>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-surface-dark p-5 rounded-xl border border-border-dark flex-1 relative overflow-hidden flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                <h4 className="text-white font-bold">Recent Activity</h4>
                            </div>
                            <div className="space-y-2 mt-1">
                                {salesHistory.slice(0, 2).map(sale => (
                                    <div key={sale.id} className="flex justify-between text-xs">
                                        <span className="text-gray-400">{sale.id}</span>
                                        <span className="text-white font-medium">₱{sale.total.toFixed(2)}</span>
                                    </div>
                                ))}
                                {salesHistory.length === 0 && <span className="text-xs text-gray-500">No recent sales</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-surface-dark p-4 rounded-xl border border-border-dark flex items-center justify-between">
                        <div>
                            <p className="text-text-subtle text-xs font-medium">Total Items</p>
                            <h3 className="text-white text-2xl font-bold">{stats.totalItems.toLocaleString()}</h3>
                        </div>
                        <span className="material-symbols-outlined text-4xl text-white/10">inventory_2</span>
                    </div>
                    <div className="bg-surface-dark p-4 rounded-xl border border-border-dark flex items-center justify-between">
                        <div>
                            <p className="text-text-subtle text-xs font-medium">Total Count in Stock</p>
                            <h3 className="text-white text-2xl font-bold">{stats.currentInventoryCount.toLocaleString()}</h3>
                        </div>
                        <span className="material-symbols-outlined text-4xl text-primary/50">layers</span>
                    </div>
                    <div className="bg-surface-dark p-4 rounded-xl border border-border-dark flex items-center justify-between">
                        <div>
                            <p className="text-text-subtle text-xs font-medium">Est. Inventory Value</p>
                            <h3 className="text-white text-2xl font-bold">₱{stats.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
                        </div>
                        <span className="material-symbols-outlined text-4xl text-white/10">savings</span>
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pt-2">
                        <div className="flex items-center p-1 bg-surface-dark rounded-lg border border-border-dark">
                            <button className="px-4 py-1.5 rounded-md bg-primary text-background-dark text-sm font-bold shadow-sm">All Items</button>
                            <button className="px-4 py-1.5 rounded-md text-text-subtle hover:text-white text-sm font-medium transition-colors">Tires</button>
                            <button className="px-4 py-1.5 rounded-md text-text-subtle hover:text-white text-sm font-medium transition-colors">Parts</button>
                            <button className="px-4 py-1.5 rounded-md text-text-subtle hover:text-white text-sm font-medium transition-colors">Service Kits</button>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="relative group w-full md:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-text-subtle group-focus-within:text-primary transition-colors">search</span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-2 border border-border-dark rounded-lg leading-5 bg-surface-dark text-white placeholder-text-subtle focus:outline-none focus:bg-surface-darker focus:border-primary sm:text-sm transition-all"
                                    placeholder="Search SKU, Brand, Name..."
                                    type="text"
                                />
                            </div>
                            <button className="hidden md:flex items-center gap-2 px-3 py-2 border border-border-dark rounded-lg bg-surface-dark text-text-subtle hover:text-white hover:border-white/20 transition-all text-sm font-medium">
                                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                                Filter
                            </button>
                        </div>
                    </div>

                    <div className="w-full overflow-hidden rounded-xl border border-border-dark bg-surface-dark/50 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-dark text-text-subtle text-xs uppercase tracking-wider border-b border-border-dark">
                                        <th className="px-6 py-4 font-semibold">Product Name</th>
                                        <th className="px-6 py-4 font-semibold">Size / Spec</th>
                                        <th className="px-6 py-4 font-semibold">SKU</th>
                                        <th className="px-6 py-4 font-semibold text-right">Stock</th>
                                        <th className="px-6 py-4 font-semibold text-right">Unit Cost</th>
                                        <th className="px-6 py-4 font-semibold text-right">Retail Price</th>
                                        <th className="px-6 py-4 font-semibold text-center">Status</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-dark text-sm">
                                    {displayedProducts.map((product) => (
                                        <tr key={product.id} className="group hover:bg-surface-dark transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-md bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                        {product.image && product.image.startsWith('http') ? (
                                                            <img src={product.image} alt={product.name} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                        ) : (
                                                            <span className="material-symbols-outlined text-text-subtle">inventory_2</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{product.name}</p>
                                                        <p className="text-xs text-text-subtle">{product.brand_title || product.category || 'Part'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{product.specs?.size || product.specs?.partNumber || product.model_number || '-'}</td>
                                            <td className="px-6 py-4 text-text-subtle font-mono text-xs">{product.sku || product.oe_number || product.id}</td>
                                            <td className={`px-6 py-4 text-right font-medium ${(inventory[product.id] ?? product.stock) < 5 ? ((inventory[product.id] ?? product.stock) === 0 ? 'text-red-400' : 'text-primary') : 'text-white'}`}>
                                                {inventory[product.id] ?? product.stock}
                                            </td>
                                            <td className="px-6 py-4 text-right text-text-subtle">₱{(product.unitCost ?? 0).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right text-white font-medium">₱{product.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.status === 'In Stock' ? 'bg-green-900/40 text-green-400 border-green-500/20' :
                                                    product.status === 'Low Stock' ? 'bg-primary/20 text-primary border-primary/20' :
                                                        product.status === 'Order' ? 'bg-blue-900/40 text-blue-400 border-blue-500/20' :
                                                            'bg-red-900/40 text-red-400 border-red-500/20'
                                                    }`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-text-subtle hover:text-white transition-colors p-1 rounded hover:bg-white/10">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between px-6 py-4 border-t border-border-dark bg-surface-dark">
                            <div className="text-sm text-text-subtle">
                                Showing <span className="font-medium text-white">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-white">{Math.min(page * ITEMS_PER_PAGE, allProducts.length)}</span> of <span className="font-medium text-white">{allProducts.length}</span> results
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1 text-sm text-text-subtle border border-border-dark rounded hover:bg-white/5 hover:text-white disabled:opacity-50 transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-text-subtle text-sm">Page {page} of {totalPages}</span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-3 py-1 text-sm text-text-subtle border border-border-dark rounded hover:bg-white/5 hover:text-white disabled:opacity-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardView;
