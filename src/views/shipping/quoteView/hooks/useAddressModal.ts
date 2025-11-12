import { useState, useCallback, useMemo, useEffect } from "react";
import { getRegionsWithProvincesAndCommunes } from "../../../../db/config/postal.service";

export type Commune = { name: string; id?: string };
export type Province = { name: string; communes?: Commune[]; id?: string };
export type Region = { name: string; provinces?: Province[]; id?: string };

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
            id: r.id,
            provinces: r.provinces?.map((p: any) => ({
              name: p.name,
              id: p.id,
              communes: p.communes?.map((c: any) => ({ name: c.name, id: c.id })) ?? [],
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

  const provinces = useMemo(() => selectedRegion?.provinces ?? [], [selectedRegion]);
  const communes = useMemo(() => selectedProvince?.communes ?? [], [selectedProvince]);

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
