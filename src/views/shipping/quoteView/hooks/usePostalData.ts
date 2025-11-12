// src/hooks/usePostalData.ts
import { useEffect, useState } from "react";
import { getRegionsWithProvincesAndCommunes } from "../../../../db/config/postal.service";
export type Region = { name: string; provinces: { name: string; communes: { name: string }[] }[] };

export function usePostalData() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getRegionsWithProvincesAndCommunes();
        setRegions(
          data.map((r: any) => ({
            name: r.name,
            provinces:
              r.provinces?.map((p: any) => ({
                name: p.name,
                communes: p.communes?.map((c: any) => ({ name: c.name })) ?? [],
              })) ?? [],
          }))
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { regions, loading };
}
