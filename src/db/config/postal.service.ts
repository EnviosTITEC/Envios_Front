export type PostalCommune = { id?: string | number; code?: string | number; name: string };
export type PostalRegion = { id?: string | number; code?: string | number; name: string; communes: PostalCommune[] };

let _cache: PostalRegion[] | null = null;

export async function getRegionsWithCommunes(): Promise<PostalRegion[]> {
  if (_cache) return _cache;
  const base = "https://postal-code-api.kainext.cl/v1";
  const res = await fetch(`${base}/regions/with-communes`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Postal API error: ${res.status}`);
  const raw = await res.json();
  _cache = parsePostal(raw);
  return _cache;
}

function parsePostal(input: any): PostalRegion[] {
  if (!Array.isArray(input)) return [];
  return input.map((r: any) => ({
    id: r.id ?? r.code ?? r.ordinal ?? r.region_id ?? r.regionCode,
    code: r.code ?? r.id ?? r.ordinal ?? r.region_id ?? r.regionCode,
    name: r.name ?? r.region ?? r.regionName ?? "",
    communes: Array.isArray(r.communes)
      ? r.communes.map((c: any) => ({
          id: c.id ?? c.code ?? c.commune_id ?? c.communeCode,
          code: c.code ?? c.id ?? c.commune_id ?? c.communeCode,
          name: c.name ?? c.commune ?? c.communeName ?? "",
        }))
      : [],
  }));
}
