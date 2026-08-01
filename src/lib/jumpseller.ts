export interface JumpsellerProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  permalink: string;
}

interface RawImage {
  id: number;
  url: string;
  position: number;
}

interface RawCategory {
  id: number;
  name: string;
}

interface RawProduct {
  product: {
    id: number;
    name: string;
    price: number;
    permalink: string;
    images: RawImage[];
    categories: RawCategory[];
  };
}

export async function getProducts(limit = 4): Promise<JumpsellerProduct[]> {
  const login = import.meta.env.JUMPSELLER_LOGIN;
  const authtoken = import.meta.env.JUMPSELLER_AUTH_TOKEN;

  const url = `https://api.jumpseller.com/v1/products.json?login=${login}&authtoken=${authtoken}&limit=${limit}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Jumpseller API error: ${res.status}`);
  }

  const data: RawProduct[] = await res.json();

  return data.map(({ product: p }) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.images?.[0]?.url ?? '',
    category: p.categories?.[0]?.name ?? 'Sara & Emma',
    permalink: p.permalink,
  }));
}

export function formatPrice(price: number): string {
  return `$${Math.round(price).toLocaleString('es-CL')}`;
}
