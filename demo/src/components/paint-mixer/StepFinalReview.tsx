import React from 'react';
import { RefreshCcw, Printer, Edit3, User, PaintBucket, Beaker, Package, Zap, ChevronRight, Camera, X } from 'lucide-react';
import type { Inventory, MixState, MixTint, ProductItem, MixBase } from './types';

interface StepFinalReviewProps {
  currentMix: MixState;
  inventory: Inventory;
  visualColor: string;
  calculations: { subtotal: number; total: number };
  onGoBack: () => void;
  onFinalize: (skipReset?: boolean) => void;
  onUpdateCustomerName: (name: string) => void;
  onUpdateColorName: (name: string) => void;
  onUpdateReferenceImage: (img: string | undefined) => void;
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
  onUpdateReferenceImage,
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

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    onUpdateReferenceImage(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePrintLabel = () => {
    // Save first without resetting to keep UI for print
    onFinalize(true);
    // Add a small delay to ensure state updates if any (though onFinalize usually sync)
    // and to let the notification show
    setTimeout(() => {
        window.print();
    }, 500);
  };

  return (
    <>
    {/* PRINT STYLES & LABEL TEMPLATE */}
    <style>
        {`
        @media print {
            @page {
                size: 100mm 150mm;
                margin: 0;
            }
            body {
                margin: 0;
                padding: 0;
            }
            /* Hide everything recursively */
            body * {
                visibility: hidden;
            }
            
            /* Show only the print container and its children */
            .print-container, .print-container * {
                visibility: visible;
            }
            
            .print-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100mm;
                min-height: 150mm;
                z-index: 9999;
                background: white;
                display: flex !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
        `}
    </style>

    <div className="hidden print-container flex-col bg-white text-black font-sans box-border p-4 relative">
        {/* Header */}
        <div className="flex justify-between items-end border-b-4 border-black pb-2 mb-3">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Chroma<br/>Flow</h1>
            </div>
            <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Reporte de Mezcla</div>
                <div className="text-sm font-bold font-mono">{new Date().toLocaleDateString()}</div>
                <div className="text-[10px] font-mono text-zinc-400">{new Date().toLocaleTimeString()}</div>
            </div>
        </div>

        {/* Customer & Job Info */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 border-b border-zinc-200 pb-3">
             <div className="col-span-2">
                 <div className="text-[9px] uppercase font-black text-zinc-400 tracking-wider">Cliente</div>
                 <div className="text-lg font-bold leading-tight truncate">{currentMix.customerName}</div>
             </div>
             <div className="col-span-2">
                 <div className="text-[9px] uppercase font-black text-zinc-400 tracking-wider">Color / Referencia</div>
                 <div className="text-base font-bold leading-tight">{currentMix.colorName}</div>
             </div>
        </div>

        {/* Formula Table */}
        <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex justify-between items-end mb-1 border-b-2 border-black pb-1">
                <span className="text-[10px] uppercase font-black tracking-wider">Ingredientes</span>
                <span className="text-[10px] uppercase font-black tracking-wider">Cant.</span>
            </div>
            
            <table className="w-full text-xs border-collapse">
                <tbody className="font-mono">
                    {currentMix.bases.map((b, i) => (
                        <tr key={`base-${i}`} className="border-b border-zinc-100">
                            <td className="py-1 pr-2 align-top font-bold">
                                {b.product.name}
                                <span className="block text-[9px] font-normal text-zinc-500 uppercase">Base</span>
                            </td>
                            <td className="py-1 text-right align-top whitespace-nowrap font-bold">
                                {b.qty} <span className="text-[10px] font-normal">{b.product.unit === 'kg' ? 'gr' : (b.product.unit || 'L')}</span>
                            </td>
                        </tr>
                    ))}
                    {currentMix.tints.map((t, i) => {
                         const prod = inventory[t.category]?.find(p => p.id === t.id);
                         return (
                            <tr key={`tint-${i}`} className="border-b border-zinc-100">
                                <td className="py-1 pr-2 align-top">
                                    <span className="font-bold">{prod?.name || 'Unknown'}</span>
                                </td>
                                <td className="py-1 text-right align-top whitespace-nowrap">
                                    {t.qty} <span className="text-[10px] font-normal text-zinc-500">{prod?.unit || 'gr'}</span>
                                </td>
                            </tr>
                         );
                    })}
                </tbody>
            </table>
        </div>
        
        {/* Footer Area with Visuals */}
        <div className="mt-auto pt-2">
            {currentMix.referenceImage ? (
                 <div className="flex gap-2 h-20 mb-2">
                    <div className="flex-1 border border-zinc-200 rounded overflow-hidden relative">
                         <div className="absolute top-1 left-1 bg-white/80 px-1 text-[8px] font-bold uppercase z-10">Muestra</div>
                         <img src={currentMix.referenceImage} className="w-full h-full object-cover grayscale contrast-125" alt="Ref" />
                    </div>
                    {/* Visual Color Swatch next to image if present */}
                    <div className="w-8 border border-black" style={{ backgroundColor: visualColor, printColorAdjust: 'exact' }}></div>
                 </div>
            ) : (
                /* Just Color Swatch bar if no image */
                <div className="h-6 w-full border border-black mb-3" style={{ backgroundColor: visualColor, printColorAdjust: 'exact' }}></div>
            )}

            <div className="border-t-4 border-black pt-1 flex justify-between items-center bg-zinc-100 p-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Total Estimado</div>
                <div className="text-xl font-black font-mono">${calculations.total.toFixed(2)}</div>
            </div>
            <div className="text-center text-[8px] text-zinc-400 mt-1 uppercase tracking-widest">
                Generado por ChromaFlow
            </div>
        </div>
    </div>


    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 print:hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-y-auto pr-2">
        {/* Left Column: Details & Formula */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Section 1: Identity & Reference */}
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

               {/* Image Upload Field */}
               <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Foto de Muestra (Opcional)</label>
                    <div className="flex items-center gap-4">
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                        />
                        
                        {!currentMix.referenceImage ? (
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800/50 transition-all text-zinc-500 hover:text-emerald-500 text-xs font-bold uppercase w-full justify-center"
                            >
                                <Camera size={16} />
                                Adjuntar Foto
                            </button>
                        ) : (
                            <div className="relative w-full h-32 bg-black/50 rounded-xl overflow-hidden border border-zinc-700 group">
                                <img src={currentMix.referenceImage} alt="Reference" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                <button 
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 rounded-full text-white transition-colors"
                                >
                                    <X size={14} />
                                </button>
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-[10px] font-bold text-white uppercase backdrop-blur-sm">
                                    Muestra Cargada
                                </div>
                            </div>
                        )}
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
                        <div className="text-[9px] font-black text-zinc-600 uppercase leading-none mb-1">Base ({mixBase.qty}{mixBase.product.unit === 'kg' ? 'gr' : (mixBase.product.unit || 'L')})</div>
                        <div className="text-zinc-300 font-bold text-xs truncate">{mixBase.product.name}</div>
                      </div>
                    </div>
                    <div className="text-zinc-500 font-mono text-xs ml-2 shrink-0">
                        ${(mixBase.product.unit === 'kg' 
                            ? (mixBase.product.price * (mixBase.qty / 1000)) 
                            : (mixBase.product.price * mixBase.qty)).toFixed(2)}
                    </div>
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
                            <span className="text-zinc-500 font-medium text-[10px]">{item.qty}{t.unit || 'gr'}</span>
                          </div>
                        </div>
                        <span className="text-zinc-500 font-mono text-[11px] ml-2 shrink-0">
                            ${(t.unit === 'kg' 
                                ? (t.price * (item.qty / 1000)) 
                                : (t.price * item.qty)).toFixed(2)}
                        </span>
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
      <div className="mt-6 flex gap-3 items-start shrink-0">
        <button 
          onClick={onGoBack}
          className="flex-1 h-14 rounded-2xl border border-zinc-800 text-zinc-500 font-bold text-xs uppercase hover:bg-zinc-900 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCcw size={16} />
          Ajustar
        </button>
        
        <div className="flex-2 flex flex-col gap-2">
            <button 
              onClick={handlePrintLabel}
              disabled={!currentMix.customerName || !currentMix.colorName}
              className={`w-full h-14 rounded-2xl font-black uppercase text-xs shadow-lg flex items-center justify-center gap-3 transition-all ${
                currentMix.customerName && currentMix.colorName
                  ? 'bg-emerald-500 text-white hover:bg-emerald-400 active:scale-95 hover:shadow-emerald-500/20'
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
    </>
  );
};

export default StepFinalReview;


