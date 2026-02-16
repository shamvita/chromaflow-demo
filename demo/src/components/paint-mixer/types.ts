export interface ProductItem {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  price: number;
  stock: number;
  color: string;
  code?: string;
  isBaseRole?: boolean;
  unit?: string;
  formula?: SavedFormula; // For 'Personalizados'
}

export interface Inventory {
  bases_auto: ProductItem[];        // Bases Automotrices (Poliéster Bicapa, Esmalte Brillo Directo)
  bases_arq: ProductItem[];         // Bases Arquitectónicas (Caucho: P, T, X, R, Y)
  tintes: ProductItem[];            // Tintes/Pigmentos universales
  barnices_acabados: ProductItem[]; // Barnices (Skylack) y acabados
  solventes: ProductItem[];
  complementos: ProductItem[];
  impermeabilizacion: ProductItem[];
  personalizados: ProductItem[];    // Fórmulas guardadas
  envases: ProductItem[];
}

export interface MixTint {
  id: string;
  qty: number;
  category: keyof Inventory;
}

export interface MixBase {
  product: ProductItem;
  qty: number; // For container based, this might be size. For custom, it's user input volume
}

export interface MixState {
  bases: MixBase[];
  tints: MixTint[];
  customerName: string;
  colorName?: string;
  date: string;
  container?: ProductItem; // Still kept for single base flow or as a general container
  referenceImage?: string; // Optional URL or base64 of sample image
}

export interface SavedFormula {
  id: string;
  customerName: string;
  code: string;
  date: string;
  color?: string; // Visual hex color
  bases: { id: string; name: string; qty: number; unit?: string }[];
  containerId?: string;
  containerName?: string;
  colorName?: string;
  tints: MixTint[];
  total: number;
  referenceImage?: string;
}

export interface SavedCustomer {
  name: string;
  lastVisit: string;
  formulaCount: number;
}

export interface NotificationState {
  msg: string;
  type: 'success' | 'info' | 'error';
}
