export interface CakeData {
  name: string;
  message: string;
  candles: number;
  style: 'chocolate' | 'vanilla' | 'strawberry' | 'rainbow';
}

interface CompressedCakeData {
  n: string; // name
  m: string; // message
  c: number; // candles
  s: string; // style
}

export function encodeCakeData(data: CakeData): string {
  const compressed: CompressedCakeData = {
    n: data.name,
    m: data.message,
    c: data.candles,
    s: data.style,
  };
  const json = JSON.stringify(compressed);
  // Use base64url encoding (URL-safe)
  return btoa(json)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeCakeData(encoded: string): CakeData | null {
  try {
    // Restore base64 padding and characters
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const json = atob(base64);
    const compressed: CompressedCakeData = JSON.parse(json);

    // Validate data
    if (
      typeof compressed.n !== 'string' ||
      typeof compressed.m !== 'string' ||
      typeof compressed.c !== 'number' ||
      typeof compressed.s !== 'string'
    ) {
      return null;
    }

    // Validate style
    const validStyles = ['chocolate', 'vanilla', 'strawberry', 'rainbow'];
    if (!validStyles.includes(compressed.s)) {
      return null;
    }

    // Validate candle count
    if (compressed.c < 1 || compressed.c > 10) {
      return null;
    }

    return {
      name: compressed.n,
      message: compressed.m,
      candles: compressed.c,
      style: compressed.s as CakeData['style'],
    };
  } catch {
    return null;
  }
}

export function generateCakeUrl(data: CakeData): string {
  const encoded = encodeCakeData(data);
  return `/cake/${encoded}`;
}
