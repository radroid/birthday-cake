export interface CakeData {
  message: string;
  age: number;
  style: 'chocolate' | 'vanilla' | 'strawberry' | 'rainbow';
}

interface CompressedCakeData {
  m: string; // message
  a: number; // age (number of candles)
  s: string; // style
}

export function encodeCakeData(data: CakeData): string {
  const compressed: CompressedCakeData = {
    m: data.message,
    a: data.age,
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
      typeof compressed.m !== 'string' ||
      typeof compressed.a !== 'number' ||
      typeof compressed.s !== 'string'
    ) {
      return null;
    }

    // Validate style
    const validStyles = ['chocolate', 'vanilla', 'strawberry', 'rainbow'];
    if (!validStyles.includes(compressed.s)) {
      return null;
    }

    // Validate age (candle count)
    if (compressed.a < 1 || compressed.a > 150) {
      return null;
    }

    return {
      message: compressed.m,
      age: compressed.a,
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
