import React from 'react';
import { User, History, Search, ChevronRight, Star, Clock, ShoppingCart } from 'lucide-react';
import type { SavedFormula, ProductItem } from './types';

interface CustomerManagerProps {
    savedFormulas: SavedFormula[];
    onSelectCustomer: (name: string) => void;
    onExplodeFormula: (formula: ProductItem) => void;
}

const CustomerManager: React.FC<CustomerManagerProps> = ({
    savedFormulas,
    onSelectCustomer,
    onExplodeFormula,
}) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    // Extract unique customers from formulas
    const customers = React.useMemo(() => {
        const customerMap = new Map<string, { lastVisit: string; count: number; total: number; formulas: SavedFormula[] }>();

        savedFormulas.forEach(f => {
            const existing = customerMap.get(f.customerName) || { lastVisit: f.date, count: 0, total: 0, formulas: [] };
            if (new Date(f.date) > new Date(existing.lastVisit)) {
                existing.lastVisit = f.date;
            }
            existing.count += 1;
            existing.total += f.total;
            existing.formulas.push(f);
            customerMap.set(f.customerName, existing);
        });

        return Array.from(customerMap.entries())
            .map(([name, stats]) => ({ name, ...stats }))
            .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());
    }, [savedFormulas, searchTerm]);

    const [selectedCustomerName, setSelectedCustomerName] = React.useState<string | null>(null);

    const activeCustomerStats = selectedCustomerName ? customers.find(c => c.name === selectedCustomerName) : null;

    return (
        <div className="flex h-full animate-in fade-in duration-500 overflow-hidden">
            {/* List Column */}
            <div className="w-full md:w-80 border-r border-zinc-900 flex flex-col bg-zinc-950/20">
                <div className="p-4 border-b border-zinc-900 space-y-3">
                    <div className="relative group">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-bold"
                        />
                    </div>

                    <button
                        onClick={() => {
                            const name = window.prompt("Nombre del nuevo cliente:");
                            if (name && name.trim()) {
                                onSelectCustomer(name.trim());
                            }
                        }}
                        className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <User size={12} className="fill-current" />
                        Nuevo Cliente
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
                    {customers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-zinc-600 text-center px-4">
                            <User size={32} className="mb-3 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">No hay clientes</p>
                            <p className="text-[10px] mt-1 opacity-60 italic">Las fórmulas guardadas aparecerán aquí.</p>
                        </div>
                    ) : (
                        customers.map((c) => (
                            <button
                                key={c.name}
                                onClick={() => setSelectedCustomerName(c.name)}
                                className={`w-full p-3 rounded-xl flex items-center justify-between transition-all group ${selectedCustomerName === c.name
                                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                                    : 'hover:bg-zinc-900 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${selectedCustomerName === c.name ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-800 bg-zinc-900'
                                        }`}>
                                        <User size={18} className={selectedCustomerName === c.name ? 'text-emerald-400' : 'text-zinc-500'} />
                                    </div>
                                    <div className="text-left min-w-0">
                                        <div className={`text-sm font-bold truncate ${selectedCustomerName === c.name ? 'text-emerald-400' : 'text-zinc-200'}`}>
                                            {c.name}
                                        </div>
                                        <div className="text-[10px] text-zinc-500 flex items-center gap-1 font-mono uppercase tracking-tighter">
                                            <Clock size={10} /> {new Date(c.lastVisit).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={14} className={`transition-transform ${selectedCustomerName === c.name ? 'text-emerald-500 translate-x-1' : 'text-zinc-700'}`} />
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Details Column */}
            <div className="flex-1 flex flex-col bg-zinc-950/40">
                {!activeCustomerStats ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-zinc-600 text-center">
                        <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
                            <History size={48} className="opacity-20 translate-x-1" />
                        </div>
                        <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Selecciona un Cliente</h3>
                        <p className="text-xs max-w-xs leading-relaxed text-zinc-600 italic">
                            Podrás ver su historial de fórmulas, consumos totales y repetir pedidos rápidamente.
                        </p>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Customer Header */}
                        <div className="p-6 border-b border-zinc-900 bg-zinc-900/20">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                                        <User size={32} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white">{activeCustomerStats.name}</h2>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                                                <Clock size={10} /> Última Visita: {new Date(activeCustomerStats.lastVisit).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onSelectCustomer(activeCustomerStats.name)}
                                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    <ShoppingCart size={14} />
                                    Iniciar Nueva Mezcla
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
                                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-wider mb-1">Total Pedidos</div>
                                    <div className="text-2xl font-black text-emerald-400 font-mono">{activeCustomerStats.count}</div>
                                </div>
                                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl col-span-2">
                                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-wider mb-1">Inversión Estimada</div>
                                    <div className="text-2xl font-black text-white font-mono">${activeCustomerStats.total.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Formula History */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                <Star size={12} className="text-emerald-500" /> Historial de Fórmulas
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {activeCustomerStats.formulas.map((f) => (
                                    <div
                                        key={f.id}
                                        className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 hover:border-emerald-500/30 transition-all group overflow-hidden relative"
                                    >
                                        <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                                            <Star className="w-full h-full rotate-12" />
                                        </div>

                                        <div className="flex justify-between items-start mb-3">
                                            <div className="w-10 h-10 rounded-xl border border-white/10 shadow-sm" style={{ backgroundColor: f.color || '#333' }} />
                                            <div className="text-[10px] font-mono font-bold text-zinc-600">{f.code}</div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="text-sm font-bold text-zinc-100 truncate">{f.colorName || 'Sin Nombre'}</div>
                                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">{f.containerName || 'Base Suelta'}</div>
                                            <div className="text-[9px] text-zinc-700 font-mono mt-0.5">{new Date(f.date).toLocaleDateString()} {new Date(f.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                                            <div className="text-sm font-black text-emerald-400/80 font-mono">${f.total.toFixed(2)}</div>
                                            <button
                                                onClick={() => onExplodeFormula({
                                                    id: f.id,
                                                    name: f.colorName || 'Fórmula',
                                                    price: f.total,
                                                    stock: 999,
                                                    category: 'personalizados',
                                                    subcategory: 'Historial',
                                                    color: f.color || '#333',
                                                    formula: f
                                                } as ProductItem)}
                                                className="text-[10px] font-black uppercase text-zinc-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
                                            >
                                                Repetir <ChevronRight size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerManager;
