
import React, { useState } from 'react';
import { CheckCircle2, FlaskConical, Trash2, Search } from 'lucide-react';
import type { Inventory, ProductItem, MixBase } from './types';
import Numpad from './Numpad';
import { CATEGORY_LABELS } from './constants';

interface StepBaseSelectionProps {
  filteredInventory: Inventory;
  onBasesSubmit: (bases: MixBase[], container?: ProductItem) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeMainCategory: keyof Inventory | 'all';
  onCategoryChange: (category: keyof Inventory | 'all') => void;
}

const StepBaseSelection: React.FC<StepBaseSelectionProps> = ({
  filteredInventory,
  onBasesSubmit,
  searchTerm,
  onSearchChange,
  activeMainCategory,
  onCategoryChange,
}) => {

  const [activeBase, setActiveBase] = useState<ProductItem | null>(null);
  const [showAllInventory, setShowAllInventory] = useState(false);
  
  // Cocktail Mode State
  const [cocktailBases, setCocktailBases] = useState<MixBase[]>([]);
  const [cocktailQty, setCocktailQty] = useState<string>('');
  
  // Handlers
  const handleBaseClick = (base: ProductItem) => {
    setActiveBase(base);
    setCocktailQty(''); // Reset for new selection
  };



  const addToCocktail = () => {
    if (!activeBase) return;
    const qty = parseFloat(cocktailQty);
    if (!qty || qty <= 0) return;

    setCocktailBases(prev => {
        const existing = prev.find(b => b.product.id === activeBase.id);
        if (existing) {
            return prev.map(b => b.product.id === activeBase.id ? { ...b, qty: b.qty + qty } : b);
        }
        return [...prev, { product: activeBase, qty }];
    });
    setActiveBase(null);
  };

  const removeFromCocktail = (id: string) => {
    setCocktailBases(prev => prev.filter(b => b.product.id !== id));
  };

  const submitCocktail = () => {
    if (cocktailBases.length === 0) return;
    onBasesSubmit(cocktailBases, undefined); // No specific container for cocktail (or add later)
  };

  return (
    <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500 relative flex flex-col">
      {/* Search Bar */}

      <div className="flex gap-4 items-center mb-6">
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center px-4 h-14 focus-within:border-emerald-500/50 transition-all shadow-sm">
          <Search size={22} className="text-zinc-500 mr-3" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-lg font-medium w-full placeholder-zinc-600 outline-none"
            placeholder={showAllInventory ? "Buscar cualquier producto..." : "Buscar base por nombre o código..."}
            autoFocus
          />
        </div>
        
        <button
            onClick={() => setShowAllInventory(!showAllInventory)}
            className={`h-14 px-6 rounded-2xl border transition-all flex items-center gap-2 font-bold text-sm whitespace-nowrap ${
                showAllInventory
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
            }`}
        >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${showAllInventory ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-600'}`}>
                {showAllInventory && <CheckCircle2 size={10} className="text-black" />}
            </div>
            Todo el Inventario
        </button>
      </div>

        {/* Category Filter (Visible only when Show All is active) */}
        {showAllInventory && (
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar animate-in fade-in slide-in-from-top-2">
            <button 
                onClick={() => onCategoryChange('all')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                activeMainCategory === 'all' 
                ? 'bg-emerald-500 border-emerald-400 text-white' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
            >
                Todos
            </button>
            {(Object.keys(CATEGORY_LABELS) as Array<keyof Inventory>)
                .filter((k) => k !== 'envases')
                .map((key) => (
                <button 
                key={key}
                onClick={() => onCategoryChange(key)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                    activeMainCategory === key 
                    ? 'bg-emerald-500 border-emerald-400 text-white' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
                >
                {CATEGORY_LABELS[key]}
                </button>
            ))}
            </div>
        )}

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">Selecciona la Base</h2>
          <p className="text-zinc-500">
            Mezcla múltiples bases para crear un tono personalizado.
          </p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Base Grid */}
        <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Object.keys(filteredInventory) as Array<keyof Inventory>)
                .filter(cat => cat !== 'envases')
                .flatMap((cat: keyof Inventory) => filteredInventory[cat] || [])
                .filter((p: ProductItem) => showAllInventory ? true : p.isBaseRole)
                .map((base: ProductItem) => {
                    const isSelected = cocktailBases.some(b => b.product.id === base.id);
                    
                    return (
                        <button
                        key={base.id}
                        onClick={() => handleBaseClick(base)}
                        className={`group relative p-6 rounded-3xl border-2 text-left transition-all duration-300 overflow-hidden ${
                            isSelected
                            ? 'border-emerald-500 bg-emerald-500/5' 
                            : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-800'
                        }`}
                        >
                        <div className="flex items-start justify-between mb-12">
                            <div 
                            className="w-16 h-16 rounded-full shadow-inner border-2 border-white/5 transition-transform group-hover:scale-110 duration-500"
                            style={{ backgroundColor: base.color }}
                            />
                            {isSelected && (
                            <div className="bg-emerald-500 text-white rounded-full p-1.5 shadow-lg shadow-emerald-500/40">
                                <CheckCircle2 size={20} />
                            </div>
                            )}
                        </div>

                        <div className="relative">
                            <span className="text-[10px] uppercase tracking-widest font-black text-zinc-500 mb-1 block">{base.category}</span>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{base.name}</h3>
                            <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-500 font-medium">Stock:</span>
                                <span className={`text-xs font-bold ${base.stock < 10 ? 'text-red-400' : 'text-zinc-300'}`}>{base.stock} {base.unit || 'u'}</span>
                            </div>
                            <span className="text-lg font-mono font-bold text-zinc-200">${base.price.toFixed(2)}</span>
                            </div>
                        </div>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Cocktail Sidebar */}
        <div className="w-80 bg-zinc-900/80 border border-zinc-800 rounded-[32px] p-6 flex flex-col animate-in slide-in-from-right-10 duration-500">
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <FlaskConical size={20} className="text-emerald-500" />
                    Bases Seleccionadas
                </h3>
                
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {cocktailBases.map((item) => (
                        <div key={item.product.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between group">
                            <div>
                                <div className="text-sm font-bold text-white mb-1">{item.product.name}</div>
                                <div className="text-xs text-emerald-400 font-mono">{item.qty} {item.product.unit || 'L'}</div>
                            </div>
                            <button 
                                onClick={() => removeFromCocktail(item.product.id)}
                                className="text-zinc-600 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {cocktailBases.length === 0 && (
                        <div className="text-center py-10 text-zinc-600 italic text-sm">
                            Selecciona bases para crear tu mezcla.
                        </div>
                    )}
                </div>

                <div className="border-t border-zinc-800 pt-4">
                    <button 
                        onClick={submitCocktail}
                        disabled={cocktailBases.length === 0}
                        className={`w-full py-4 rounded-2xl font-black uppercase text-sm tracking-widest transition-all ${
                            cocktailBases.length > 0 
                            ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20' 
                            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                        }`}
                    >
                        Confirmar Bases
                    </button>
                </div>
            </div>
      </div>

      {/* Modals */}
      


      {/* Cocktail Mode: Qty Input (Replaced with Numpad) */}
      {activeBase && (
        <Numpad
            value={cocktailQty}
            onInput={(key: string) => {
                if (key === 'DEL') {
                    setCocktailQty(prev => prev.slice(0, -1));
                    return;
                }
                if (key === '.' && cocktailQty.includes('.')) return;
                setCocktailQty(prev => prev + key);
            }}
            onClose={() => setActiveBase(null)}
            onConfirm={addToCocktail}
            label={`Cantidad para ${activeBase.name}`}
        />
      )}
    </div>
  );
};

export default StepBaseSelection;
