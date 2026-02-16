import type { Inventory } from './types';

export const PROFIT_MARGIN = 1.30; // 30% margin

export const CATEGORY_LABELS: Record<keyof Inventory, string> = {
  bases_auto: 'Bases Automotriz',
  bases_arq: 'Bases Arquitectónica',
  tintes: 'Tintes y Pigmentos',
  barnices_acabados: 'Barnices y Acabados',
  solventes: 'Solventes y Diluyentes',
  complementos: 'Complementos y Químicos',
  impermeabilizacion: 'Impermeab. y Especialidades',
  envases: 'Envases y Empaques',
  personalizados: 'Fórmulas Guardadas'
};

export const INITIAL_INVENTORY: Inventory = {
  // ── BASES AUTOMOTRICES ─────────────────────────────────────
  // ESTRATEGIA: El precio se muestra por KILO ($/kg) para que sea un número "cómodo".
  // Internamente, el sistema divide entre 1000 cuando se usa en una fórmula por gramos.
  bases_auto: [
    { 
      id: 'ba1', 
      category: 'Automotriz', 
      subcategory: 'Bases Poliéster', 
      name: 'Base Poliéster (Bicapa)', 
      price: 45.00, // Precio por Kilo (aprox $11.25 por 1/4 de Kilo)
      stock: 30,    // Stock en Kilos (más manejable que 30000 gr)
      color: '#f5f5f0', 
      isBaseRole: true, 
      unit: 'kg'    // CAMBIO: Unidad de venta principal
    },
    { 
      id: 'ba2', 
      category: 'Automotriz', 
      subcategory: 'Esmaltes', 
      name: 'Esmalte Brillo Directo', 
      price: 38.00, // Precio por Kilo
      stock: 25, 
      color: '#fafaf5', 
      isBaseRole: true, 
      unit: 'kg' 
    },
  ],

  // ── BASES ARQUITECTÓNICAS (Caucho) ─────────────────────────
  // ESTRATEGIA: Se mantiene por Galón. Precios ajustados a las referencias ($25-$45).
  // Las bases oscuras (R/T) suelen ser más caras o requieren más tinte.
  bases_arq: [
    // Tipo A — Premium / Lavable (Referencias:)
    { id: 'arq1', category: 'Arquitectónica', subcategory: 'Caucho Tipo A', name: 'Base P (Pastel) - Tipo A', price: 28.00, stock: 50, color: '#f0ebe3', isBaseRole: true, unit: 'gal' },
    { id: 'arq2', category: 'Arquitectónica', subcategory: 'Caucho Tipo A', name: 'Base T (Tint) - Tipo A', price: 29.00, stock: 40, color: '#e8e0d4', isBaseRole: true, unit: 'gal' },
    { id: 'arq3', category: 'Arquitectónica', subcategory: 'Caucho Tipo A', name: 'Base X (Claros) - Tipo A', price: 26.00, stock: 40, color: '#faf8f5', isBaseRole: true, unit: 'gal' },
    { id: 'arq4', category: 'Arquitectónica', subcategory: 'Caucho Tipo A', name: 'Base R (Oscuros) - Tipo A', price: 32.00, stock: 30, color: '#d5cfc5', isBaseRole: true, unit: 'gal' },
    { id: 'arq5', category: 'Arquitectónica', subcategory: 'Caucho Tipo A', name: 'Base Y (Medios) - Tipo A', price: 28.00, stock: 35, color: '#e0d8cc', isBaseRole: true, unit: 'gal' },
    
    // Tipo B — Estándar
    { id: 'arq6', category: 'Arquitectónica', subcategory: 'Caucho Tipo B', name: 'Base P (Pastel) - Tipo B', price: 20.00, stock: 60, color: '#f0ebe3', isBaseRole: true, unit: 'gal' },
    { id: 'arq7', category: 'Arquitectónica', subcategory: 'Caucho Tipo B', name: 'Base T (Tint) - Tipo B', price: 20.00, stock: 50, color: '#e8e0d4', isBaseRole: true, unit: 'gal' },
    
    // Tipo C — Económica
    { id: 'arq8', category: 'Arquitectónica', subcategory: 'Caucho Tipo C', name: 'Base P (Pastel) - Tipo C', price: 14.00, stock: 80, color: '#f0ebe3', isBaseRole: true, unit: 'gal' },
  ],

  // ── TINTES Y PIGMENTOS ─────────────────────────────────────
  // ESTRATEGIA: Los tintes sí se quedan en GRAMOS u ONZAS porque son costosos y se usan poco.
  // $0.80/gr significa $800 el kilo (es alto, pero realista para pigmentos concentrados automotrices).
  tintes: [
    { id: 't1', category: 'Tintes', subcategory: 'Universales', name: 'Negro Humo', code: 'BK', price: 0.80, color: '#1a1a1a', stock: 5000, unit: 'gr' },
    { id: 't2', category: 'Tintes', subcategory: 'Universales', name: 'Ocre Amarillo', code: 'OY', price: 1.20, color: '#D4A017', stock: 2000, unit: 'gr' },
    { id: 't3', category: 'Tintes', subcategory: 'Universales', name: 'Rojo Óxido', code: 'RO', price: 1.10, color: '#8B0000', stock: 3500, unit: 'gr' },
    { id: 't4', category: 'Tintes', subcategory: 'Universales', name: 'Azul Phthalo', code: 'BL', price: 1.50, color: '#000f89', stock: 1200, unit: 'gr' },
    { id: 't5', category: 'Tintes', subcategory: 'Universales', name: 'Blanco', code: 'WH', price: 0.70, color: '#ffffff', stock: 8000, unit: 'gr' },
    { id: 't6', category: 'Tintes', subcategory: 'Universales', name: 'Amarillo Limón', code: 'YL', price: 1.30, color: '#F5E050', stock: 1500, unit: 'gr' },
    { id: 't7', category: 'Tintes', subcategory: 'Universales', name: 'Magenta', code: 'MG', price: 1.60, color: '#E0115F', stock: 1000, unit: 'gr' },
    { id: 't8', category: 'Tintes', subcategory: 'Universales', name: 'Violeta', code: 'VT', price: 1.50, color: '#7B2D8E', stock: 800, unit: 'gr' },
    // Perlas (pigmentos perlados en polvo)
    { id: 'tp1', category: 'Tintes', subcategory: 'Perlas', name: 'Perla Blanca', code: 'PW', price: 3.50, color: '#f0f0ff', stock: 500, unit: 'gr' },
    { id: 'tp2', category: 'Tintes', subcategory: 'Perlas', name: 'Perla Azul', code: 'PB', price: 4.00, color: '#6698cb', stock: 300, unit: 'gr' },
    { id: 'tp3', category: 'Tintes', subcategory: 'Perlas', name: 'Perla Dorada', code: 'PG', price: 4.50, color: '#c5a34e', stock: 250, unit: 'gr' },
  ],

  // ── BARNICES Y ACABADOS ────────────────────────────────────
  barnices_acabados: [
    { id: 'bk1', category: 'Barnices', subcategory: 'Skylack', name: 'Barniz Skylack 15000 (Kit)', price: 65.00, stock: 100, color: '#e5e5e5', isBaseRole: false, unit: 'u' },
    { id: 'bk2', category: 'Barnices', subcategory: 'Skylack', name: 'Barniz Skylack 13000', price: 55.00, stock: 150, color: '#e5e5e5', isBaseRole: false, unit: 'L' },
  ],

  // ── SOLVENTES Y DILUYENTES ─────────────────────────────────
  solventes: [
    { id: 's1', category: 'Solventes', subcategory: 'Thinners', name: 'Thinner Acrílico', price: 20.00, stock: 100, color: '#e0ffff', unit: 'gal' },
    { id: 's2', category: 'Solventes', subcategory: 'Thinners', name: 'Thinner Laca', price: 15.00, stock: 100, color: '#e0ffff', unit: 'gal' },
    { id: 's3', category: 'Solventes', subcategory: 'Thinners', name: 'Aguarrás', price: 12.00, stock: 50, color: '#fffff0', unit: 'gal' },
    { id: 's4', category: 'Solventes', subcategory: 'Limpieza', name: 'Desengrasante Automotriz', price: 18.00, stock: 30, color: '#f0f8ff', unit: 'gal' },
  ],

  // ── COMPLEMENTOS Y QUÍMICOS ────────────────────────────────
  complementos: [
    { id: 'q1', category: 'Complementos', subcategory: 'Catalizadores', name: 'Endurecedor Universal', price: 25.00, stock: 20, color: '#ffffff', unit: 'L' },
    { id: 'q2', category: 'Complementos', subcategory: 'Aditivos', name: 'Flexibilizante', price: 30.00, stock: 10, color: '#f0f0f0', unit: 'L' },
    { id: 'q3', category: 'Complementos', subcategory: 'Aditivos', name: 'Retardador', price: 22.00, stock: 15, color: '#f5f5f5', unit: 'L' },
    { id: 'q4', category: 'Complementos', subcategory: 'Secantes', name: 'Secante de Cobalto', price: 15.00, stock: 25, color: '#ffffff', unit: 'L' },
    { id: 'q5', category: 'Complementos', subcategory: 'Aditivos', name: 'Matiante Universal', price: 18.00, stock: 15, color: '#f8f8f8', unit: 'L' },
    { id: 'q6', category: 'Complementos', subcategory: 'Aditivos', name: 'Promotor de Adherencia', price: 35.00, stock: 12, color: '#e8e8e8', unit: 'L' },
    { id: 'q7', category: 'Complementos', subcategory: 'Fondos', name: 'Primer Universal', price: 28.00, stock: 20, color: '#d0d0d0', unit: 'L' },
  ],

  // ── IMPERMEABILIZACIÓN Y ESPECIALIDADES ────────────────────
  impermeabilizacion: [
    { id: 'i1', category: 'Impermeab.', subcategory: 'Asfálticos', name: 'Manto Edil IPA', price: 48.00, stock: 30, color: '#2f4f4f', unit: 'u' },
    { id: 'i2', category: 'Impermeab.', subcategory: 'Pintura', name: 'Pintura de Aluminio', price: 55.00, stock: 20, color: '#c0c0c0', unit: 'L' },
    { id: 'i3', category: 'Impermeab.', subcategory: 'Selladores', name: 'KPO Sellador de Juntas', price: 18.00, stock: 20, color: '#f5f5dc', unit: 'gr' },
  ],

  // ── ENVASES Y EMPAQUES ─────────────────────────────────────
  envases: [
    { id: 'e1', category: 'Envases', subcategory: 'Metálicos', name: 'Envase 1 Galón', price: 1.50, stock: 100, color: '#d1d5db', unit: 'u' },
    { id: 'e2', category: 'Envases', subcategory: 'Metálicos', name: 'Envase 1/4 Galón', price: 0.80, stock: 150, color: '#d1d5db', unit: 'u' },
    { id: 'e3', category: 'Envases', subcategory: 'Metálicos', name: 'Envase 1/8 Galón', price: 0.50, stock: 80, color: '#d1d5db', unit: 'u' },
    { id: 'e4', category: 'Envases', subcategory: 'Plásticos', name: 'Envase 1/16 (Muestra)', price: 0.30, stock: 200, color: '#f3f4f6', unit: 'u' },
  ],

  // ── FÓRMULAS GUARDADAS ─────────────────────────────────────
  personalizados: [] // Initially empty, populated from saved formulas
};
