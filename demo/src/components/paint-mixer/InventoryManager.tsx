import React, { useState, type FormEvent } from 'react';
import { Settings, X, Plus, Edit2, Trash2 } from 'lucide-react';
import type { Inventory, ProductItem } from './types';
import { CATEGORY_LABELS } from './constants';

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
      isBaseRole: formData.get('isBaseRole') === 'true',
      unit: formData.get('unit') as string || 'u'
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
            {(Object.keys(CATEGORY_LABELS) as Array<keyof Inventory>).map((key) => (
              <button 
                key={key}
                onClick={() => { setActiveTab(key); setEditingItem(null); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all text-sm ${activeTab === key ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}
              >
                {CATEGORY_LABELS[key]}
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
                      <input name="category" value={CATEGORY_LABELS[activeTab]} readOnly className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded-lg p-3 text-zinc-400 focus:outline-none" />
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
                      <input type="number" min="0" step="0.01" name="price" defaultValue={editingItem.price} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Stock Actual</label>
                      <input type="number" min="0" step="0.01" name="stock" defaultValue={editingItem.stock} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Unidad (ej. L, ml, gr)</label>
                      <input name="unit" defaultValue={editingItem.unit || 'u'} placeholder="u" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none" />
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
                    Mostrando {items.length} productos en {CATEGORY_LABELS[activeTab]}
                  </div>
                  <button 
                    onClick={() => setEditingItem({ category: CATEGORY_LABELS[activeTab] })}
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
                            Stock: {item.stock} {item.unit || 'u'} • ${item.price}
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

export default InventoryManager;
