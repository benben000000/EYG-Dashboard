import catalogData from '../data/bendix_catalog.json';
import { Product } from '../types';

// Type definition for the raw JSON structure
interface CatalogRaw {
    catalog_info: {
        brand_titles: string[];
        sub_categories: string[];
        currency: string;
        total_parts: number;
        vehicle_brands: string[];
    };
    parts: Array<{
        id: number;
        model_number: string;
        position: string;
        vehicle_brand: string;
        vehicle_model: string;
        year_from: number | null;
        year_to: number | null;
        gross_price: number;
        brand_title: string;
        sub_category: string;
        source: string;
        search_key: string;
        year_display: string;
        position_full: string;
        description: string;
        oe_number: string;
    }>;
}

const rawData = catalogData as CatalogRaw;

// Transform raw parts to Product type
const products: Product[] = rawData.parts.map(part => ({
    id: part.id,
    name: `${part.brand_title} ${part.sub_category} - ${part.vehicle_model}`,
    description: part.description || `${part.position_full} ${part.sub_category} for ${part.vehicle_brand} ${part.vehicle_model}`,
    category: 'Auto Parts',
    sub_category: part.sub_category,
    brand_title: part.brand_title,
    price: part.gross_price || 0,
    image: '', // Placeholder, will handle images later
    stock: 100, // Mock stock
    status: 'In Stock',
    specs: {
        partNumber: part.model_number || '',
        position: part.position_full || ''
    },
    // Extended fields
    model_number: part.model_number,
    position: part.position,
    vehicle_brand: part.vehicle_brand || '',
    vehicle_model: part.vehicle_model || '',
    year_from: part.year_from,
    year_to: part.year_to,
    year_display: part.year_display || '',
    oe_number: part.oe_number || '',
    search_key: part.search_key?.toLowerCase() || ''
}));

export const CatalogService = {
    getAllProducts: (): Product[] => {
        return products;
    },

    getFilters: () => {
        return {
            brands: rawData.catalog_info.brand_titles,
            categories: rawData.catalog_info.sub_categories,
            vehicleBrands: rawData.catalog_info.vehicle_brands.filter(b => b) // Filter empty strings
        };
    },

    searchProducts: (query: string, filters?: { brand?: string; category?: string; vehicleBrand?: string }): Product[] => {
        let result = products;
        const lowerQuery = query.toLowerCase();

        if (query) {
            result = result.filter(p =>
                (p.name || '').toLowerCase().includes(lowerQuery) ||
                (p.search_key || '').includes(lowerQuery) ||
                (p.vehicle_model || '').toLowerCase().includes(lowerQuery) ||
                (p.model_number || '').toLowerCase().includes(lowerQuery) ||
                (p.oe_number || '').toLowerCase().includes(lowerQuery)
            );
        }

        if (filters) {
            if (filters.brand && filters.brand !== 'All Brands') {
                result = result.filter(p => p.brand_title === filters.brand);
            }
            if (filters.category && filters.category !== 'All Categories') {
                result = result.filter(p => p.sub_category === filters.category);
            }
            if (filters.vehicleBrand && filters.vehicleBrand !== 'All Makes') {
                result = result.filter(p => p.vehicle_brand === filters.vehicleBrand);
            }
        }

        return result;
    },

    getProductById: (id: string | number): Product | undefined => {
        return products.find(p => p.id === id);
    }
};
