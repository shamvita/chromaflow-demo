import React from 'react';
import { ChevronDown, Hash, X, Search } from 'lucide-react';
import type { Inventory, MixState, MixTint, ProductItem, MixBase } from './types';
import { CATEGORY_LABELS } from './constants';

interface StepTintSelectionProps {
  filteredInventory: Inventory;
  inventory: Inventory;
  currentMix: MixState;
  activeMainCategory: keyof Inventory | 'all';
  onCategoryChange: (category: keyof Inventory | 'all') => void;
  onOpenTinteInput: (tinteId: string, category: keyof Inventory) => void;
  onRemoveTinte: (id: string) => void;
  onGoBack: () => void;
  onAdvance: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const StepTintSelection: React.FC<StepTintSelectionProps> = ({
  filteredInventory,
  inventory,
  currentMix,
  activeMainCategory,
  onCategoryChange,
  onOpenTinteInput,
  onRemoveTinte,
  onGoBack,
  onAdvance,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="flex h-full gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="mb-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center px-4 h-14 focus-within:border-emerald-500/50 transition-all w-full shadow-sm">
          <Search size={22} className="text-zinc-500 mr-3" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-lg font-medium w-full placeholder-zinc-600 outline-none"
            placeholder="Buscar tintes por código o nombre..."
            autoFocus
          />
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button onClick={onGoBack} className="text-zinc-500 hover:text-white transition-colors">
                <ChevronDown className="rotate-90" />
              </button>
              <h2 className="text-3xl font-black tracking-tight text-white">Añadir Tintes</h2>
            </div>
            <p className="text-zinc-500">Agrega pigmentos y aditivos para ajustar el color.</p>
          </div>
        </div>

        {/* Category Filter for Tints */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
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

        <div className="flex-1 overflow-y-auto pr-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start">
          {(Object.keys(filteredInventory) as Array<keyof Inventory>)
            .filter(cat => cat !== 'envases')
            .flatMap((cat: keyof Inventory) => 
            filteredInventory[cat]?.map((tinte: ProductItem) => (
              <button
                key={tinte.id}
                onClick={() => onOpenTinteInput(tinte.id, cat)}
                className="group p-4 rounded-3xl border border-zinc-800 bg-zinc-900/40 hover:border-emerald-500/30 hover:bg-zinc-800 transition-all text-center flex flex-col items-center"
              >
                <div 
                  className="w-14 h-14 rounded-full shadow-lg border-4 border-zinc-950 group-hover:scale-110 transition-transform duration-500 mb-4"
                  style={{ backgroundColor: tinte.color }}
                />
                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter mb-1">{tinte.code || 'S/C'}</div>
                <div className="text-xs font-bold text-zinc-300 line-clamp-1 group-hover:text-white transition-colors">{tinte.name}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Summary Column */}
      <div className="w-80 bg-zinc-900/50 rounded-[40px] border border-zinc-800/50 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Hash size={16} />
          </div>
          <h3 className="font-bold text-white uppercase tracking-widest text-xs">Fórmula</h3>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          {currentMix.bases.map((base: MixBase) => (
            <div key={base.product.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-emerald-500 uppercase">Base</span>
                <span className="text-[10px] font-bold text-zinc-500">{base.qty}{base.product.unit || 'L'}</span>
              </div>
              <div className="text-sm font-bold text-zinc-200 truncate mt-1">{base.product.name}</div>
            </div>
          ))}
          
          {currentMix.container && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-500 uppercase">Envase</span>
                <span className="text-[10px] font-bold text-zinc-500">
                  Stock: {currentMix.container.stock}
                </span>
              </div>
              <div className="text-sm font-bold text-zinc-200 truncate mt-1">{currentMix.container.name}</div>
            </div>
          )}

          {currentMix.tints.map((item: MixTint) => {
            const t = inventory[item.category].find((x: ProductItem) => x.id === item.id);
            return t ? (
              <div key={item.id} className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-800/50 transition-colors">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-zinc-300 truncate">{t.name}</div>
                  <div className="text-[10px] font-mono text-zinc-600">{item.qty}{t.unit || 'gr'}</div>
                </div>
                <button onClick={() => onRemoveTinte(item.id)} className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                  <X size={14} />
                </button>
              </div>
            ) : null;
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-800">
          <button 
            onClick={onAdvance}
            disabled={currentMix.tints.length === 0}
            className={`w-full py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all ${
              currentMix.tints.length > 0 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95' 
              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            Revisar Mezcla
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepTintSelection;
