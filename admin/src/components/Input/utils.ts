export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export const parseColor = (str?: string | null): Color | null => {
  if (!str || typeof str !== 'string') return null;

  const rgba = str.match(/rgba?\((\d+), ?(\d+), ?(\d+)(?:, ?([\d.]+))?\)/i);
  if (rgba) {
    const [, r, g, b, a = '1'] = rgba;
    return { r: +r, g: +g, b: +b, a: +a };
  }

  const hsla = str.match(/hsla?\((\d+), ?(\d+)%?, ?(\d+)%?(?:, ?([\d.]+))?\)/i);
  if (hsla) {
    const [, h, s, l, a = '1'] = hsla;
    const [r, g, b] = hslToRgb(+h, +s, +l);
    return { r, g, b, a: +a };
  }

  if (str.startsWith('#') && str.length === 7) {
    const r = parseInt(str.slice(1, 3), 16);
    const g = parseInt(str.slice(3, 5), 16);
    const b = parseInt(str.slice(5, 7), 16);
    return { r, g, b, a: 1 };
  }

  return null;
};

export const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
};

export const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1))));
  return [f(0), f(8), f(4)];
};
