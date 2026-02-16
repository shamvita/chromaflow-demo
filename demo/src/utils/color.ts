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
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return '#' + ((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1);
};

// --- CIELAB Conversion Utilities ---

/**
 * Converts RGB (0-255) to LAB color space
 */
export const rgbToLab = (r: number, g: number, b: number): { l: number; a: number; b: number } => {
  // 1. Normalize and sRGB to linear RGB
  let [nr, ng, nb] = [r / 255, g / 255, b / 255].map(v =>
    v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92
  );

  // 2. Linear RGB to XYZ (D65)
  let x = (nr * 0.4124 + ng * 0.3576 + nb * 0.1805) * 100;
  let y = (nr * 0.2126 + ng * 0.7152 + nb * 0.0722) * 100;
  let z = (nr * 0.0193 + ng * 0.1192 + nb * 0.9505) * 100;

  // 3. XYZ to LAB (D65 White Point: 95.047, 100.00, 108.883)
  x /= 95.047;
  y /= 100.000;
  z /= 108.883;

  const f = (t: number) => (t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116);

  return {
    l: 116 * f(y) - 16,
    a: 500 * (f(x) - f(y)),
    b: 200 * (f(y) - f(z)),
  };
};

/**
 * Converts LAB to RGB (0-255)
 */
export const labToRgb = (l: number, a: number, b: number): { r: number; g: number; b: number } => {
  const fy = (l + 16) / 116;
  const fx = fy + a / 500;
  const fz = fy - b / 200;

  const fInv = (t: number) => (Math.pow(t, 3) > 0.008856 ? Math.pow(t, 3) : (t - 16 / 116) / 7.787);

  let x = fInv(fx) * 95.047;
  let y = fInv(fy) * 100.000;
  let z = fInv(fz) * 108.883;

  // XYZ to Linear RGB
  x /= 100;
  y /= 100;
  z /= 100;

  let nr = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let ng = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let nb = x * 0.0557 + y * -0.2040 + z * 1.0570;

  // Linear RGB to sRGB
  [nr, ng, nb] = [nr, ng, nb].map(v =>
    v > 0.0031308 ? 1.055 * Math.pow(v, 1 / 2.4) - 0.055 : 12.92 * v
  );

  return {
    r: Math.round(nr * 255),
    g: Math.round(ng * 255),
    b: Math.round(nb * 255),
  };
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
      return qty * 29.57;
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
      return qty * 1000;
  }
};

/**
 * Mixes colors using the LAB color space for perceptual accuracy
 */
export const mixColors = (colors: { color: string; weight: number }[]): string => {
  if (colors.length === 0) return '#ffffff';

  let totalWeight = 0;
  let l = 0;
  let a = 0;
  let b = 0;

  colors.forEach(({ color, weight }) => {
    const rgb = hexToRgb(color);
    if (rgb && weight > 0) {
      const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
      l += lab.l * weight;
      a += lab.a * weight;
      b += lab.b * weight;
      totalWeight += weight;
    }
  });

  if (totalWeight === 0) return '#ffffff';

  const avgLab = {
    l: l / totalWeight,
    a: a / totalWeight,
    b: b / totalWeight,
  };

  const mixedRgb = labToRgb(avgLab.l, avgLab.a, avgLab.b);
  return rgbToHex(mixedRgb.r, mixedRgb.g, mixedRgb.b);
};

/**
 * Calculates Delta E (CIE76) color distance in LAB space
 */
export const calculateColorDistance = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return Infinity;

  const lab1 = rgbToLab(rgb1.r, rgb1.g, rgb1.b);
  const lab2 = rgbToLab(rgb2.r, rgb2.g, rgb2.b);

  // Perceptual distance Delta E76
  return Math.sqrt(
    Math.pow(lab1.l - lab2.l, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  );
};

export interface ColorMatch {
  item: any;
  distance: number;
  type: 'product' | 'formula';
}

export const findClosestMatches = (targetColor: string, items: any[], type: 'product' | 'formula', limit: number = 5): ColorMatch[] => {
  return items
    .filter(item => item.color)
    .map(item => ({
      item,
      distance: calculateColorDistance(targetColor, item.color),
      type
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
};
