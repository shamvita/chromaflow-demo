
import React, { useMemo } from 'react';
import { Hash, X, ArrowRight, Droplets } from 'lucide-react';
import type { Inventory, MixState } from './types';
import { mixColors, getMeldingWeight } from '../../utils/color';

interface MixSummaryProps {
    currentMix: MixState;
    inventory: Inventory;
    onRemoveBase: (id: string) => void;
    onRemoveTint: (id: string) => void;
    onRemoveContainer: () => void;
    onProceed: () => void;
    calculations: { subtotal: number; total: number };
}

const MixSummary: React.FC<MixSummaryProps> = ({
    currentMix,
    inventory,
    onRemoveBase,
    onRemoveTint,
    onRemoveContainer,
    onProceed,
    calculations,
}) => {
    const hasItems = currentMix.bases.length > 0 || currentMix.tints.length > 0 || currentMix.container;

    const mixedColor = useMemo(() => {
        const colors: { color: string; weight: number }[] = [];

        // Bases
        currentMix.bases.forEach((base) => {
            if (base.product.color) {
                // Fix: Treat 'kg' unit as 'gr' because quantities are stored in grams
                const effectiveUnit = base.product.unit === 'kg' ? 'gr' : (base.product.unit || 'u');
                colors.push({
                    color: base.product.color,
                    weight: getMeldingWeight(base.qty, effectiveUnit),
                });
            }
        });

        // Tints
        currentMix.tints.forEach((tint) => {
            const product = inventory[tint.category]?.find((p) => p.id === tint.id) ||
                inventory['personalizados']?.find((p) => p.id === tint.id);

            if (product && product.color) {
                const effectiveUnit = product.unit === 'kg' ? 'gr' : (product.unit || 'gr');
                colors.push({
                    color: product.color,
                    weight: getMeldingWeight(tint.qty, effectiveUnit),
                });
            }
        });

        return mixColors(colors);
    }, [currentMix, inventory]);

    return (
        <div id="mix-summary" className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full shadow-2xl z-30">
            {/* Header */}
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 shadow-inner transition-colors duration-500"
                        style={{ backgroundColor: hasItems ? mixedColor : 'rgba(37, 99, 235, 0.1)' }}
                    >
                        {!hasItems ? <Hash size={18} className="text-emerald-500" /> : <Droplets size={18} className="text-white drop-shadow-md mix-blend-difference" />}
                    </div>
                    <div>
                        <h3 className="font-black text-white text-sm uppercase tracking-wider">Mezcla Actual</h3>
                        <div className="text-[10px] text-zinc-500 font-bold">{currentMix.customerName}</div>
                    </div>
                </div>

            </div>

            {/* Color Preview Bar */}
            {hasItems && (
                <div className="relative h-2 w-full bg-zinc-800 overflow-hidden">
                    <div
                        className="absolute inset-0 transition-colors duration-500"
                        style={{ backgroundColor: mixedColor }}
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-50" />
                </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {!hasItems && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center px-8 opacity-60">
                        <div className="w-16 h-16 rounded-full bg-zinc-800/50 mb-4 flex items-center justify-center">
                            <ArrowRight size={24} className="text-zinc-700" />
                        </div>
                        <p className="text-xs font-medium">Selecciona productos del menú para comenzar tu fórmula.</p>
                    </div>
                )}

                {/* Bases */}
                {currentMix.bases.map((base) => (
                    <div key={base.product.id} className="relative group bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex gap-3 transition-all hover:border-zinc-700">
                        <div className="w-10 h-10 rounded-lg shrink-0 border border-white/5" style={{ backgroundColor: base.product.color }} />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">BASE</span>
                                <span className="text-[10px] font-mono text-zinc-400">{base.qty} {base.product.unit === 'kg' ? 'gr' : (base.product.unit || 'u')}</span>
                            </div>
                            <div className="text-xs font-bold text-zinc-200 truncate">{base.product.name}</div>
                        </div>
                        <button
                            onClick={() => onRemoveBase(base.product.id)}
                            className="absolute -top-2 -right-2 bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}

                {/* Tints/Additives */}
                {currentMix.tints.map((item) => {
                    const t = inventory[item.category]?.find((x) => x.id === item.id) ||
                        inventory['personalizados']?.find((x) => x.id === item.id);

                    if (!t) return null;

                    return (
                        <div key={item.id} className="relative group bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex gap-3 transition-all hover:border-zinc-700">
                            <div className="w-10 h-10 rounded-lg shrink-0 border border-white/5" style={{ backgroundColor: t.color }} />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                                        {t.category === 'personalizados' ? 'FORMULA' : 'TINTE'}
                                    </span>
                                    <span className="text-[10px] font-mono text-zinc-400">{item.qty} {t.unit || 'gr'}</span>
                                </div>
                                <div className="text-xs font-bold text-zinc-200 truncate">{t.name}</div>
                            </div>
                            <button
                                onClick={() => onRemoveTint(item.id)}
                                className="absolute -top-2 -right-2 bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    );
                })}

                {/* Container */}
                {currentMix.container && (
                    <div className="relative group bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex gap-3 transition-all hover:border-zinc-700">
                        <div className="w-10 h-10 rounded-lg shrink-0 border border-white/5 bg-zinc-800 flex items-center justify-center text-zinc-600">
                            <div className="w-3 h-3 rounded-full bg-zinc-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">ENVASE</span>
                            </div>
                            <div className="text-xs font-bold text-zinc-200 truncate">{currentMix.container.name}</div>
                        </div>
                        <button
                            onClick={onRemoveContainer}
                            className="absolute -top-2 -right-2 bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div id="mix-summary-total" className="p-6 border-t border-zinc-800 bg-zinc-950/50">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-zinc-500 font-medium text-xs uppercase tracking-wider">Total Estimado</span>
                    <div className="text-2xl font-mono font-bold text-white">${calculations.total.toFixed(2)}</div>
                </div>
                <button
                    onClick={onProceed}
                    disabled={!hasItems}
                    className={`w-full h-[36px] rounded-lg font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${hasItems
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-95'
                            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                        }`}
                >
                    <span>Procesar</span>
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default MixSummary;
