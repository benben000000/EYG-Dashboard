import { Product, CartItem } from './types';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Michelin Defender T+H',
        description: '205/55R16 • 91H • 80,000 Mile Warranty',
        category: 'Tires',
        price: 178.99,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKpiOIw7w9IO1zweMHaQqxVzvsuFNCpjEvV68033XtEdLc7_7fr0z17jAJAJDKq5MPDCjWnUYmuGlBtLZ0k__5kL9-prbHguoOohqyp8qvZqsbtujmlz4wDTCzmP4sKz6aKiMSI3kQGjFrAiJnjoAEjl4meueoFBiFun6Z-4WsxRNT1wPByNUT2DanwscdmbQqyArV7qMPxXo58IG2s_e3yr6LsfBGKZ8i1xJMEGxAgqQt8hMU_izrL4qeHnM8zoHU5f8lLNJZyK0',
        sku: 'SKU-9921',
        stock: 4,
        unitCost: 110.00,
        status: 'Low Stock',
        rating: 4.5,
        reviewCount: 42,
        badge: 'Best Seller',
        specs: {
            size: '205/55R16',
            loadSpeed: '91H',
            partNumber: 'MCH-34812',
            utqg: '820 A B'
        }
    },
    {
        id: '2',
        name: 'Bridgestone Turanza QuietTrack',
        description: 'Premium Touring Tire',
        category: 'Tires',
        price: 182.50,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3wz9KvrTTK9B9oyR0YJrGOGIMdyGmME7UQnVPMrcL8IaNfISghECeo_2EDVh1MC74uDsm1DeUgGwsCn4FGmDP6CrZSMPBu7-VxoIKYU_YC9j0r8s5PKcUHKTb1K-3aNtFDaDSA_DriBZ-Obut-Bicny7y4Ph7WuBf4NLSdAw4LBq2PI1itfTEbv5zkxVQ2sPRumrmIr9K1nKcjzio6dcvq8qrn2MGJXEPfllIPfGkvfL5jAWKQ0SStUh02ukzB4dZqJSOmdp6RVs',
        sku: 'SKU-8842',
        stock: 2,
        unitCost: 120.00,
        status: 'Low Stock',
        rating: 5,
        reviewCount: 18,
        specs: {
            size: '205/55R16',
            loadSpeed: '91V',
            partNumber: 'BST-00129',
            utqg: '800 A A'
        }
    },
    {
        id: '3',
        name: 'Goodyear Assurance MaxLife',
        description: 'Long lasting all-season',
        category: 'Tires',
        price: 154.99,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHxx9PcC2YiwTj5DvntgJYUq8FNnS56aXl91RRCuQta2-BtFFvq2IIlVhtnG-qEsPpELnhEuBAiLlLWodYFCYVOzmq8TIErXxny8n1ZohIE5qp9MzdEc9cIPjet-PW-W9JPZuo7TdimeKp6rmkJv_liwlGqstLh5Lqe0eFs33DICuaAXaHxTCOMzOtKdr72WMIyw9nOgtN1V19VzQHGhfsAEufAicIX6PU6PJrmw71QMUl3Kt4mytmYN_KFVZLwjHdNG4eaS3vmPI',
        sku: 'SKU-7721',
        stock: 0,
        unitCost: 98.50,
        status: 'Order',
        rating: 4.5,
        reviewCount: 5,
        specs: {
            size: '205/55R16',
            loadSpeed: '91H',
            partNumber: 'GDY-9921',
            utqg: '820 A B'
        }
    },
    {
        id: '4',
        name: 'General Tire Altimax RT43',
        description: 'Reliable Touring All-Season',
        category: 'Tires',
        price: 124.99,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4QBxoQx74D4PYzZhhxLmMM1bx2VbsSkMKYl_uG0YYkh3yYy9_G8dO3O7t40P5vFuhJVIkE1Mm5MF4uMIXmmb601UzoQQAoWZAgwCX3ybMcFIhgrRWH8IQcQvAJhjjtWsec5ZoDdeD2xKGrbbekuxbjoexomzGwqG9qak1byAMveK6dagVVxN94TNr2W6Qcaiaz44W7nF4qkrPwQqfFaPL8pDcAgbx1Xlxk8IU0Zc0rYzVDA0H6HBvhIrjHI8litRpfngKNRgGQ_s',
        sku: 'SKU-1234',
        stock: 36,
        unitCost: 85.00,
        status: 'In Stock',
        rating: 4,
        reviewCount: 89,
        badge: 'Budget Pick',
        specs: {
            size: '205/55R16',
            loadSpeed: '91H',
            partNumber: 'GEN-1234',
            utqg: '700 A A'
        }
    },
    {
        id: '5',
        name: 'Castrol GTX Motor Oil',
        description: '5QT Jug',
        category: 'Fluids',
        price: 28.99,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuuE8FTResKxYf_3P4Gtl0Hj66Wlvdg1R7n6JDpZl6b1LPzkVhgkXNzbDpAG9DCGuVQe3FqjqqoaKVwoARwUw7diAcRsVzH0fS-e70r2ZGclAc2k3LHqPhDnHpzJjKfN4hEMjp7nWkRIt7bGKk0JKdq0Nd8G-mLsOSIXwpDgXcbv3R0xu6_gzl619Z5fGL9tCkqtLzgCPT4hpu7s7lJw3h2lE7exG8JnJMn9JSpR_QudYo1tm4ljg3FWmp7ieoZiq58zzEdFMdkYE',
        sku: 'SKU-5541',
        stock: 45,
        unitCost: 18.50,
        status: 'In Stock',
        specs: {}
    },
    {
        id: '6',
        name: 'Brake Pad Set - Ceramic',
        description: 'Front Axle',
        category: 'Parts',
        price: 65.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3x3_x3x3_x3x3', // Placeholder or use icon
        sku: 'SKU-1102',
        stock: 0,
        unitCost: 32.00,
        status: 'Out of Stock',
        specs: {}
    }
];

export const INITIAL_CART: CartItem[] = [
    {
        ...MOCK_PRODUCTS[0],
        quantity: 4,
        price: 148.99, // Overridden price example
        type: 'tire'
    },
    {
        id: 'service-1',
        name: 'Mount & Balance',
        description: 'Standard Installation Package',
        category: 'Labor',
        price: 20.00,
        image: '',
        sku: 'LBR-MB',
        stock: 999,
        unitCost: 0,
        status: 'In Stock',
        quantity: 4,
        type: 'labor'
    },
    {
        id: 'part-1',
        name: 'TPMS Service Kit',
        description: 'Valve Stem & Seal Replacement',
        category: 'Parts',
        price: 5.00,
        image: '',
        sku: 'PRT-TPMS',
        stock: 100,
        unitCost: 1.50,
        status: 'In Stock',
        quantity: 4,
        type: 'part'
    }
];

export const CHART_DATA = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 5500 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 7800 },
    { name: 'May', value: 6500 },
    { name: 'Jun', value: 9500 },
];
