import { useState, useMemo } from 'react';
import { Search, Pipette, ArrowRight } from 'lucide-react';
import { findClosestMatches } from '../../utils/color';
import type { Inventory, ProductItem } from './types';

interface ColorPickerProps {
  inventory: Inventory;
  onProductSelect: (product: ProductItem) => void;
}

export default function ColorPicker({ inventory, onProductSelect }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState('#EF4444'); // Default Red-500

  // Combine relevant items
  const searchPool = useMemo(() => {
    return [
      ...inventory.bases_auto,
      ...inventory.tintes,
      ...inventory.personalizados
    ];
  }, [inventory]);

  const matches = useMemo(() => {
    return findClosestMatches(selectedColor, searchPool, 'product', 20);
  }, [selectedColor, searchPool]);

  return (
    <div className="h-full flex flex-col bg-zinc-950 p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-8 h-full">
        
        {/* Left: Color Selection */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Pipette className="text-emerald-500" />
                Igualación de Color
            </h2>
            <p className="text-zinc-400">
                Selecciona un color objetivo para buscar tintes o fórmulas similares en tu inventario.
            </p>

            <div className="aspect-square w-full rounded-3xl overflow-hidden relative shadow-2xl border border-zinc-800 group">
                <input 
                    type="color" 
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                />
                
                {/* Overlay with Hex Code */}
                <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 flex justify-between items-center pointer-events-none group-hover:scale-105 transition-transform">
                    <span className="font-mono text-xl font-bold text-white uppercase">{selectedColor}</span>
                    <div className="w-8 h-8 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: selectedColor }} />
                </div>
            </div>
            
            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Instrucciones</h3>
                <ul className="text-sm text-zinc-400 space-y-2 list-disc pl-4">
                    <li>Haz clic en el cuadro de color para abrir el selector.</li>
                    <li>Ajusta el tono para encontrar la coincidencia más cercana.</li>
                    <li>Selecciona un resultado de la derecha para usarlo.</li>
                </ul>
            </div>
        </div>

        {/* Right: Results */}
        <div className="flex-1 flex flex-col min-h-0">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Resultados Encontrados ({matches.length})</h3>
             </div>
             
             <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {matches.map(({ item, distance }) => {
                    // Normalize distance to percentage. 
                    // Distance 0 = 100%. Distance 441 (max RGB dist) = 0% roughly
                    // Let's use a simpler scale where < 50 is readable match
                    const matchPercent = Math.max(0, 100 - (distance / 3)); 
                    const isExact = distance < 10;
                    
                    return (
                        <button 
                            key={item.id}
                            onClick={() => onProductSelect(item)}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/50 p-4 rounded-2xl flex items-center gap-4 transition-all group group-hover:shadow-lg group-hover:shadow-emerald-500/10 text-left"
                        >
                            <div 
                                className="w-16 h-16 rounded-xl shadow-inner shrink-0 border border-white/5"
                                style={{ backgroundColor: item.color }} 
                            />
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                        item.category === 'personalizados' 
                                        ? 'bg-purple-500/20 text-purple-400' 
                                        : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                        {item.category === 'personalizados' ? 'Fórmula' : 'Producto'}
                                    </span>
                                    {isExact && (
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-black uppercase tracking-wider">
                                            Exacto
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-white truncate text-lg group-hover:text-emerald-400 transition-colors">{item.name}</h4>
                                <p className="text-sm text-zinc-500 truncate">
                                    {item.category === 'personalizados' 
                                        ? `Fórmulas • ${item.unit}` 
                                        : `${item.subcategory || 'Sin categoría'} • Stock: ${item.stock} ${item.unit || 'u'}`}
                                </p>
                            </div>

                            <div className="text-right shrink-0">
                                <div className={`text-2xl font-black ${matchPercent > 90 ? 'text-emerald-400' : matchPercent > 70 ? 'text-yellow-400' : 'text-zinc-600'}`}>
                                    {matchPercent.toFixed(0)}%
                                </div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase">Coincidencia</div>
                            </div>
                            
                            <div className="w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-emerald-500 flex items-center justify-center transition-colors">
                                <ArrowRight size={20} className="text-zinc-500 group-hover:text-black" />
                            </div>
                        </button>
                    );
                })}

                {matches.length === 0 && (
                     <div className="h-64 flex flex-col items-center justify-center text-zinc-500 dashed border border-zinc-800 rounded-3xl">
                        <Search size={48} className="mb-4 opacity-50" />
                        <p>No se encontraron coincidencias cercanas.</p>
                     </div>
                )}
             </div>
        </div>
      </div>
    </div>
  );
}
