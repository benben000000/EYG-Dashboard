import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import CatalogView from './views/CatalogView';
import POSView from './views/POSView';
import { ViewState } from './types';
import { StoreProvider } from './context/StoreContext';

const AppContent: React.FC = () => {
    const [currentView, setCurrentView] = useState<ViewState>('dashboard');

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardView />;
            case 'catalog':
                return <CatalogView />;
            case 'pos':
                return <POSView />;
            case 'inventory':
            case 'orders':
            case 'customers':
            default:
                // Fallback for not-yet-implemented views, reusing Dashboard layout for demo
                return (
                    <div className="flex items-center justify-center h-full bg-background-dark text-text-subtle">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-6xl mb-4 opacity-50">construction</span>
                            <h2 className="text-2xl font-bold text-white">Under Construction</h2>
                            <p className="mt-2">The {currentView} view is currently being built.</p>
                            <button
                                onClick={() => setCurrentView('dashboard')}
                                className="mt-6 px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary-hover transition-colors"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen w-full bg-background-dark text-white overflow-hidden">
            <Sidebar currentView={currentView} onChangeView={setCurrentView} />

            {/* Mobile Header (Only visible on small screens) */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface-dark border-b border-border-dark flex items-center px-4 z-50">
                <button className="text-white p-2">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <span className="ml-4 font-bold text-lg text-primary">EYG TIRE</span>
            </div>

            <div className="flex-1 flex flex-col min-w-0 md:relative pt-16 md:pt-0">
                {/* Top Search Bar is inside specific views for this design, 
                    except Catalog which has its own nav structure in the screenshots.
                    We render the main view content directly here. 
                */}
                {currentView === 'catalog' ? (
                    // Catalog view needs full width including top nav area replacement
                    renderView()
                ) : (
                    // Dashboard and POS handle their own internal layout structure perfectly
                    renderView()
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <StoreProvider>
            <AppContent />
        </StoreProvider>
    );
};

export default App;
