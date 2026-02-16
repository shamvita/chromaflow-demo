
import React from 'react';
import { Droplet, Star, ShoppingBag, Box, Settings, Pipette, BookOpen } from 'lucide-react';
import type { Inventory } from './types';

interface SidebarProps {
  activeTab: keyof Inventory | 'color_picker';
  onTabChange: (tab: keyof Inventory | 'color_picker') => void;
  onOpenInventory: () => void;
  onStartTutorial: () => void;
}

const NAV_ITEMS = [
  { key: 'personalizados', label: 'Fórmulas', icon: Star },
  { key: 'color_picker', label: 'Igualación', icon: Pipette },
  { key: 'bases_auto', label: 'Automotriz', icon: Droplet },
  { key: 'bases_arq', label: 'Arquitectónica', icon: Droplet },
  { key: 'tintes', label: 'Tintes', icon: Droplet },
  { key: 'barnices_acabados', label: 'Barnices', icon: Droplet },
  { key: 'solventes', label: 'Solventes', icon: Droplet },
  { key: 'envases', label: 'Envases', icon: Box },
  { key: 'complementos', label: 'Extras', icon: ShoppingBag },
] as const;

// Mapping user requested categories to inventory keys for the sidebar
// This is a bit tricky since inventory structure is rigid.
// Let's rely on the inventory keys from `types.ts` for now to avoid breaking data flow,
// but label them as user requested where possible.

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onOpenInventory, onStartTutorial }) => {
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

      <nav id="sidebar-nav" className="flex-1 px-3 space-y-2 overflow-y-auto no-scrollbar">
        <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hidden md:block">
          Categorías
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              id={`sidebar-item-${item.key}`}
              key={item.key}
              onClick={() => onTabChange(item.key as any)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group relative overflow-hidden ${isActive
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
          )
        })}
      </nav>

      <div className="px-4 mt-auto pt-6 border-t border-zinc-900 space-y-4">
        {/* User Profile */}
        <div className="flex items-center gap-3 px-2">
          <img
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
            alt="Usuario"
            className="w-10 h-10 rounded-full border-2 border-emerald-500/20 object-cover"
          />
          <div className="hidden md:block overflow-hidden">
            <div className="text-sm font-bold text-white truncate">José M.</div>
            <div className="text-[10px] text-zinc-500 truncate">Admin</div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={onStartTutorial}
            className="w-full h-10 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 transition-all flex items-center justify-center gap-2 text-zinc-500 hover:text-white group"
          >
            <BookOpen size={16} className="group-hover:scale-110 transition-transform" />
            <span className="hidden md:block font-bold text-[10px] uppercase tracking-wider">Tutorial</span>
          </button>

          <button
            id="sidebar-management"
            onClick={onOpenInventory}
            className="w-full h-10 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 transition-all flex items-center justify-center gap-2 text-zinc-500 hover:text-white group"
          >
            <Settings size={16} className="group-hover:rotate-90 transition-transform" />
            <span className="hidden md:block font-bold text-[10px] uppercase tracking-wider">Gestión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
