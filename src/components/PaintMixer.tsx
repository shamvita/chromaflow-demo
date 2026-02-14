import React, { useState, useEffect, useMemo, useRef, type FormEvent } from 'react';
import {
  Droplet,
  Layers,
  Printer,
  RefreshCcw,
  User,
  Database,
  CheckCircle2,
  Hash,
  Trash2,
  Settings,
  Plus,
  X,
  Edit2,
  Search,
  Filter,
  Clock,
  Zap,
  ChevronDown,
  RotateCcw,
  Star
} from 'lucide-react';

// --- TYPES ---

interface ProductItem {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  price: number;
  stock: number;
  color: string;
  code?: string;
  isBaseRole?: boolean;
}

interface Inventory {
  preparacion: ProductItem[];
  color_brillo: ProductItem[];
  solventes: ProductItem[];
  complementos: ProductItem[];
  impermeabilizacion: ProductItem[];
}

interface MixTint {
  id: string;
  qty: number;
  category: keyof Inventory;
}

interface MixState {
  base: ProductItem | null;
  tints: MixTint[];
  customerName: string;
  date: string;
}

// Nueva: Fórmula guardada en historial
interface SavedFormula {
  id: string;
  customerName: string;
  code: string;
  date: string;
  baseId: string;
  baseName: string;
  tints: MixTint[];
  total: number;
}

// Nueva: Cliente guardado
interface SavedCustomer {
  name: string;
  lastVisit: string;
  formulaCount: number;
}

// --- MOCK DATA & CONFIG ---
const INITIAL_INVENTORY: Inventory = {
  preparacion: [
    { id: 'p1', category: 'Preparación', subcategory: 'Primers', name: 'Primer Universal Skylack', price: 28.00, stock: 25, color: '#808080', isBaseRole: true },
    { id: 'p2', category: 'Preparación', subcategory: 'Primers', name: 'Primer 2K Altura', price: 35.00, stock: 15, color: '#a0a0a0', isBaseRole: true },
    { id: 'p3', category: 'Preparación', subcategory: 'Fondos', name: 'Fondo Cromato de Zinc', price: 30.00, stock: 18, color: '#9acd32', isBaseRole: true },
    { id: 'p4', category: 'Preparación', subcategory: 'Fondos', name: 'Fondo Rellenador G3', price: 32.00, stock: 12, color: '#c0c0c0', isBaseRole: true },
    { id: 'p5', category: 'Preparación', subcategory: 'Masillas', name: 'Masilla Poliéster Maxi Rubber', price: 18.00, stock: 20, color: '#f5f5dc', isBaseRole: true },
    { id: 'p6', category: 'Preparación', subcategory: 'Masillas', name: 'Masilla Plástica K36', price: 14.00, stock: 50, color: '#d3d3d3', isBaseRole: true },
  ],
  color_brillo: [
    { id: 'c1', category: 'Color y Brillo', subcategory: 'Bases de Color', name: 'Base Poliéster (Bicapa)', price: 45.00, stock: 30, color: '#ffffff', isBaseRole: true },
    { id: 'c2', category: 'Color y Brillo', subcategory: 'Bases de Color', name: 'Esmalte Brillo Directo', price: 38.00, stock: 25, color: '#ffffff', isBaseRole: true },
    { id: 'c3', category: 'Color y Brillo', subcategory: 'Barnices', name: 'Barniz Skylack 15000', price: 65.00, stock: 10, color: '#e5e5e5', isBaseRole: true },
    { id: 'c4', category: 'Color y Brillo', subcategory: 'Barnices', name: 'Barniz Skylack 13000', price: 55.00, stock: 15, color: '#e5e5e5', isBaseRole: true },
    { id: 't1', category: 'Color y Brillo', subcategory: 'Tintes', name: 'Negro Humo', code: 'BK', price: 0.80, color: '#1a1a1a', stock: 5000 },
    { id: 't2', category: 'Color y Brillo', subcategory: 'Tintes', name: 'Ocre Amarillo', code: 'OY', price: 1.20, color: '#D4A017', stock: 2000 },
    { id: 't3', category: 'Color y Brillo', subcategory: 'Tintes', name: 'Rojo Oxido', code: 'RO', price: 1.10, color: '#8B0000', stock: 3500 },
    { id: 't4', category: 'Color y Brillo', subcategory: 'Tintes', name: 'Azul Phthalo', code: 'BL', price: 1.50, color: '#000f89', stock: 1200 },
  ],
  solventes: [
    { id: 's1', category: 'Solventes', subcategory: 'Thinners', name: 'Thinner Acrílico', price: 20.00, stock: 100, color: '#e0ffff' },
    { id: 's2', category: 'Solventes', subcategory: 'Thinners', name: 'Thinner Laca', price: 15.00, stock: 100, color: '#e0ffff' },
    { id: 's3', category: 'Solventes', subcategory: 'Thinners', name: 'Aguarrás', price: 12.00, stock: 50, color: '#fffff0' },
    { id: 's4', category: 'Solventes', subcategory: 'Limpieza', name: 'Desengrasante Automotriz', price: 18.00, stock: 30, color: '#f0f8ff' },
  ],
  complementos: [
    { id: 'q1', category: 'Complementos', subcategory: 'Catalizadores', name: 'Endurecedor Universal', price: 25.00, stock: 20, color: '#ffffff' },
    { id: 'q2', category: 'Complementos', subcategory: 'Aditivos', name: 'Flexibilizante', price: 30.00, stock: 10, color: '#f0f0f0' },
    { id: 'q3', category: 'Complementos', subcategory: 'Aditivos', name: 'Retardador', price: 22.00, stock: 15, color: '#f5f5f5' },
    { id: 'q4', category: 'Complementos', subcategory: 'Secantes', name: 'Secante de Cobalto', price: 15.00, stock: 25, color: '#ffffff' },
  ],
  impermeabilizacion: [
    { id: 'i1', category: 'Impermeab.', subcategory: 'Asfálticos', name: 'Manto Edil IPA', price: 48.00, stock: 30, color: '#2f4f4f' },
    { id: 'i2', category: 'Impermeab.', subcategory: 'Pintura', name: 'Pintura de Aluminio', price: 55.00, stock: 20, color: '#c0c0c0' },
    { id: 'i3', category: 'Impermeab.', subcategory: 'Selladores', name: 'KPO Sellador de Juntas', price: 18.00, stock: 20, color: '#f5f5dc' },
  ]
};

const PROFIT_MARGIN = 1.30; // 30% margin

const categoryLabels: Record<keyof Inventory, string> = {
  preparacion: 'Preparación y Fondos',
  color_brillo: 'Tintes y Acabados',
  solventes: 'Solventes y Diluyentes',
  complementos: 'Complementos y Químicos',
  impermeabilizacion: 'Impermeab. y Especialidades'
};

// --- COMPONENTS ---

// 1. Inventory Management Modal
interface InventoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Inventory;
  onAdd: (type: keyof Inventory, item: ProductItem) => void;
  onUpdate: (type: keyof Inventory, item: ProductItem) => void;
  onDelete: (type: keyof Inventory, id: string) => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ isOpen, onClose, inventory, onAdd, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState<keyof Inventory>('preparacion');
  const [editingItem, setEditingItem] = useState<Partial<ProductItem> | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const item: ProductItem = {
      id: editingItem?.id || Date.now().toString(),
      category: formData.get('category') as string,
      subcategory: formData.get('subcategory') as string,
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      stock: parseFloat(formData.get('stock') as string),
      color: formData.get('color') as string,
      code: formData.get('code') as string || '',
      isBaseRole: formData.get('isBaseRole') === 'true'
    };

    if (editingItem?.id) {
      onUpdate(activeTab, item);
    } else {
      onAdd(activeTab, item);
    }
    setEditingItem(null);
  };

  const items = inventory[activeTab] || [];


  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-zinc-900 w-full max-w-5xl h-[85vh] rounded-2xl border border-zinc-800 flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="text-emerald-500" />
            Gestión de Inventario
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar / Tabs */}
          <div className="w-56 bg-zinc-950 border-r border-zinc-800 p-4 space-y-2 overflow-y-auto">
            {(Object.keys(categoryLabels) as Array<keyof Inventory>).map((key) => (
              <button 
                key={key}
                onClick={() => { setActiveTab(key); setEditingItem(null); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all text-sm ${activeTab === key ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}
              >
                {categoryLabels[key]}
              </button>
            ))}
          </div>

          {/* Main Area */}
          <div className="flex-1 bg-zinc-900 p-6 overflow-y-auto">
            
            {editingItem ? (
              // FORM VIEW
              <div className="max-w-xl mx-auto">
                <h3 className="text-lg font-bold mb-6 text-zinc-300">
                  {editingItem.id ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Categoría</label>
                      <input name="category" value={categoryLabels[activeTab]} readOnly className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded-lg p-3 text-zinc-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Subcategoría</label>
                      <input name="subcategory" defaultValue={editingItem.subcategory} placeholder="Ej. Fondos, Tintes..." required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Nombre del Producto</label>
                      <input name="name" defaultValue={editingItem.name} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none" />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Código (opcional)</label>
                      <input name="code" defaultValue={editingItem.code} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none" />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Color (Hex)</label>
                      <div className="flex gap-2">
                         <input type="color" name="color" defaultValue={editingItem.color || '#ffffff'} className="h-12 w-12 bg-transparent cursor-pointer rounded overflow-hidden" />
                         <input type="text" name="color_text" value={editingItem.color || '#ffffff'} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-zinc-400 text-sm font-mono" readOnly />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Precio Unitario ($)</label>
                      <input type="number" step="0.01" name="price" defaultValue={editingItem.price} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Stock Actual</label>
                      <input type="number" step="0.01" name="stock" defaultValue={editingItem.stock} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none" />
                    </div>

                    <div className="col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" name="isBaseRole" value="true" defaultChecked={editingItem.isBaseRole} className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-xs font-medium text-zinc-400 text-left">Este producto puede usarse como Base en una mezcla</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8 pt-4 border-t border-zinc-800">
                    <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors">Cancelar</button>
                    <button type="submit" className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold text-white transition-colors">Guardar Cambios</button>
                  </div>
                </form>
              </div>
            ) : (
              // LIST VIEW
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-zinc-500">
                    Mostrando {items.length} productos en {categoryLabels[activeTab]}
                  </div>
                  <button 
                    onClick={() => setEditingItem({ category: categoryLabels[activeTab] })}
                    className="flex items-center gap-2 bg-zinc-100 text-zinc-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-white transition-colors"
                  >
                    <Plus size={16} /> Nuevo
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-xl flex items-center justify-between group hover:border-zinc-700 transition-all">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 rounded-full border border-zinc-700 shadow-inner"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="text-left">
                          <div className="font-bold text-zinc-200 flex items-center gap-2">
                            {item.name}
                            {item.subcategory && <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 border border-zinc-700">{item.subcategory}</span>}
                          </div>
                          <div className="text-xs text-zinc-500 font-mono">
                            Stock: {item.stock} • ${item.price}
                            {item.code && <span className="ml-2 px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">{item.code}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('¿Seguro que deseas eliminar este producto?')) onDelete(activeTab, item.id);
                          }}
                          className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="text-center py-20 text-zinc-600 border-2 border-dashed border-zinc-800 rounded-2xl">
                       No hay productos en esta categoría
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Custom Numpad for Touch Interface
interface NumpadProps {
  onInput: (key: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  value: string;
  label: string;
}

const Numpad: React.FC<NumpadProps> = ({ onInput, onClose, onConfirm, value, label }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'DEL'];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 text-center border-b border-zinc-800">
          <h3 className="text-zinc-400 text-sm uppercase tracking-widest mb-2">{label}</h3>
          <div className="text-5xl font-mono text-white font-light tracking-tighter">
            {value || '0'}<span className="text-zinc-600 text-2xl ml-2">gr</span>
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

// 3. Receipt Item Row
interface ReceiptItemProps {
  name: string;
  qty: number;
  unit: string;
  price: number;
  onDelete?: () => void;
  isBase?: boolean;
}

const ReceiptItem: React.FC<ReceiptItemProps> = ({ name, qty, unit, price, onDelete, isBase }) => (
  <div className="flex items-center justify-between py-3 border-b border-zinc-800/50 group">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${isBase ? 'bg-white' : 'bg-emerald-500'}`} />
      <div>
        <div className="text-zinc-200 font-medium">{name}</div>
        <div className="text-xs text-zinc-500 font-mono">
          {qty} {unit} × ${price.toFixed(2)}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-zinc-300 font-mono font-medium">
        ${(qty * price).toFixed(2)}
      </div>
      {!isBase && onDelete && (
        <button 
          onClick={onDelete}
          className="p-1 text-zinc-600 hover:text-red-400 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  </div>
);

// --- MAIN APP ---
export default function PaintMixer() {
  // State
  const [inventory, setInventory] = useState<Inventory>(INITIAL_INVENTORY);
  const [currentMix, setCurrentMix] = useState<MixState>({
    base: null,
    tints: [], // { id, qty, category }
    customerName: 'Juan Pérez',
    date: new Date().toISOString()
  });
  
  // UI States
  const [numpadOpen, setNumpadOpen] = useState(false);
  const [showInventoryManager, setShowInventoryManager] = useState(false);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMainCategory, setActiveMainCategory] = useState<keyof Inventory | 'all'>('all');
  
  // Numpad Logic vars
  const [activeTinte, setActiveTinte] = useState<{id: string, category: keyof Inventory} | null>(null);
  const [tempValue, setTempValue] = useState('');
  
  // Notification State (Optional: can be handled by a toast library later)
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'info' | 'error'} | null>(null);

  // Load Inventory from LocalStorage on Mount
  useEffect(() => {
    const savedInv = localStorage.getItem('paint_inv_mvp');
    if (savedInv) {
      setInventory(JSON.parse(savedInv));
    }
  }, []);

  // Persist Inventory Helper
  const saveInventory = (newInv: Inventory) => {
    setInventory(newInv);
    localStorage.setItem('paint_inv_mvp', JSON.stringify(newInv));
  };

  // CRUD Operations
  const handleAddItem = (type: keyof Inventory, item: ProductItem) => {
    const newInv = { ...inventory, [type]: [...inventory[type], item] };
    saveInventory(newInv);
    showNotification(`${item.name} agregado`, 'success');
  };

  const handleUpdateItem = (type: keyof Inventory, updatedItem: ProductItem) => {
    const newInv = { 
      ...inventory, 
      [type]: inventory[type].map(i => i.id === updatedItem.id ? updatedItem : i) 
    };
    saveInventory(newInv);
    showNotification(`${updatedItem.name} actualizado`, 'success');
  };

  const handleDeleteItem = (type: keyof Inventory, id: string) => {
    const newInv = {
      ...inventory,
      [type]: inventory[type].filter(i => i.id !== id)
    };
    saveInventory(newInv);
    showNotification('Producto eliminado', 'info');
  };

  // Helpers
  const showNotification = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReset = () => {
    if(window.confirm("¿Reiniciar mezcla? Esto no afecta el inventario.")){
        setCurrentMix(prev => ({
            ...prev,
            base: null,
            tints: [],
            date: new Date().toISOString()
        }));
    }
  };

  const handleHardReset = () => {
      if(window.confirm("⚠ ¿RESTABLECER INVENTARIO DEMO? \nEsto volverá los niveles de stock al 100%.")){
          saveInventory(INITIAL_INVENTORY);
          showNotification("Inventario Restablecido", "info");
      }
  };

  // Logic: Filtering
  const filteredInventory = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    const result: Partial<Inventory> = {};
    
    (Object.keys(inventory) as Array<keyof Inventory>).forEach(cat => {
      // Filter by search term and active category
      const matches = inventory[cat].filter(item => {
        const matchesSearch = !term || 
          item.name.toLowerCase().includes(term) || 
          (item.code && item.code.toLowerCase().includes(term)) ||
          item.subcategory.toLowerCase().includes(term);
        
        const matchesCategory = activeMainCategory === 'all' || activeMainCategory === cat;
        
        return matchesSearch && matchesCategory;
      });
      
      if (matches.length > 0) {
        result[cat] = matches;
      }
    });
    
    return result as Inventory;
  }, [inventory, searchTerm, activeMainCategory]);

  // Logic: Calculations
  const calculations = useMemo(() => {
    let cost = 0;
    let totalVolume = 0; // simplistic volume calc

    if (currentMix.base) {
      cost += currentMix.base.price;
      totalVolume += 1; // 1 gallon
    }

    currentMix.tints.forEach(item => {
      const tint = inventory[item.category].find(t => t.id === item.id);
      if (tint) {
        cost += item.qty * tint.price;
        totalVolume += (item.qty * 0.001); // converting grams to approx volume ratio for visual only
      }
    });

    const subtotal = cost;
    const total = cost * PROFIT_MARGIN;
    
    return { subtotal, total, totalVolume };
  }, [currentMix, inventory]);

  // Logic: Add Ingredients
  const selectBase = (base: ProductItem) => {
    setCurrentMix(prev => ({ ...prev, base }));
  };

  const openTinteInput = (tinteId: string, category: keyof Inventory) => {
    setActiveTinte({ id: tinteId, category });
    setTempValue('');
    setNumpadOpen(true);
  };

  const handleNumpadInput = (key: string) => {
    if (key === 'DEL') {
      setTempValue(prev => prev.slice(0, -1));
      return;
    }
    if (key === '.' && tempValue.includes('.')) return;
    setTempValue(prev => prev + key);
  };

  const confirmTinteAdd = () => {
    if (!activeTinte) return;
    const qty = parseFloat(tempValue);
    if (!qty || qty <= 0) {
      setNumpadOpen(false);
      return;
    }

    // Check if adding more to existing tinte or new
    setCurrentMix(prev => {
      const existingIdx = prev.tints.findIndex(t => t.id === activeTinte.id);
      let newTints = [...prev.tints];
      
      if (existingIdx >= 0) {
        // Update existing (Cumulative for adjustments!)
        newTints[existingIdx] = {
          ...newTints[existingIdx],
          qty: newTints[existingIdx].qty + qty
        };
      } else {
        // Add new
        newTints.push({ id: activeTinte.id, qty, category: activeTinte.category });
      }
      return { ...prev, tints: newTints };
    });

    setNumpadOpen(false);
  };

  const removeTinte = (id: string) => {
    setCurrentMix(prev => ({
      ...prev,
      tints: prev.tints.filter(t => t.id !== id)
    }));
  };

  // Logic: Finalize & Print
  const handleFinalize = () => {
    if (!currentMix.base) {
      showNotification("Selecciona una base primero", "error");
      return;
    }

    // 1. Deduct Inventory
    const newInventory = JSON.parse(JSON.stringify(inventory)) as Inventory;
    
    // Deduct Base
    // We need to find which category the base belongs to
    const baseCat = (Object.keys(newInventory) as Array<keyof Inventory>).find(cat => 
      newInventory[cat].some(p => p.id === currentMix.base?.id)
    );

    if(baseCat) {
      newInventory[baseCat] = newInventory[baseCat].map(p => 
        p.id === currentMix.base?.id ? { ...p, stock: p.stock - 1 } : p
      );
    }

    // Deduct Tints
    currentMix.tints.forEach(mixTint => {
      const cat = mixTint.category;
      newInventory[cat] = newInventory[cat].map(p => 
        p.id === mixTint.id ? { ...p, stock: p.stock - mixTint.qty } : p
      );
    });

    // 2. Persist
    saveInventory(newInventory);

    // 3. Generate Code
    const code = `${currentMix.customerName.substring(0,3).toUpperCase()}-${Math.floor(Math.random()*1000)}`;
    
    // 4. Feedback
    showNotification(`Etiqueta generada: ${code}`);
  };

  // Calculate dominant color for visualizer (very basic approximation)
  const visualColor = useMemo(() => {
    if (currentMix.tints.length === 0) return currentMix.base ? currentMix.base.color : '#18181b';
    // Find tinte with max quantity
    const dominantTint = currentMix.tints.reduce((prev, current) => 
      (prev.qty > current.qty) ? prev : current
    );
    const tintObj = inventory[dominantTint.category].find(t => t.id === dominantTint.id);
    return tintObj ? tintObj.color : '#fff';
  }, [currentMix, inventory]);


  return (
    <div className="flex h-screen w-full bg-black text-zinc-100 font-sans selection:bg-emerald-500 selection:text-white overflow-hidden">
      
      {/* --- LEFT: CONTROL PANEL --- */}
      <div className="w-2/3 flex flex-col border-r border-zinc-800">
        
        {/* Header */}
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-900/50 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Droplet className="text-white fill-current" size={24} />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-lg leading-none">COLOR MASTER</h1>
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Estación de Mezcla 01</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {/* Inventory Management Button */}
             <button 
                onClick={() => setShowInventoryManager(true)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
                title="Gestión de Inventario"
             >
                <Settings size={20} />
             </button>

             {/* Hidden Reset for Demo */}
             <button onClick={handleHardReset} className="text-zinc-700 hover:text-red-500 transition-colors" title="Reset Total">
                <Database size={18} />
             </button>
             
             <div className="flex items-center gap-3 bg-zinc-800 py-2 px-4 rounded-full border border-zinc-700/50">
                <Search size={16} className="text-zinc-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-sm font-medium w-48 placeholder-zinc-600 outline-none"
                  placeholder="Buscar producto (ej. Aguarrás)..."
                />
             </div>

             <div className="flex items-center gap-3 bg-zinc-800 py-2 px-4 rounded-full border border-zinc-700/50">
                <User size={16} className="text-zinc-400" />
                <input 
                  type="text" 
                  value={currentMix.customerName}
                  onChange={(e) => setCurrentMix(prev => ({...prev, customerName: e.target.value}))}
                  className="bg-transparent border-none focus:ring-0 text-sm font-medium w-32 placeholder-zinc-600 outline-none"
                  placeholder="Cliente..."
                />
             </div>
          </div>
        </header>

        {/* Workspace Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Workspace Sidebar */}
          <aside className="w-64 bg-zinc-950/20 border-r border-zinc-900 p-6 flex flex-col gap-6">
            <div>
              <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Filter size={12} /> Filtrar por Taller
              </h3>
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveMainCategory('all')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMainCategory === 'all' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}
                >
                  Todos los Productos
                </button>
                {(Object.keys(categoryLabels) as Array<keyof Inventory>).map((key) => (
                  <button 
                    key={key}
                    onClick={() => setActiveMainCategory(key)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMainCategory === key ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}
                  >
                    {categoryLabels[key]}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-auto p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
               <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Usa el buscador o el sidebar para encontrar bases y tintes rápidamente."
               </p>
            </div>
          </aside>

          {/* Main Workspace Content */}
          <main className="flex-1 p-8 overflow-y-auto">
            
            {/* Search Result Counter */}
            {searchTerm && (
              <div className="mb-6 flex items-center gap-2 text-zinc-500 text-sm">
                <Search size={14} />
                Resultados para <span className="text-emerald-400 font-bold">"{searchTerm}"</span>
              </div>
            )}
          
          {/* Section 1: Bases */}
          <div className="mb-10">
            <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layers size={14} /> 1. Seleccionar Base
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.keys(filteredInventory) as Array<keyof Inventory>).flatMap(cat => filteredInventory[cat] || []).filter(p => p.isBaseRole).map(base => (
                <button
                  key={base.id}
                  onClick={() => selectBase(base)}
                  className={`relative group p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    currentMix.base?.id === base.id 
                    ? 'border-emerald-500 bg-emerald-500/10' 
                    : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full border border-zinc-700 shadow-inner shrink-0"
                          style={{ backgroundColor: base.color }}
                        />
                        <div className="flex flex-col items-start text-left">
                            <span className={`text-sm font-bold truncate max-w-[120px] ${currentMix.base?.id === base.id ? 'text-emerald-400' : 'text-zinc-300'}`}>
                                {base.name}
                            </span>
                            {base.category && <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">{base.category}</span>}
                        </div>
                    </div>
                    {currentMix.base?.id === base.id && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-zinc-500">Stock: {base.stock}</span>
                    <span className="font-mono text-zinc-400">${base.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Tints & Additives */}
          <div>
            <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Droplet size={14} /> 2. Añadir Tintes / Pigmentos / Aditivos
            </h2>
            <div className="space-y-6">
              {(['color_brillo', 'preparacion', 'solventes', 'complementos', 'impermeabilizacion'] as Array<keyof Inventory>).map(catKey => {
                const items = (filteredInventory[catKey] || []).filter(p => !p.isBaseRole);
                if (items.length === 0) return null;
                
                return (
                  <div key={catKey}>
                    <h3 className="text-[10px] font-bold text-zinc-600 uppercase mb-3 border-b border-zinc-800 pb-1">{categoryLabels[catKey]}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {items.map(tinte => (
                        <button
                          key={tinte.id}
                          onClick={() => openTinteInput(tinte.id, catKey)}
                          disabled={!currentMix.base}
                          className={`flex flex-col items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 transition-all ${
                            !currentMix.base ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:bg-zinc-800 hover:scale-105 active:scale-95'
                          }`}
                        >
                          <div 
                            className="w-12 h-12 rounded-full shadow-lg border-2 border-zinc-700 ring-2 ring-transparent group-hover:ring-zinc-600 transition-all"
                            style={{ backgroundColor: tinte.color }}
                          />
                          <div className="text-center">
                            <div className="text-xs font-bold text-zinc-300 mb-0.5">{tinte.code || 'S/C'}</div>
                            <div className="text-[10px] text-zinc-500 tracking-tight line-clamp-1">{tinte.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {Object.keys(filteredInventory).length === 0 && (
               <div className="text-center py-20 bg-zinc-900/20 border-2 border-dashed border-zinc-800/50 rounded-2xl">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                    <Search size={32} className="text-zinc-400" />
                  </div>
                  <h3 className="text-zinc-400 font-bold">No se encontraron productos</h3>
                  <p className="text-zinc-600 text-sm mt-1">Intenta con otro término de búsqueda o categoría</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setActiveMainCategory('all'); }}
                    className="mt-6 text-emerald-500 text-sm font-bold hover:underline"
                  >
                    Restablecer Filtros
                  </button>
               </div>
            )}
            {!currentMix.base && (
               <div className="mt-8 text-center text-zinc-600 text-sm italic py-10 border border-dashed border-zinc-800 rounded-2xl">
                 Selecciona una base para habilitar los tintes y aditivos
               </div>
            )}
          </div>

          {/* Visualization of Inventory Impact */}
          <div className="mt-12 p-6 bg-zinc-900/40 rounded-2xl border border-zinc-800/50">
             <div className="flex items-center gap-2 mb-4 text-zinc-500">
                <Database size={14} />
                <span className="text-xs font-bold uppercase tracking-widest">Estado del Inventario (Tiempo Real)</span>
             </div>
             <div className="space-y-3">
                {(['color_brillo', 'preparacion', 'solventes'] as Array<keyof Inventory>).flatMap(cat => inventory[cat].slice(0, 2)).map(t => (
                   <div key={t.id} className="flex items-center gap-4">
                      <span className="text-xs w-24 text-zinc-400 font-mono truncate">{t.name}</span>
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                         <div 
                            className="h-full bg-zinc-600 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min((t.stock / 5000) * 100, 100)}%` }} // Simplified visual logic
                         />
                      </div>
                      <span className="text-xs w-16 text-right text-zinc-500 font-mono">{t.stock}g</span>
                   </div>
                ))}
             </div>
          </div>

          </main>
        </div>
      </div>

      {/* --- RIGHT: RECIPE & OUTPUT --- */}
      <div className="w-1/3 bg-zinc-950 flex flex-col relative shadow-2xl z-10">
        
        {/* Visualizer Area */}
        <div className="h-64 relative flex items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800 overflow-hidden">
           <div 
              className="absolute inset-0 opacity-40 blur-3xl transition-colors duration-1000 ease-in-out"
              style={{ backgroundColor: visualColor }}
           />
           <div className="relative z-10 text-center">
              <div 
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white/10 shadow-2xl transition-all duration-700 ease-out"
                style={{ 
                    backgroundColor: visualColor,
                    boxShadow: `0 0 60px ${visualColor}40`
                }}
              />
              <div className="text-zinc-400 text-xs font-mono uppercase tracking-widest">Simulación de Tono</div>
           </div>
        </div>

        {/* The Receipt / Recipe List */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
               <Hash size={18} className="text-emerald-500"/> 
               Orden Actual
            </h3>
            <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded">
               {new Date().toLocaleDateString()}
            </span>
          </div>

          <div className="space-y-1">
            {currentMix.base ? (
              <ReceiptItem 
                isBase
                name={currentMix.base.name} 
                qty={1} 
                unit="Gal" 
                price={currentMix.base.price} 
              />
            ) : (
              <div className="text-center py-8 text-zinc-600 text-sm border-2 border-dashed border-zinc-800 rounded-lg">
                Esperando configuración...
              </div>
            )}

            {currentMix.tints.map(item => {
              const tinte = inventory[item.category].find(t => t.id === item.id);
              if (!tinte) return null; 
              
              return (
                <ReceiptItem
                  key={item.id}
                  name={tinte.name}
                  qty={item.qty}
                  unit="g"
                  price={tinte.price}
                  onDelete={() => removeTinte(item.id)}
                />
              );
            })}
          </div>

          {/* Pricing Card */}
          <div className="mt-8 bg-zinc-900 rounded-xl p-6 border border-zinc-800">
             <div className="flex justify-between mb-2 text-sm text-zinc-500">
                <span>Costo Materiales</span>
                <span className="font-mono">${calculations.subtotal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between mb-4 text-sm text-zinc-500">
                <span>Margen (30%)</span>
                <span className="font-mono text-emerald-500/70">+ ${(calculations.total - calculations.subtotal).toFixed(2)}</span>
             </div>
             <div className="h-px bg-zinc-700 my-4" />
             <div className="flex justify-between items-end">
                <span className="font-bold text-zinc-200">Total a Cobrar</span>
                <span className="text-4xl font-mono font-light tracking-tighter text-white">
                  ${calculations.total.toFixed(2)}
                </span>
             </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-zinc-900 border-t border-zinc-800 grid grid-cols-2 gap-4">
          <button 
            onClick={handleReset}
            className="flex items-center justify-center gap-2 h-14 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 transition-colors"
          >
            <RefreshCcw size={18} />
            Reiniciar
          </button>
          <button 
            onClick={handleFinalize}
            className="flex items-center justify-center gap-2 h-14 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-900/20 transition-all active:scale-95"
          >
            <Printer size={18} />
            Finalizar y Etiqueta
          </button>
        </div>
      </div>

      {/* --- OVERLAYS --- */}
      
      {/* Inventory Manager Modal */}
      <InventoryManager 
        isOpen={showInventoryManager}
        onClose={() => setShowInventoryManager(false)}
        inventory={inventory}
        onAdd={handleAddItem}
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteItem}
      />

      {/* Numpad Modal */}
      {numpadOpen && (
        <Numpad 
          value={tempValue}
          onInput={handleNumpadInput}
          onClose={() => setNumpadOpen(false)}
          onConfirm={confirmTinteAdd}
          label="Ingresar Cantidad"
        />
      )}

      {/* Notifications */}
      {notification && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[100] animate-bounce ${
            notification.type === 'success' ? 'bg-emerald-600' : 'bg-zinc-800'
        }`}>
            <span className="text-white font-bold">{notification.msg}</span>
        </div>
      )}
    </div>
  );
}
