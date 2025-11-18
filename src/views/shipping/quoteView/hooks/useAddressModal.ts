// src/views/shipping/Quote/hooks/useAddressModal.ts
import { useState, useCallback, useMemo, useEffect } from "react";
import { getRegionsWithProvincesAndCommunes } from "../../../../db/config/postal.service";

// Ojo: ahora usamos `code`, no `id`
export type Commune = { name: string; code?: string };
export type Province = { name: string; code?: string; communes?: Commune[] };
export type Region = { name: string; code?: string; provinces?: Province[] };

export function useAddressModal() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);

  // Cargar regiones al montar
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getRegionsWithProvincesAndCommunes();
        setRegions(
          data.map((r: any) => ({
            name: r.name,
            code: r.code ?? r.id,
            provinces:
              r.provinces?.map((p: any) => ({
                name: p.name,
                code: p.code ?? p.id,
                communes:
                  p.communes?.map((c: any) => ({
                    name: c.name,
                    code: c.code ?? c.id,
                  })) ?? [],
              })) ?? [],
          }))
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelectRegion = useCallback((region: Region | null) => {
    setSelectedRegion(region);
    setSelectedProvince(null);
    setSelectedCommune(null);
  }, []);

  const handleSelectProvince = useCallback((province: Province | null) => {
    setSelectedProvince(province);
    setSelectedCommune(null);
  }, []);

  const handleSelectCommune = useCallback((commune: Commune | null) => {
    setSelectedCommune(commune);
  }, []);

  const provinces = useMemo(
    () => selectedRegion?.provinces ?? [],
    [selectedRegion]
  );
  const communes = useMemo(
    () => selectedProvince?.communes ?? [],
    [selectedProvince]
  );

  const reset = useCallback(() => {
    setSelectedRegion(null);
    setSelectedProvince(null);
    setSelectedCommune(null);
  }, []);

  return {
    regions,
    loading,
    selectedRegion,
    selectedProvince,
    selectedCommune,
    provinces,
    communes,
    handleSelectRegion,
    handleSelectProvince,
    handleSelectCommune,
    reset,
  };
}
