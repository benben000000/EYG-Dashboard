export type ViewState = 'dashboard' | 'catalog' | 'pos' | 'inventory' | 'orders' | 'customers' | 'settings';

export interface Product {
    id: string | number;
    name: string;
    description: string;
    category?: string;
    sub_category?: string;
    brand_title?: string;
    price: number;
    image?: string;
    sku?: string;
    stock: number;
    unitCost?: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Order';
    specs?: {
        size?: string;
        loadSpeed?: string;
        partNumber?: string;
        utqg?: string;
    };
    // New fields from bendix_catalog.json
    model_number?: string;
    position?: string;
    vehicle_brand?: string;
    vehicle_model?: string;
    year_from?: number | null;
    year_to?: number | null;
    year_display?: string;
    oe_number?: string;
    search_key?: string;
    
    rating?: number;
    reviewCount?: number;
    badge?: string;
}

export interface CartItem extends Product {
    quantity: number;
    type: 'part' | 'labor' | 'tire';
}

export interface SaleRecord {
    id: string;
    date: string;
    total: number;
    items: CartItem[];
    paymentMethod: string;
    customerName?: string;
}
