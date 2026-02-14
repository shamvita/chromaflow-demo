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
  preparacion: ProductItem[];
  color_brillo: ProductItem[];
  solventes: ProductItem[];
  complementos: ProductItem[];
  impermeabilizacion: ProductItem[];
  personalizados: ProductItem[]; // New category for saved formulas
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
}

export interface SavedFormula {
  id: string;
  customerName: string;
  code: string;
  date: string;
  bases: { id: string; name: string; qty: number }[];
  containerId?: string;
  containerName?: string;
  colorName?: string;
  tints: MixTint[];
  total: number;
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
