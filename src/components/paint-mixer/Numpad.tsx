import React from 'react';

interface NumpadProps {
  onInput: (key: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  value: string;
  label: string;
  unit?: string;
}

const Numpad: React.FC<NumpadProps> = ({ onInput, onClose, onConfirm, value, label, unit = 'gr' }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'DEL'];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 text-center border-b border-zinc-800">
          <h3 className="text-zinc-400 text-sm uppercase tracking-widest mb-2">{label}</h3>
          <div className="text-5xl font-mono text-white font-light tracking-tighter">
            {value || '0'}<span className="text-zinc-600 text-2xl ml-2">{unit}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-px bg-zinc-800">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => onInput(key)}
              className={`h-20 text-2xl font-light active:bg-zinc-700 transition-colors ${
                key === 'DEL' ? 'text-red-400 bg-zinc-900/50' : 'text-white bg-zinc-900'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-px bg-zinc-800">
           <button 
            onClick={onClose}
            className="h-20 bg-zinc-900 text-zinc-400 font-medium uppercase tracking-wider text-sm hover:text-white"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="h-20 bg-emerald-600 text-white font-bold uppercase tracking-wider text-sm hover:bg-emerald-500"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Numpad;
