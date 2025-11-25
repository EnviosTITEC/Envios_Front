// src/db/config/chilexpress.service.ts
/**
 * Servicio para integrar la API de Chilexpress
 * Proporciona acceso a regiones y áreas de cobertura
 */

export interface ChilexpressRegion {
  regionId: string;
  regionName: string;
  ineRegionCode?: number;
}

export interface ChilexpressCoverageArea {
  countyCode: string;
  countyName: string;
  coverageAreaId: string;
  coverageAreaName: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3100/api";

// Cache para regiones
let _regionsCache: ChilexpressRegion[] | null = null;
// Cache para áreas de cobertura por región
let _coverageCache: Map<string, ChilexpressCoverageArea[]> = new Map();

/**
 * Obtiene todas las regiones disponibles en Chilexpress
 */
export async function getChilexpressRegions(): Promise<ChilexpressRegion[]> {
  if (_regionsCache) {
    return _regionsCache;
  }

  try {
    const res = await fetch(`${API_BASE}/geo/chilexpress/regions`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(
        `Error obteniendo regiones de Chilexpress: ${res.status}`
      );
    }

    const data: ChilexpressRegion[] = await res.json();
    _regionsCache = data;
    return data;
  } catch (error) {
    console.error("Error en getChilexpressRegions:", error);
    throw error;
  }
}

/**
 * Obtiene las áreas de cobertura (comunas) de una región específica
 * @param regionCode Código de región de Chilexpress (ej: "RM", "VALP")
 * @param type Tipo de área (0 = todas las áreas de cobertura)
 */
export async function getChilexpressCoverageAreas(
  regionCode: string,
  type: number = 0
): Promise<ChilexpressCoverageArea[]> {
  const cacheKey = `${regionCode}-${type}`;

  // Retornar desde cache si existe
  if (_coverageCache.has(cacheKey)) {
    return _coverageCache.get(cacheKey)!;
  }

  try {
    const url = new URL(`${API_BASE}/geo/chilexpress/coverage-areas`);
    url.searchParams.append("regionCode", regionCode);
    url.searchParams.append("type", type.toString());

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(
        `Error obteniendo áreas de cobertura para región ${regionCode}: ${res.status}`
      );
    }

    const data: ChilexpressCoverageArea[] = await res.json();
    _coverageCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(
      `Error en getChilexpressCoverageAreas para región ${regionCode}:`,
      error
    );
    throw error;
  }
}

/**
 * Busca una comuna por nombre en Chilexpress
 * @param communeName Nombre de la comuna a buscar
 * @returns Información del condado (county) o null si no se encuentra
 */
export async function findChilexpressCountyByName(
  communeName: string
): Promise<{
  countyCode: string;
  countyName: string;
  regionId: string;
} | null> {
  try {
    const regions = await getChilexpressRegions();

    for (const region of regions) {
      const areas = await getChilexpressCoverageAreas(region.regionId);

      const found = areas.find(
        (area) =>
          area.countyName.toLowerCase().includes(communeName.toLowerCase()) ||
          area.coverageAreaName
            .toLowerCase()
            .includes(communeName.toLowerCase())
      );

      if (found) {
        return {
          countyCode: found.countyCode,
          countyName: found.countyName,
          regionId: region.regionId,
        };
      }
    }

    return null;
  } catch (error) {
    console.error(
      `Error buscando condado por nombre ${communeName}:`,
      error
    );
    throw error;
  }
}

/**
 * Limpia los caches de Chilexpress
 * Útil cuando los datos pueden haber cambiado
 */
export function clearChilexpressCache(): void {
  _regionsCache = null;
  _coverageCache.clear();
}
