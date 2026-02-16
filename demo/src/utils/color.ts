export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const getMeldingWeight = (qty: number, unit: string = 'u'): number => {
  const normalizedUnit = unit.toLowerCase().trim();
  switch (normalizedUnit) {
    case 'l':
    case 'litro':
    case 'litros':
      return qty * 1000;
    case 'gal':
    case 'galon':
    case 'galones':
      return qty * 3785;
    case 'ml':
    case 'cc':
    case 'gr':
    case 'gramos':
    case 'g':
      return qty;
    case 'kg':
    case 'kilos':
      return qty * 1000;
    case 'oz':
    case 'onza':
      return qty * 29.57; // fl oz to ml approx
    case '1/4':
    case 'cuarto':
       return qty * 946; 
    case '1/8':
    case 'octavo':
       return qty * 473;
    case '1/16':
       return qty * 236;
    case '1/32':
       return qty * 118;
    case 'u':
    case 'unidad':
    default:
      // Assist with "units" by assuming a standard 1L equivalent for now, 
      // or if it's a small unit, this might be wrong. 
      // But usually 'u' is for containers or major items.
      return qty * 1000; 
  }
};

export const mixColors = (colors: { color: string; weight: number }[]): string => {
  if (colors.length === 0) return '#ffffff';

  let totalWeight = 0;
  let r = 0;
  let g = 0;
  let b = 0;

  colors.forEach(({ color, weight }) => {
    const rgb = hexToRgb(color);
    if (rgb) {
      r += rgb.r * weight;
      g += rgb.g * weight;
      b += rgb.b * weight;
      totalWeight += weight;
    }
  });

  if (totalWeight === 0) return '#ffffff';

  return rgbToHex(Math.round(r / totalWeight), Math.round(g / totalWeight), Math.round(b / totalWeight));
};

// Euclidean distance between two colors (RGB)
// Lower distance = closer match
export const calculateColorDistance = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return Infinity;

  // Simple Euclidean distance in RGB space
  // For better accuracy we could use LAB, but this is sufficient for MVP
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
};

export interface ColorMatch {
  item: any; // ProductItem or SavedFormula
  distance: number;
  type: 'product' | 'formula';
}

export const findClosestMatches = (targetColor: string, items: any[], type: 'product' | 'formula', limit: number = 5): ColorMatch[] => {
  return items
    .filter(item => item.color) // Ensure item has color
    .map(item => ({
      item,
      distance: calculateColorDistance(targetColor, item.color),
      type
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
};
