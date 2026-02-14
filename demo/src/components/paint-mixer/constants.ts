import type { Inventory } from './types';

export const PROFIT_MARGIN = 1.30; // 30% margin

export const CATEGORY_LABELS: Record<keyof Inventory, string> = {
  preparacion: 'Preparación y Fondos',
  color_brillo: 'Tintes y Acabados',
  solventes: 'Solventes y Diluyentes',
  complementos: 'Complementos y Químicos',
  impermeabilizacion: 'Impermeab. y Especialidades',
  impermeabilizacion: 'Impermeab. y Especialidades',
  envases: 'Envases y Empaques',
  personalizados: 'Fórmulas Guardadas'
};

export const INITIAL_INVENTORY: Inventory = {
  preparacion: [
    { id: 'p1', category: 'Preparación', subcategory: 'Primers', name: 'Primer Universal Skylack', price: 28.00, stock: 25, color: '#808080', isBaseRole: true, unit: 'L' },
    { id: 'p2', category: 'Preparación', subcategory: 'Primers', name: 'Primer 2K Altura', price: 35.00, stock: 15, color: '#a0a0a0', isBaseRole: true, unit: 'L' },
    { id: 'p3', category: 'Preparación', subcategory: 'Fondos', name: 'Fondo Cromato de Zinc', price: 30.00, stock: 18, color: '#9acd32', isBaseRole: true, unit: 'L' },
    { id: 'p4', category: 'Preparación', subcategory: 'Fondos', name: 'Fondo Rellenador G3', price: 32.00, stock: 12, color: '#c0c0c0', isBaseRole: true, unit: 'L' },
    { id: 'p5', category: 'Preparación', subcategory: 'Masillas', name: 'Masilla Poliéster Maxi Rubber', price: 18.00, stock: 20, color: '#f5f5dc', isBaseRole: true, unit: 'gr' },
    { id: 'p6', category: 'Preparación', subcategory: 'Masillas', name: 'Masilla Plástica K36', price: 14.00, stock: 50, color: '#d3d3d3', isBaseRole: true, unit: 'gr' },
  ],
  color_brillo: [
    { id: 'c1', category: 'Color y Brillo', subcategory: 'Bases de Color', name: 'Base Poliéster (Bicapa)', price: 45.00, stock: 30, color: '#ffffff', isBaseRole: true, unit: 'L' },
    { id: 'c2', category: 'Color y Brillo', subcategory: 'Bases de Color', name: 'Esmalte Brillo Directo', price: 38.00, stock: 25, color: '#ffffff', isBaseRole: true, unit: 'L' },
    { id: 'c3', category: 'Color y Brillo', subcategory: 'Barnices', name: 'Barniz Skylack 15000', price: 65.00, stock: 10, color: '#e5e5e5', isBaseRole: true, unit: 'L' },
    { id: 'c4', category: 'Color y Brillo', subcategory: 'Barnices', name: 'Barniz Skylack 13000', price: 55.00, stock: 15, color: '#e5e5e5', isBaseRole: true, unit: 'L' },
    { id: 't1', category: 'Color y Brillo', subcategory: 'Tintes', name: 'Negro Humo', code: 'BK', price: 0.80, color: '#1a1a1a', stock: 5000, unit: 'gr' },
    { id: 't2', category: 'Color y Brillo', subcategory: 'Tintes', name: 'Ocre Amarillo', code: 'OY', price: 1.20, color: '#D4A017', stock: 2000, unit: 'gr' },
    { id: 't3', category: 'Color y Brillo', subcategory: 'Tintes', name: 'Rojo Oxido', code: 'RO', price: 1.10, color: '#8B0000', stock: 3500, unit: 'gr' },
    { id: 't4', category: 'Color y Brillo', subcategory: 'Tintes', name: 'Azul Phthalo', code: 'BL', price: 1.50, color: '#000f89', stock: 1200, unit: 'gr' },
  ],
  solventes: [
    { id: 's1', category: 'Solventes', subcategory: 'Thinners', name: 'Thinner Acrílico', price: 20.00, stock: 100, color: '#e0ffff', unit: 'L' },
    { id: 's2', category: 'Solventes', subcategory: 'Thinners', name: 'Thinner Laca', price: 15.00, stock: 100, color: '#e0ffff', unit: 'L' },
    { id: 's3', category: 'Solventes', subcategory: 'Thinners', name: 'Aguarrás', price: 12.00, stock: 50, color: '#fffff0', unit: 'L' },
    { id: 's4', category: 'Solventes', subcategory: 'Limpieza', name: 'Desengrasante Automotriz', price: 18.00, stock: 30, color: '#f0f8ff', unit: 'L' },
  ],
  complementos: [
    { id: 'q1', category: 'Complementos', subcategory: 'Catalizadores', name: 'Endurecedor Universal', price: 25.00, stock: 20, color: '#ffffff', unit: 'L' },
    { id: 'q2', category: 'Complementos', subcategory: 'Aditivos', name: 'Flexibilizante', price: 30.00, stock: 10, color: '#f0f0f0', unit: 'L' },
    { id: 'q3', category: 'Complementos', subcategory: 'Aditivos', name: 'Retardador', price: 22.00, stock: 15, color: '#f5f5f5', unit: 'L' },
    { id: 'q4', category: 'Complementos', subcategory: 'Secantes', name: 'Secante de Cobalto', price: 15.00, stock: 25, color: '#ffffff', unit: 'L' },
  ],
  impermeabilizacion: [
    { id: 'i1', category: 'Impermeab.', subcategory: 'Asfálticos', name: 'Manto Edil IPA', price: 48.00, stock: 30, color: '#2f4f4f', unit: 'u' },
    { id: 'i2', category: 'Impermeab.', subcategory: 'Pintura', name: 'Pintura de Aluminio', price: 55.00, stock: 20, color: '#c0c0c0', unit: 'L' },
    { id: 'i3', category: 'Impermeab.', subcategory: 'Selladores', name: 'KPO Sellador de Juntas', price: 18.00, stock: 20, color: '#f5f5dc', unit: 'gr' },
  ],
  envases: [
    { id: 'e1', category: 'Envases', subcategory: 'Metálicos', name: 'Envase 1 Galón', price: 1.50, stock: 100, color: '#d1d5db', unit: 'u' },
    { id: 'e2', category: 'Envases', subcategory: 'Metálicos', name: 'Envase 1/4 Galón', price: 0.80, stock: 150, color: '#d1d5db', unit: 'u' },
    { id: 'e3', category: 'Envases', subcategory: 'Metálicos', name: 'Envase 1/8 Galón', price: 0.50, stock: 80, color: '#d1d5db', unit: 'u' },
    { id: 'e4', category: 'Envases', subcategory: 'Plásticos', name: 'Envase 1/16 (Muestra)', price: 0.30, stock: 200, color: '#f3f4f6', unit: 'u' },
  ],
  personalizados: [] // Initially empty, populated from saved formulas
};
