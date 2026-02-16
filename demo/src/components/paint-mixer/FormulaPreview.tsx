import React from 'react';
import { X, Beaker, Check, Droplets, Layers } from 'lucide-react';
import type { Inventory, ProductItem, MixTint } from './types';

interface FormulaPreviewProps {
  product: ProductItem;
  inventory: Inventory;
  onClose: () => void;
  onSelect: (product: ProductItem) => void;
  onExplode: (product: ProductItem) => void;
}

const FormulaPreview: React.FC<FormulaPreviewProps> = ({ product, inventory, onClose, onSelect, onExplode }) => {
  const formula = product.formula!;

  const getTintName = (tint: MixTint) => {
    const categoryItems = inventory[tint.category];
    if (!categoryItems) return 'Producto desconocido';
    const item = categoryItems.find(p => p.id === tint.id);
    return item ? item.name : 'Unknown Product';
  };
  
  const getTintColor = (tint: MixTint) => {
      const categoryItems = inventory[tint.category];
      if (!categoryItems) return '#808080';
      const item = categoryItems.find(p => p.id === tint.id);
      return item ? item.color : '#808080';
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-zinc-900 w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
                 <div className="bg-violet-500/10 text-violet-400 p-2 rounded-lg">
                    <Beaker size={20} />
                 </div>
                 <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Fórmula Guardada</span>
            </div>
            <h2 className="text-xl font-bold text-white">{product.name}</h2>
            <div className="text-sm text-zinc-500 font-mono mt-1">
                Cliente: {formula.customerName} • {formula.date.substring(0,10)}
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Bases Section */}
            <div>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Layers size={14} /> Bases y Aglutinantes
                </h3>
                <div className="space-y-2">
                    {formula.bases.map((base, idx) => (
                        <div key={`base-${idx}`} className="flex justify-between items-center p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                            <span className="text-zinc-200 font-medium">{base.name}</span>
                            <span className="font-mono text-emerald-400 font-bold">
                                {base.qty} {(() => { 
                                    const u = base.unit || (inventory['bases_auto'].find(p => p.id === base.id)?.unit) || 'L';
                                    return u === 'kg' ? 'gr' : u;
                                })()}
                            </span> 
                            {/* Assuming L for legacy reasons or we parse it? SavedFormula bases structure only has id, name, qty. No unit. 
                                In POS refactor, currentMix saves bases with qty.
                                Ideally we should have saved unit too. For now assume L or just show qty */}
                        </div>
                    ))}
                    {formula.bases.length === 0 && (
                        <div className="text-zinc-600 italic text-sm">Sin bases registradas</div>
                    )}
                </div>
            </div>

            {/* Components Section (Tints, Additives) */}
            <div>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Droplets size={14} /> Componentes y Tintes
                </h3>
                <div className="space-y-2">
                    {formula.tints.map((tint, idx) => (
                        <div key={`tint-${idx}`} className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                            <div 
                                className="w-8 h-8 rounded-lg border border-white/5 shadow-inner"
                                style={{ backgroundColor: getTintColor(tint) }}
                            />
                            <div className="flex-1">
                                <span className="text-zinc-200 font-medium block">{getTintName(tint)}</span>
                                <span className="text-[10px] text-zinc-500 uppercase">{tint.category}</span>
                            </div>
                            <span className="font-mono text-blue-400 font-bold">{tint.qty} gr</span>
                        </div>
                    ))}
                     {formula.tints.length === 0 && (
                        <div className="text-zinc-600 italic text-sm">Sin componentes adicionales</div>
                    )}
                </div>
            </div>

             {/* Container Info */}
             {formula.containerName && (
                <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-800 flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">Envase Original</span>
                    <span className="text-white font-bold">{formula.containerName?.replace(/Envase\s?/i, '')}</span>
                </div>
             )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950/50 flex flex-col gap-3">
            <button 
                onClick={() => onExplode(product)}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-emerald-400 border border-emerald-500/20 transition-colors flex items-center justify-center gap-2"
            >
                <Layers size={18} />
                Desglosar (Agregar Componentes)
            </button>
            <div className="flex gap-3">
                <button 
                    onClick={onClose}
                    className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-zinc-300 transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    onClick={() => onSelect(product)}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white transition-colors flex items-center justify-center gap-2"
                >
                    <Check size={18} />
                    Usar Entera
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default FormulaPreview;
