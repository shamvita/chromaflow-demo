import React from 'react';
import { RefreshCcw, Zap } from 'lucide-react';

interface MixerHeaderProps {
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  visualColor: string;
  step: number;
  onReset: () => void;
}

const MixerHeader: React.FC<MixerHeaderProps> = ({
  customerName,
  onCustomerNameChange,
  visualColor,
  step,
  onReset,
}) => {
  return (
    <header className="h-24 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl flex items-center justify-between px-8 z-20">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div 
            className="w-14 h-14 rounded-full border-2 border-white/10 shadow-2xl transition-all duration-700"
            style={{ backgroundColor: visualColor, boxShadow: `0 0 40px ${visualColor}30` }}
          />
          <div className="absolute -bottom-1 -right-1 bg-zinc-900 rounded-full p-1 border border-zinc-800">
            <Zap size={10} className="text-emerald-500" />
          </div>
        </div>
        <div>
          <input 
            type="text" 
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-xl font-bold p-0 placeholder-zinc-700 outline-none w-64"
            placeholder="Nombre del Cliente..."
          />
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Mezcla Actual • {new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {step > 1 && (
          <button onClick={onReset} className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-500/30 flex items-center justify-center transition-all">
            <RefreshCcw size={18} />
          </button>
        )}
      </div>
    </header>
  );
};

export default MixerHeader;
