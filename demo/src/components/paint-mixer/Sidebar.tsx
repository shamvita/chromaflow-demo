
import React from 'react';
import { Layers, Droplet, Star, ShoppingBag, Box, Settings } from 'lucide-react';
import type { Inventory } from './types';

interface SidebarProps {
  activeTab: keyof Inventory;
  onTabChange: (tab: keyof Inventory) => void;
  onOpenInventory: () => void;
}

const NAV_ITEMS = [
  { key: 'preparacion', label: 'Preparación', icon: Layers },
  { key: 'color_brillo', label: 'Tintes y Acabados', icon: Droplet },
  { key: 'solventes', label: 'Solventes', icon: Droplet }, // Consider a different icon
  { key: 'personalizados', label: 'Fórmulas', icon: Star },
  { key: 'envases', label: 'Envases', icon: Box },
  { key: 'complementos', label: 'Extras', icon: ShoppingBag },
  // Impermeabilizacion handled in extras or separate? User asked for 5 main cats, but code has 6.
  // Grouping suggestion:
  // Bases -> Preparacion + Color Brillo Bases?
  // Tintas -> Color Brillo Tintes
  // But for now let's stick to inventory keys to be safe, or map loosely.
  // User asked for: Bases, Tintas, Personalizados, Envases, Extras.
] as const;

// Mapping user requested categories to inventory keys for the sidebar
// This is a bit tricky since inventory structure is rigid.
// Let's rely on the inventory keys from `types.ts` for now to avoid breaking data flow,
// but label them as user requested where possible.

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onOpenInventory }) => {
  return (
    <aside className="w-20 md:w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col pt-6 pb-6 transition-all z-20">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Droplet className="text-white fill-current" size={24} />
        </div>
        <div className="hidden md:block">
          <h1 className="font-black text-xl leading-none tracking-tight text-white">CHROMA</h1>
          <span className="text-[10px] text-emerald-500 font-bold tracking-[0.3em]">FLOW</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-2 overflow-y-auto no-scrollbar">
          <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hidden md:block">
              Categorías
          </div>
        {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.key;
            return (
          <button 
            key={item.key}
            onClick={() => onTabChange(item.key as keyof Inventory)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group relative overflow-hidden ${
              isActive
              ? 'bg-emerald-500/10 text-emerald-400 font-bold' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r-full" />}
            
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-emerald-500 text-black' : 'bg-zinc-900 group-hover:bg-zinc-800'}`}>
              <item.icon size={18} />
            </div>
            
            <div className="hidden md:block text-left truncate">
              <span className="text-sm">{item.label}</span>
            </div>
          </button>
        )})}
      </nav>

      <div className="px-4 mt-4 pt-4 border-t border-zinc-900">
        <button 
          onClick={onOpenInventory}
          className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all flex items-center justify-center gap-2 text-zinc-500 hover:text-white group"
        >
          <Settings size={18} className="group-hover:rotate-90 transition-transform" />
          <span className="hidden md:block font-bold text-xs uppercase tracking-wider">Gestión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
