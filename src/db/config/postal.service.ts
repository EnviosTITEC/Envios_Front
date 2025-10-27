export type PostalCommune = {
  code: string;
  name: string;
};

export type PostalProvince = {
  code: string;
  name: string;
  communes: PostalCommune[];
};

export type PostalRegion = {
  code: string;
  name: string;
  provinces: PostalProvince[];
};

let _cache: PostalRegion[] | null = null;

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function getRegionsWithProvincesAndCommunes(): Promise<PostalRegion[]> {
  if (_cache) return _cache;

  const res = await fetch(`${API_BASE}/postal/regions-tree`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Error obteniendo datos territoriales");
  }

  const data = await res.json();
  _cache = data;
  return data;
}
