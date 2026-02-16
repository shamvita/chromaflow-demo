import { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, Printer } from 'lucide-react';

import type { Inventory, ProductItem, MixState, MixTint, NotificationState, SavedFormula } from './paint-mixer';
import {
  INITIAL_INVENTORY,
  PROFIT_MARGIN,
  InventoryManager,
  Numpad,
  Sidebar,
  MixerHeader,
  StepFinalReview,
  ProductGrid,
  MixSummary,
  FormulaPreview,
  ColorPicker
} from './paint-mixer';
import { useTutorial } from '../hooks/useTutorial';
import { mixColors, getMeldingWeight } from '../utils/color';

// --- MAIN APP ---
export default function PaintMixer() {
  // State
  const [inventory, setInventory] = useState<Inventory>(INITIAL_INVENTORY);
  const [currentMix, setCurrentMix] = useState<MixState>({
    bases: [],
    tints: [],
    customerName: 'Cliente Nuevo',
    date: new Date().toISOString()
  });
  
  // UI States
  const [activeTab, setActiveTab] = useState<keyof Inventory | 'color_picker'>('personalizados');
  
  const [numpadOpen, setNumpadOpen] = useState(false);
  const [showInventoryManager, setShowInventoryManager] = useState(false);
  const [viewingFormula, setViewingFormula] = useState<ProductItem | null>(null);
  const [showFinalReview, setShowFinalReview] = useState(false);
  const { startTutorial } = useTutorial();
  
  // Tutorial Check
  useEffect(() => {
    const seen = localStorage.getItem('chromaflow_tutorial_seen');
    if (!seen) {
      setTimeout(() => {
        startTutorial();
        localStorage.setItem('chromaflow_tutorial_seen', 'true');
      }, 1500); // Small delay for better UX
    }
  }, []);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  
  // Numpad Logic vars
  const [activeProductToAdd, setActiveProductToAdd] = useState<ProductItem | null>(null);
  const [tempValue, setTempValue] = useState('');
  
  // Notification State
  const [notification, setNotification] = useState<NotificationState | null>(null);

  // Saved Formulas State
  const [savedFormulas, setSavedFormulas] = useState<SavedFormula[]>([]);

  // Load Inventory & Formulas from LocalStorage on Mount
  useEffect(() => {
    // 1. Load Inventory
    const savedInv = localStorage.getItem('paint_inv_mvp');
    let loadedInventory = { ...INITIAL_INVENTORY };
    
    if (savedInv) {
      const parsed = JSON.parse(savedInv);
      // Determine if migration is needed or just apply default units to old items
      const migratedInventory = { ...INITIAL_INVENTORY };
      
      (Object.keys(parsed) as Array<keyof Inventory>).forEach((cat) => {
          if (Array.isArray(parsed[cat])) {
              migratedInventory[cat] = parsed[cat].map((p: ProductItem) => {
                  let newItem = { ...p };
                  
                  // Fix negative stock
                  if (newItem.stock < 0) newItem.stock = 0;

                  // 1. Try to find in INITIAL_INVENTORY for canonical unit
                  const canonical = INITIAL_INVENTORY[cat as keyof Inventory]?.find((x: ProductItem) => x.id === newItem.id);
                  
                  // Determine Target Unit
                  let targetUnit: string | undefined = newItem.unit;
                  
                  if (canonical) {
                      targetUnit = canonical.unit;
                  } else {
                      // Defaults for custom items
                      if (cat === 'bases_auto') targetUnit = 'kg';
                      else if (cat === 'tintes') targetUnit = 'gr';
                      else if (cat === 'bases_arq' || cat === 'solventes') targetUnit = targetUnit || 'gal';
                      else if (cat === 'barnices_acabados') targetUnit = targetUnit || 'u';
                      
                      // Fallback for others
                      if (!targetUnit) {
                          if (cat === 'envases') targetUnit = 'u';
                          else if (cat === 'personalizados') targetUnit = 'u';
                          else targetUnit = 'L';
                      }
                  }

                  // Perform Stock Conversion if detected mismatch
                  // 1. L/u -> gr (Tints)
                  if ((!newItem.unit || newItem.unit === 'L') && targetUnit === 'gr') {
                      if (newItem.stock < 1000) newItem.stock *= 1000; 
                  }
                  // 2. gr -> kg (Auto Bases)
                  else if (newItem.unit === 'gr' && targetUnit === 'kg') {
                      if (newItem.stock > 50) newItem.stock /= 1000;
                  }
                  // 3. gr -> L (Varnish fix for bad migration)
                  else if (newItem.unit === 'gr' && targetUnit === 'L') {
                      if (newItem.stock > 500) newItem.stock /= 1000;
                  }
                  
                  newItem.unit = targetUnit || 'u';
                  
                  return newItem;
              });
          }
      });
      loadedInventory = migratedInventory;
    }

    // 2. Load Formulas
    const savedForms = localStorage.getItem('paint_formulas_mvp');
    if (savedForms) {
      const parsed = JSON.parse(savedForms);
      // Migration for legacy data
      const migrated = parsed.map((f: any) => {
        if (!f.bases && f.baseId) {
            return {
                ...f,
                bases: [{ id: f.baseId, name: f.baseName, qty: 1 }],
            };
        }
        return f;
      });
      setSavedFormulas(migrated);
      
      // 3. Populate 'personalizados' in inventory
      const formulasAsProducts: ProductItem[] = migrated.map((f: SavedFormula) => ({
          id: f.id,
          category: 'personalizados',
          subcategory: 'Fórmulas',
          name: `${f.customerName} - ${f.colorName || 'Sin Nombre'}`,
          price: f.total, // Store raw cost or price? Assuming price.
          stock: 999, // Virtual stock
          color: f.color || '#808080', 
          formula: f, // Attach full formula for reference
          unit: f.containerName?.replace(/Envase\s?/i, '') || 'u'
      }));
      
      loadedInventory.personalizados = formulasAsProducts;
    }
    
    setInventory(loadedInventory);
  }, []);

  // --- Helpers ---

  const saveInventory = (newInv: Inventory) => {
    // Don't save 'personalizados' field to localStorage inventory to avoid duplication/circular logic
    // We strictly rebuild 'personalizados' from savedFormulas on load.
    const invToSave = { ...newInv };
    invToSave.personalizados = []; 
    setInventory(newInv);
    localStorage.setItem('paint_inv_mvp', JSON.stringify(invToSave));
  };

  const saveFormula = (newFormula: SavedFormula) => {
    const updated = [newFormula, ...savedFormulas];
    setSavedFormulas(updated);
    localStorage.setItem('paint_formulas_mvp', JSON.stringify(updated));
    
    // Update 'personalizados' in current inventory state
    const newProduct: ProductItem = {
        id: newFormula.id,
        category: 'personalizados',
        subcategory: 'Fórmulas',
        name: `${newFormula.customerName} - ${newFormula.colorName || 'Sin Nombre'}`,
        price: newFormula.total,
        stock: 999,
        color: newFormula.color || '#808080',
        formula: newFormula,
        unit: newFormula.containerName?.replace(/Envase\s?/i, '') || 'u'
    };
    
    setInventory(prev => ({
        ...prev,
        personalizados: [newProduct, ...prev.personalizados]
    }));
  };

  const showNotification = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- CRUD Operations ---

  const handleAddItem = (type: keyof Inventory, item: ProductItem) => {
    const newInv = { ...inventory, [type]: [...inventory[type], item] };
    saveInventory(newInv);
    showNotification(`${item.name} agregado`, 'success');
  };

  const handleUpdateItem = (type: keyof Inventory, updatedItem: ProductItem) => {
    const newInv = { 
      ...inventory, 
      [type]: inventory[type].map((i: ProductItem) => i.id === updatedItem.id ? updatedItem : i) 
    };
    saveInventory(newInv);
    showNotification(`${updatedItem.name} actualizado`, 'success');
  };

  const handleDeleteItem = (type: keyof Inventory, id: string) => {
    const newInv = {
      ...inventory,
      [type]: inventory[type].filter((i: ProductItem) => i.id !== id)
    };
    saveInventory(newInv);
    showNotification('Producto eliminado', 'info');
  };

  // --- Mix Logic ---

  const handleReset = () => {
    if(window.confirm("¿Reiniciar mezcla? Esto no afecta el inventario.")){
      setCurrentMix((prev: MixState) => ({
        ...prev,
        bases: [],
        tints: [],
        date: new Date().toISOString(),
        container: undefined,
        currentInventory: undefined // Clean up
      }));
      setShowFinalReview(false);
    }
  };

  // --- Explode Formula Logic ---
  const handleExplodeFormula = (formulaItem: ProductItem) => {
      if (!formulaItem.formula) return;
      const f = formulaItem.formula;
      
      // Add Bases
      const addedBases: any[] = [];
      f.bases.forEach(base => {
          let product: ProductItem | undefined;
          // Search all categories for base product
          for (const cat of Object.keys(inventory) as Array<keyof Inventory>) {
               const found = inventory[cat].find(p => p.id === base.id);
               if (found) {
                   product = found;
                   break;
               }
          }
          if (product) {
              addedBases.push({ product, qty: base.qty });
          }
      });
      
      // Find Container if needed
      let newContainer = currentMix.container;
      if (!newContainer && f.containerId) {
           const found = inventory.envases?.find(p => p.id === f.containerId);
           if (found) newContainer = found;
      }

      setCurrentMix(prev => ({
          ...prev,
          bases: [...prev.bases, ...addedBases],
          tints: [...prev.tints, ...f.tints],
          container: newContainer,
          referenceImage: f.referenceImage,
          customerName: f.customerName, // Optionally restore customer name? Or keep default? Let's restore as base for restart.
          colorName: f.colorName 
      }));
      
      setViewingFormula(null);
      showNotification('Fórmula desglosada y agregada a la mezcla');
  };

  // --- Add to Mix Handlers ---

  const handleProductClick = (product: ProductItem) => {
    // If it's a formula, show preview first
    if (product.category === 'personalizados' && product.formula) {
        setViewingFormula(product);
        return;
    }
    
    // Envases -> Set Container immediately (maybe ask qty if we tracked container usage as array? MVP: single container type)
    if (product.category === 'Envases') { // Check casing in inventory, it's 'Envases' key 'envases'?
        // Key is 'envases', item category string is 'Envases' usually.
        // Let's rely on activeTab or check subcategory
         setCurrentMix(prev => ({ ...prev, container: product }));
         return;
    }
    
    // For all others, open Numpad
    setActiveProductToAdd(product);
    setTempValue('');
    setNumpadOpen(true);
  };

  const handleNumpadInput = (key: string) => {
    if (key === 'DEL') {
      setTempValue((prev: string) => prev.slice(0, -1));
      return;
    }
    if (key === '.' && tempValue.includes('.')) return;
    setTempValue((prev: string) => prev + key);
  };

  const confirmAddToMix = () => {
      if (!activeProductToAdd) return;
      const qty = parseFloat(tempValue);
      if (!qty || qty <= 0) {
          setNumpadOpen(false);
          return;
      }

      // Logic to decide if it's a Base or Tint
      // Rule 1: 'Personalizados' -> Base? Or allow user choice? Let's default to Base for now as per requirement "Use as ingredient".
      // Rule 2: 'Envases' -> Container
      // Rule 3: Everything else -> Tint/Additive
      
      // We can also allow 'isBaseRole' property to override.
      
      let isBase = activeTab === 'personalizados' || activeProductToAdd.isBaseRole;
      
      // If it has isBaseRole, treat as base. Otherwise treat as tint/additive.
      
      // Simplified:
      if (activeTab === 'envases') { // Should be caught by click handler, but safety
           setCurrentMix(prev => ({ ...prev, container: activeProductToAdd }));
           setNumpadOpen(false);
           return;
      }

      setCurrentMix(prev => {
          if (isBase) {
              const existingIdx = prev.bases.findIndex(b => b.product.id === activeProductToAdd.id);
              const newBases = [...prev.bases];
              if (existingIdx >= 0) {
                  newBases[existingIdx] = { ...newBases[existingIdx], qty: newBases[existingIdx].qty + qty };
              } else {
                  newBases.push({ product: activeProductToAdd, qty });
              }
              return { ...prev, bases: newBases };
          } else {
              // Tint Logic
               const existingIdx = prev.tints.findIndex(t => t.id === activeProductToAdd.id);
               const newTints = [...prev.tints];
               if (existingIdx >= 0) {
                   newTints[existingIdx] = { ...newTints[existingIdx], qty: newTints[existingIdx].qty + qty };
               } else {
                   // We need to store category for lookup later
                   const catKey = (Object.keys(inventory) as Array<keyof Inventory>).find(k => k === activeTab) || 'tintes';
                   newTints.push({ id: activeProductToAdd.id, qty, category: catKey });
               }
               return { ...prev, tints: newTints };
          }
      });
      
      setNumpadOpen(false);
      setActiveProductToAdd(null);
  };

  const handleRemoveBase = (id: string) => {
      setCurrentMix(prev => ({ ...prev, bases: prev.bases.filter(b => b.product.id !== id) }));
  };

  const handleRemoveTint = (id: string) => {
      setCurrentMix(prev => ({ ...prev, tints: prev.tints.filter(t => t.id !== id) }));
  };

  const handleRemoveContainer = () => {
      setCurrentMix(prev => ({ ...prev, container: undefined }));
  };


  const handleFinalize = (skipReset = false) => {
    if (currentMix.bases.length === 0 && currentMix.tints.length === 0) return;
    const newInventory = JSON.parse(JSON.stringify(inventory)) as Inventory;

    // Deduct Bases
    currentMix.bases.forEach(mixBase => {
        // Find category
        let baseCat: keyof Inventory | undefined;
        // Optimization: check if it's 'personalizados' first
        if (mixBase.product.category === 'personalizados') {
             // For formulas, we don't deduct stock of the formula itself (it's virtual), 
             // UNLESS we track stock of pre-mixed paint. 
             // Requirement says "Formulas act as ingredients". 
             // If it's a "Virtual Recipe", we should ideally deduct *its original ingredients*.
             // BUT, if it's a "Repackaging" logic, maybe we deducted stock when creating it?
             // Simplification for now: If it's pure virtual recipe, no deduction. 
             // If User wants to deduct ingredients recursively, that's complex V2.
             // Assume "Personalizados" are just recipes re-used for pricing/composition, 
             // OR assume we have stock of that specific mix.
             // Given "Inventory never adds up", let's assume we need to deduct the *components* if possible, 
             // OR just ignore if it's a pure price calculation.
             
             // Let's stick to standard product deduction for now.
             baseCat = 'personalizados'; // No stock decrement logic implemented for this yet effectively
        } else {
             baseCat = (Object.keys(newInventory) as Array<keyof Inventory>).find((cat: keyof Inventory) => 
                newInventory[cat].some((p: ProductItem) => p.id === mixBase.product.id)
            );
        }

        if(baseCat && baseCat !== 'personalizados') {
            newInventory[baseCat] = newInventory[baseCat].map((p: ProductItem) => {
                if (p.id !== mixBase.product.id) return p;

                // DEDUCCIÓN DE STOCK:
                // Si el producto está en 'kg' (Automotriz) y usamos 'gr' (Mezcla),
                // convertimos consumo a kg antes de restar.
                let deduction = mixBase.qty;
                if (p.unit === 'kg') {
                    deduction = mixBase.qty / 1000;
                }
                
                return { ...p, stock: Math.max(0, p.stock - deduction) };
            });
        }
    });

    // Deduct Tints
    currentMix.tints.forEach((mixTint: MixTint) => {
      const cat = mixTint.category;
      if (cat !== 'personalizados') {
          newInventory[cat] = newInventory[cat].map((p: ProductItem) => 
            p.id === mixTint.id ? { ...p, stock: Math.max(0, p.stock - mixTint.qty) } : p
          );
      }
    });

    // Deduct container
    if (currentMix.container) {
       newInventory.envases = newInventory.envases.map((p: ProductItem) =>
         p.id === currentMix.container!.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p
       );
    }

    saveInventory(newInventory);
    const code = `${currentMix.customerName.substring(0,3).toUpperCase()}-${Math.floor(Math.random()*1000)}`;
    
    // Save Formula Logic
    const newFormula: SavedFormula = {
      id: crypto.randomUUID(),
      customerName: currentMix.customerName,
      colorName: currentMix.colorName,
      code,
      date: new Date().toISOString(),
      bases: currentMix.bases.map(b => ({ id: b.product.id, name: b.product.name, qty: b.qty, unit: b.product.unit })),
      containerId: currentMix.container?.id,
      containerName: currentMix.container?.name,
      tints: currentMix.tints,
      total: calculations.total,
      color: visualColor,
      referenceImage: currentMix.referenceImage
    };
    saveFormula(newFormula);

    showNotification(`Fórmula guardada: ${code}`);
    if (!skipReset) handleReset();
  };

  // --- Derived State ---

  const calculations = useMemo(() => {
    let cost = 0;
    // Sum bases cost
    currentMix.bases.forEach(b => {
        // PRECIO SINCERADO: Si la base es Automotriz (kg), el precio está en $/kg pero la mezcla es en gr.
        // Convertimos la cantidad de gramos a kilos para calcular el costo.
        if (b.product.unit === 'kg') {
            cost += (b.qty / 1000) * b.product.price;
        } else {
            cost += b.product.price * b.qty; 
        }
    });
    if (currentMix.container) cost += currentMix.container.price;
    currentMix.tints.forEach((item: MixTint) => {
      const tint = inventory[item.category]?.find((t: ProductItem) => t.id === item.id);
      if (tint) cost += item.qty * tint.price;
    });
    const subtotal = cost;
    const total = cost * PROFIT_MARGIN;
    return { subtotal, total };
  }, [currentMix, inventory]);

  const visualColor = useMemo(() => {
    // If no bases and no tints -> Default or black
    if (currentMix.bases.length === 0 && currentMix.tints.length === 0) {
        return '#18181b'; // Default dark
    }

    const colors: { color: string; weight: number }[] = [];

    // Bases
    currentMix.bases.forEach((base) => {
      if (base.product.color) {
        // Fix: If unit is 'kg', the quantity is stored in grams (e.g. 1000 for 1kg).
        // So we should pass 'gr' as unit to getMeldingWeight to avoid multiplying by 1000 again.
        const effectiveUnit = base.product.unit === 'kg' ? 'gr' : (base.product.unit || 'u');
        colors.push({
          color: base.product.color,
          weight: getMeldingWeight(base.qty, effectiveUnit),
        });
      }
    });

    // Tints
    currentMix.tints.forEach((item) => {
      const tint = inventory[item.category]?.find((t: ProductItem) => t.id === item.id) || 
                   inventory['personalizados']?.find((t: ProductItem) => t.id === item.id);
      
      if (tint && tint.color) {
        colors.push({
          color: tint.color,
          weight: getMeldingWeight(item.qty, tint.unit || 'gr'),
        });
      }
    });

    return mixColors(colors);
  }, [currentMix, inventory]);

  const handleCustomerNameChange = (name: string) => {
    setCurrentMix((prev: MixState) => ({ ...prev, customerName: name }));
  };

  const handleColorNameChange = (name: string) => {
    setCurrentMix((prev: MixState) => ({ ...prev, colorName: name }));
  };

  // --- RENDER ---


  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 overflow-hidden">
      
      {/* 1. NAVIGATION SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenInventory={() => setShowInventoryManager(true)}
        onStartTutorial={startTutorial}
      />

      {/* 2. MAIN CONTENT AREA (Grid) */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* We keep MixerHeader for visual context, but maybe simplified? Use it for Customer Name editing */}
        <MixerHeader
          customerName={currentMix.customerName}
          onCustomerNameChange={handleCustomerNameChange}
          visualColor={visualColor}
          step={0} // Hide step indicator
          onReset={handleReset}
        />

        <div id="product-grid-area" className="flex-1 overflow-hidden">
            {activeTab === 'color_picker' ? (
                <ColorPicker 
                    inventory={inventory}
                    onProductSelect={(product) => {
                        // Switch to the product's category to show context? 
                        // Or just open the action directly. 
                        // Let's just open the action.
                        handleProductClick(product);
                    }}
                />
            ) : (
                <ProductGrid 
                    products={inventory[activeTab as keyof Inventory] || []}
                    onProductClick={handleProductClick}
                    activeCategory={activeTab as keyof Inventory}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
            )}
        </div>
      </main>

      {/* 3. RIGHT SIDEBAR (Checkout/Cart) */}
      <MixSummary 
          currentMix={currentMix}
          inventory={inventory}
          onRemoveBase={handleRemoveBase}
          onRemoveTint={handleRemoveTint}
          onRemoveContainer={handleRemoveContainer}
          onProceed={() => setShowFinalReview(true)}
          calculations={calculations}
      />

      {/* --- OVERLAYS --- */}
      
      {viewingFormula && (
        <FormulaPreview 
            product={viewingFormula}
            inventory={inventory}
            onClose={() => setViewingFormula(null)}
            onSelect={(p) => {
                setViewingFormula(null);
                setActiveProductToAdd(p);
                setNumpadOpen(true);
            }}
            onExplode={handleExplodeFormula}
        />
      )}
      
      {/* Final Review Modal (FullScreen) */}
      {showFinalReview && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
               <div className="w-full max-w-4xl h-full bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden flex flex-col shadow-2xl">
                    <div className="flex justify-between items-center p-6 border-b border-zinc-800">
                        <h2 className="text-2xl font-black text-white">Revisión Final</h2>
                        <button onClick={() => setShowFinalReview(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                            <Printer size={20} /> {/* Just a placeholder icon for close/back really */}
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <StepFinalReview
                            currentMix={currentMix}
                            inventory={inventory}
                            visualColor={visualColor}
                            calculations={calculations}
                            onGoBack={() => setShowFinalReview(false)}
                            onFinalize={handleFinalize}
                            onUpdateCustomerName={handleCustomerNameChange}
                            onUpdateColorName={handleColorNameChange}
                            onUpdateReferenceImage={(img) => setCurrentMix(prev => ({ ...prev, referenceImage: img }))}
                         />
                    </div>
               </div>
          </div>
      )}



      <InventoryManager 
        isOpen={showInventoryManager}
        onClose={() => setShowInventoryManager(false)}
        inventory={inventory}
        onAdd={handleAddItem}
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteItem}
      />

      {numpadOpen && activeProductToAdd && (
        <Numpad 
          value={tempValue}
          onInput={handleNumpadInput}
          onClose={() => setNumpadOpen(false)}
          onConfirm={confirmAddToMix}
          // UX: Si es Automotriz (kg), pedimos gramos en el Numpad
          label={`Cantidad (${activeProductToAdd.unit === 'kg' ? 'gr' : (activeProductToAdd.unit || 'u')})`}
          unit={activeProductToAdd.unit === 'kg' ? 'gr' : activeProductToAdd.unit}
        />
      )}

      {notification && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-3xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-10 flex items-center gap-3 ${
            notification.type === 'success' ? 'bg-emerald-600' : 'bg-zinc-800'
        }`}>
            {notification.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-200" /> : <Printer size={20} className="text-zinc-400" />}
            <span className="text-white font-bold">{notification.msg}</span>
        </div>
      )}
    </div>
  );
}
