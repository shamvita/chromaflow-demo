import React from 'react';
import { Info, Search } from 'lucide-react';
import type { ProductItem } from './types';
import { CATEGORY_LABELS } from './constants';

interface ProductGridProps {
    products: ProductItem[];
    onProductClick: (product: ProductItem) => void;
    activeCategory: string;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    onProductClick,
    activeCategory,
    searchTerm,
    onSearchChange,
}) => {
    // Filter products based on search term
    const filteredProducts = products.filter((p) => {
        const term = searchTerm.toLowerCase();
        return (
            p.name.toLowerCase().includes(term) ||
            p.code?.toLowerCase().includes(term) ||
            p.subcategory.toLowerCase().includes(term)
        );
    });

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-950/50">
            {/* Search Header */}
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-950/90 backdrop-blur-md z-10">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={`Buscar en ${CATEGORY_LABELS[activeCategory as keyof typeof CATEGORY_LABELS] || activeCategory}...`}
                    className="input-control w-full max-w-md placeholder-zinc-500"
                    autoFocus
                />
                <div className="text-zinc-500 text-sm font-medium">
                    {filteredProducts.length} productos
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {filteredProducts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-60">
                        <Search size={48} className="mb-4 text-zinc-700" />
                        <p>No se encontraron productos</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredProducts.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => onProductClick(product)}
                                className="group relative flex flex-col items-center text-center p-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 hover:border-zinc-600 transition-all active:scale-[0.98]"
                            >
                                <div
                                    className="w-16 h-16 rounded-full shadow-lg border-2 border-white/5 mb-4 transition-transform group-hover:scale-110 relative"
                                    style={{ backgroundColor: product.color }}
                                >
                                    {/* Unique indicator for Formulas */}
                                    {product.formula && (
                                        <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1 border-2 border-zinc-900 shadow-lg">
                                            <Info size={10} strokeWidth={3} />
                                        </div>
                                    )}
                                </div>

                                <div className="w-full">
                                    <span className="text-[10px] uppercase tracking-widest font-black text-zinc-500 mb-1 block truncate">
                                        {product.subcategory}
                                    </span>
                                    <h3 className="text-sm font-bold text-zinc-200 mb-1 line-clamp-2 leading-tight group-hover:text-white h-10 flex items-center justify-center">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        {product.code && (
                                            <span className="text-[10px] font-mono bg-zinc-950 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-800">
                                                {product.code}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 w-full flex items-center justify-between border-t border-white/5 pt-3 text-left">
                                    {(product.formula || product.category === 'personalizados') ? (
                                        <div className="text-xs font-bold text-emerald-400 truncate max-w-[60%]">
                                            {product.formula?.containerName?.replace(/Envase\s?/i, '') || 'Fórmula'}
                                        </div>
                                    ) : (
                                        <div className={`text-xs font-bold transition-colors ${product.stock < (product.unit === 'kg' ? 2 : 5)
                                                ? 'text-red-500 animate-pulse'
                                                : product.stock < (product.unit === 'kg' ? 5 : 10)
                                                    ? 'text-amber-500'
                                                    : 'text-zinc-500'
                                            }`}>
                                            {product.stock} <span className="text-[10px]">{product.unit || 'u'}</span>
                                        </div>
                                    )}
                                    <div className="text-sm font-mono font-bold text-emerald-400">
                                        ${product.price ? product.price.toFixed(2) : '0.00'}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};



export default ProductGrid;
