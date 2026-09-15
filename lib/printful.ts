const PRINTFUL_BASE_URL = "https://api.printful.com";

function getPrintfulToken(): string {
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    throw new Error("PRINTFUL_API_TOKEN is not set.");
  }

  return token;
}

interface PrintfulFetchOptions extends RequestInit {
  revalidateSeconds?: number;
}

async function printfulFetch(
  path: string,
  options: PrintfulFetchOptions = {}
) {
  const { revalidateSeconds, ...init } = options;
  const token = getPrintfulToken();

  const response = await fetch(`${PRINTFUL_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...(revalidateSeconds
      ? { next: { revalidate: revalidateSeconds } }
      : { cache: "no-store" as const }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Printful API error (${response.status}) on ${path}: ${JSON.stringify(data)}`
    );
  }

  return data;
}

export interface PrintfulSyncVariant {
  id: number;
  size: string | null;
  color: string | null;
  retail_price: string;
  availability_status: string;
}

export interface PrintfulSyncProductSummary {
  id: number;
  external_id: string | null;
  name: string;
  thumbnail_url: string;
}

export interface PrintfulSyncProductDetail {
  syncProduct: PrintfulSyncProductSummary;
  variants: PrintfulSyncVariant[];
}

function normalizeProductLookupId(
  idOrExternalId: number | string
): string {
  const value = String(idOrExternalId).trim();

  if (/^\d+$/.test(value)) {
    return value;
  }

  return `@${value}`;
}

export async function listSyncProducts(): Promise<
  PrintfulSyncProductSummary[]
> {
  const data = await printfulFetch("/store/products", {
    revalidateSeconds: 300,
  });

  return data.result;
}

export async function getSyncProductDetail(
  idOrExternalId: number | string
): Promise<PrintfulSyncProductDetail> {
  const lookupId = normalizeProductLookupId(idOrExternalId);

  const data = await printfulFetch(
    `/store/products/${encodeURIComponent(lookupId)}`,
    {
      revalidateSeconds: 300,
    }
  );

  return {
    syncProduct: data.result.sync_product,
    variants: data.result.sync_variants,
  };
}

export async function getSyncProductDetailFresh(
  idOrExternalId: number | string
): Promise<PrintfulSyncProductDetail> {
  const lookupId = normalizeProductLookupId(idOrExternalId);

  const data = await printfulFetch(
    `/store/products/${encodeURIComponent(lookupId)}`,
    {}
  );

  return {
    syncProduct: data.result.sync_product,
    variants: data.result.sync_variants,
  };
}

export function findVariantBySize(
  variants: PrintfulSyncVariant[],
  size: string
): PrintfulSyncVariant | undefined {
  return variants.find(
    (v) =>
      v.size?.toUpperCase() === size.toUpperCase() &&
      v.availability_status === "active"
  );
}

export async function getExistingOrderByExternalId(
  externalId: string
) {
  const token = getPrintfulToken();

  const response = await fetch(
    `${PRINTFUL_BASE_URL}/orders/@${encodeURIComponent(externalId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Printful order lookup failed (${response.status}): ${JSON.stringify(data)}`
    );
  }

  return data.result;
}

export interface PrintfulOrderItem {
  sync_variant_id: number;
  quantity: number;
}

export interface PrintfulRecipient {
  name: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  state_code?: string;
  country_code: string;
  zip: string;
}

export async function createPrintfulOrder(params: {
  externalId: string;
  items: PrintfulOrderItem[];
  recipient: PrintfulRecipient;
}) {
  const data = await printfulFetch("/orders?confirm=true", {
    method: "POST",
    body: JSON.stringify({
      external_id: params.externalId,
      recipient: params.recipient,
      items: params.items,
    }),
  });

  return data.result;
}
