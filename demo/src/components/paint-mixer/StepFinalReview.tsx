import React from 'react';
import { RefreshCcw, Printer, Edit3, User, PaintBucket, Beaker, Package, Zap, ChevronRight } from 'lucide-react';
import type { Inventory, MixState, MixTint, ProductItem, MixBase } from './types';

interface StepFinalReviewProps {
  currentMix: MixState;
  inventory: Inventory;
  visualColor: string;
  calculations: { subtotal: number; total: number };
  onGoBack: () => void;
  onFinalize: () => void;
  onUpdateCustomerName: (name: string) => void;
  onUpdateColorName: (name: string) => void;
}

const StepFinalReview: React.FC<StepFinalReviewProps> = ({
  currentMix,
  inventory,
  visualColor,
  calculations,
  onGoBack,
  onFinalize,
  onUpdateCustomerName,
  onUpdateColorName,
}) => {
  const profit = calculations.total - calculations.subtotal;
  const [exchangeRate, setExchangeRate] = React.useState<number | null>(null);

  React.useEffect(() => {
    fetch('https://ve.dolarapi.com/v1/dolares/oficial')
      .then(res => res.json())
      .then(data => {
        if (data && data.promedio) {
          setExchangeRate(data.promedio);
        }
      })
      .catch(err => console.error('Error fetching exchange rate:', err));
  }, []);

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Details & Formula */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Section 1: Identity & Reference (More compact) */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-[24px] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <User size={16} className="text-emerald-500" />
              </div>
              <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Identificación</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Nombre del Cliente <span className="text-emerald-500">*</span></label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={currentMix.customerName}
                    onChange={(e) => onUpdateCustomerName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm placeholder:text-zinc-600"
                    placeholder="Ej: Juan Pérez"
                  />
                  <Edit3 size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Referencia de Color <span className="text-emerald-500">*</span></label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={currentMix.colorName || ''}
                    onChange={(e) => onUpdateColorName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm placeholder:text-zinc-600"
                    placeholder="Ej: Rojo Ferrari 308"
                  />
                  <div 
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white/20 shadow-sm" 
                    style={{ backgroundColor: visualColor }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Components (Fixed overlapping) */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-[24px] p-5 shadow-sm flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Beaker size={16} className="text-emerald-500" />
              </div>
              <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Desglose de Mezcla</h3>
            </div>

            <div className="space-y-4">
              {/* Essential Items */}
              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                {currentMix.bases.map((mixBase: MixBase) => (
                  <div key={mixBase.product.id} className="flex-1 bg-zinc-950/30 border border-zinc-800/50 rounded-xl p-3 flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <PaintBucket size={16} className="text-blue-400 shrink-0" />
                      <div className="truncate">
                        <div className="text-[9px] font-black text-zinc-600 uppercase leading-none mb-1">Base ({mixBase.qty}{mixBase.product.unit || 'L'})</div>
                        <div className="text-zinc-300 font-bold text-xs truncate">{mixBase.product.name}</div>
                      </div>
                    </div>
                    <div className="text-zinc-500 font-mono text-xs ml-2 shrink-0">${(mixBase.product.price * mixBase.qty).toFixed(2)}</div>
                  </div>
                ))}
                
                {currentMix.container && (
                  <div className="flex-1 bg-zinc-950/30 border border-zinc-800/50 rounded-xl p-3 flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <Package size={16} className="text-orange-400 shrink-0" />
                      <div className="truncate">
                        <div className="text-[9px] font-black text-zinc-600 uppercase leading-none mb-1">Envase</div>
                        <div className="text-zinc-300 font-bold text-xs truncate">{currentMix.container.name}</div>
                      </div>
                    </div>
                    <div className="text-zinc-500 font-mono text-xs ml-2 shrink-0">${currentMix.container.price.toFixed(2)}</div>
                  </div>
                )}
              </div>

              {/* Tint List */}
              <div className="border-t border-zinc-800/50 pt-4 mt-2">
                <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">Pigmentos Aplicados</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentMix.tints.map((item: MixTint) => {
                    const t = inventory[item.category].find((x: ProductItem) => x.id === item.id);
                    return t ? (
                      <div key={item.id} className="flex justify-between items-center bg-zinc-950/20 p-2.5 rounded-lg border border-zinc-800/40">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-1.5 h-6 rounded-full shrink-0" style={{ backgroundColor: t.color || '#333' }} />
                          <div className="truncate">
                            <span className="text-zinc-300 font-bold text-xs block truncate">{t.name}</span>
                            <span className="text-[9px] text-zinc-500 font-medium">{item.qty}{t.unit || 'gr'}</span>
                          </div>
                        </div>
                        <span className="text-zinc-500 font-mono text-[11px] ml-2 shrink-0">${(item.qty * t.price).toFixed(2)}</span>
                      </div>
                    ) : null;
                  })}
                  {currentMix.tints.length === 0 && (
                    <div className="col-span-full py-4 text-center text-zinc-600 text-xs italic">No se han añadido tintes</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Confirmation & Total */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Color Card (More focused) */}
          <div className="relative group overflow-hidden rounded-[32px] h-48 lg:h-56 shadow-lg">
            <div className="absolute inset-0" style={{ backgroundColor: visualColor }} />
            
            <div className="absolute bottom-5 left-5 pointer-events-none">
              <div className="bg-black/40 backdrop-blur-md px-3 py-2 rounded-lg inline-block">
                <div className="text-white/60 text-[9px] font-bold uppercase tracking-widest leading-none mb-1">Color</div>
                <div className="text-sm font-black text-white leading-none whitespace-nowrap drop-shadow-md">{currentMix.colorName || 'Sin Nombre'}</div>
              </div>
            </div>
            
            <div className="absolute top-4 right-4 flex -space-x-2">
              {[1, 2].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm" style={{ backgroundColor: visualColor, opacity: 1 - i * 0.2 }} />
              ))}
            </div>
          </div>

          {/* Pricing Card (Condensed) */}
          <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-[32px] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <Zap className="absolute -top-6 -right-6 text-emerald-500/5 w-24 h-24 rotate-12" />

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Subtotal Materiales</span>
                <span className="text-zinc-400 font-mono">${calculations.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-zinc-800/50 pt-3">
                <div className="flex flex-col">
                  <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Margen</span>
                  <span className="text-zinc-600 text-[9px]">Servicio 30%</span>
                </div>
                <span className="text-emerald-500 font-mono font-bold text-sm">+${profit.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-zinc-500 text-[9px] font-black uppercase mb-1 tracking-widest">Total del Pedido</div>
              <div className="flex items-baseline gap-1 text-emerald-400">
                <span className="text-xl font-light opacity-50">$</span>
                <span className="text-5xl font-mono font-black tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                  {calculations.total.toFixed(2).split('.')[0]}
                </span>
                <span className="text-2xl font-mono font-bold">.{calculations.total.toFixed(2).split('.')[1]}</span>
              </div>
              
              {exchangeRate && (
                <div className="mt-3 pt-3 border-t border-zinc-800/50 flex flex-col gap-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Tasa BCV</span>
                    <span className="text-zinc-600 font-mono text-[10px]">{exchangeRate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Bolívares</span>
                    <span className="text-zinc-300 font-mono text-lg font-medium">
                      Bs. {(calculations.total * exchangeRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons: Fixed height and clear spacing */}
      <div className="mt-6 flex gap-3 items-start">
        <button 
          onClick={onGoBack}
          className="flex-1 h-14 rounded-2xl border border-zinc-800 text-zinc-500 font-bold text-xs uppercase hover:bg-zinc-900 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCcw size={16} />
          Ajustar
        </button>
        
        <div className="flex-2 flex flex-col gap-2">
            <button 
              onClick={onFinalize}
              disabled={!currentMix.customerName || !currentMix.colorName}
              className={`w-full h-14 rounded-2xl font-black uppercase text-xs shadow-lg flex items-center justify-center gap-3 transition-all ${
                currentMix.customerName && currentMix.colorName
                  ? 'bg-emerald-500 text-white hover:scale-[1.01] active:scale-95 hover:shadow-emerald-500/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              }`}
            >
              <Printer size={18} />
              Guardar e Imprimir Etiqueta
              <ChevronRight size={16} />
            </button>
            {(!currentMix.customerName || !currentMix.colorName) && (
                <div className="text-center text-[10px] text-amber-500/80 font-medium animate-pulse">
                    ⚠ Ingrese nombre de cliente y color para finalizar
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StepFinalReview;


