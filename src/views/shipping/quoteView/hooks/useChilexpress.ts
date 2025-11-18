// src/views/shipping/quoteView/hooks/useChilexpress.ts
import { useEffect, useState } from "react";
import {
  getChilexpressRegions,
  getChilexpressCoverageAreas,
  findChilexpressCountyByName,
  type ChilexpressRegion,
  type ChilexpressCoverageArea,
} from "../../../../db/config/chilexpress.service";

interface UseChilexpressState {
  regions: ChilexpressRegion[];
  coverageAreas: Map<string, ChilexpressCoverageArea[]>;
  loading: boolean;
  error: string | null;
}

export function useChilexpress() {
  const [state, setState] = useState<UseChilexpressState>({
    regions: [],
    coverageAreas: new Map(),
    loading: false,
    error: null,
  });

  // Cargar regiones al montar
  useEffect(() => {
    const loadRegions = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const regions = await getChilexpressRegions();
        setState((prev) => ({ ...prev, regions, loading: false }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error?.message || "Error cargando regiones de Chilexpress",
          loading: false,
        }));
      }
    };

    loadRegions();
  }, []);

  // Cargar áreas de cobertura para una región
  const loadCoverageAreas = async (regionCode: string) => {
    if (state.coverageAreas.has(regionCode)) {
      return state.coverageAreas.get(regionCode)!;
    }

    try {
      const areas = await getChilexpressCoverageAreas(regionCode);
      setState((prev) => {
        const updated = new Map(prev.coverageAreas);
        updated.set(regionCode, areas);
        return { ...prev, coverageAreas: updated };
      });
      return areas;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error?.message || `Error cargando cobertura para ${regionCode}`,
      }));
      return [];
    }
  };

  // Buscar un condado por nombre de comuna
  const findCountyByName = async (
    communeName: string
  ): Promise<{
    countyCode: string;
    countyName: string;
    regionCode: string;
  } | null> => {
    try {
      return await findChilexpressCountyByName(communeName);
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error?.message || `Error buscando condado: ${communeName}`,
      }));
      return null;
    }
  };

  return {
    ...state,
    loadCoverageAreas,
    findCountyByName,
  };
}
