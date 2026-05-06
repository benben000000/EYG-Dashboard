import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
    currentView: ViewState;
    onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
    const navItems: { id: ViewState; label: string; icon: string }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'inventory', label: 'Inventory', icon: 'inventory_2' },
        { id: 'catalog', label: 'Catalog Search', icon: 'search' },
        { id: 'pos', label: 'POS', icon: 'point_of_sale' },
        { id: 'orders', label: 'Orders', icon: 'receipt_long' },
        { id: 'customers', label: 'Customers', icon: 'people' },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border-dark bg-surface-darker h-full z-20">
            {/* Logo */}
            <div className="h-20 flex items-center px-6 border-b border-border-dark">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black font-bold text-xl">
                        <span className="material-symbols-outlined">tire_repair</span>
                    </div>
                    <div>
                        <h1 className="font-display italic text-lg leading-none tracking-wider text-white uppercase">EYG TIRE</h1>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">& Auto Care</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="mt-6 px-4 space-y-2 flex-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onChangeView(item.id)}
                            className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                                isActive 
                                    ? 'bg-primary text-black' 
                                    : 'text-text-subtle hover:bg-surface-dark hover:text-white'
                            }`}
                        >
                            <span className={`material-symbols-outlined mr-3 ${isActive ? 'text-black' : 'text-text-subtle group-hover:text-white'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-border-dark">
                <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-surface-dark cursor-pointer transition-colors group">
                    <div className="relative">
                        <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnkewTgMghEWzgc4eLM0ek-vYljRl15itrzZK0gw8K_rHSSTGCVR_6fATPuUtTuWJIMM2XQJ7q5lgIleaZ_QLQ5Glx4mZVZfh_nim1pz_RSDbp4v4H581jF9r2UncHfoyz4xd5nyKHCdF-U5Wg25XMITafiYHulDqXK9rFYFeZbDycjqWd__Dy7SluBroDk4W3knSXzAmnRxUcdE7Ai5xfXj6Aozvc_LGWieaURYLEYO4A0JS4MrLGBGyrFYO_OCXQ6ekTv8xx6HM" 
                            alt="User avatar" 
                            className="h-9 w-9 rounded-full object-cover border border-gray-600" 
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-black"></div>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
                            Mike Mechanic
                        </p>
                        <p className="text-xs text-text-subtle truncate">
                            Manager
                        </p>
                    </div>
                    <span className="material-symbols-outlined text-text-subtle text-sm">settings</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
