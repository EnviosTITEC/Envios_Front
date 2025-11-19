import { useMemo, useState } from "react";
import { Box, Button, Card } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageCard from "../../../components/primitives/PageCard";
import SectionHeader from "../../../components/primitives/SectionHeader";
import NavigationButtons from "../../../components/common/NavigationButtons";
import AddressTable from "./AddressTable";
import AddressModal from "./AddressModal";
import DetailDialog from "./DetailDialog";
import DeleteDialog from "./DeleteDialog";
import { useAddressesCrud } from "./hooks/useAddressesCrud";
import { useChilexpress } from "../quoteView/hooks/useChilexpress";
import { useEffect } from "react";
import type { AddressRow, NewAddress } from "../../../types/address";
import type { AddressFormValue, Region, Commune } from "../../../components/forms/AddressForm";

export default function AddressesPage() {
  const userId = "1"; // sustituir por auth real
  const { items, loading, add, edit, remove } = useAddressesCrud(userId);
  const { regions: chilexpressRegions, loadCoverageAreas } = useChilexpress();

  // UI state
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create"|"edit">("create");
  const [currentId, setCurrentId] = useState<string | number | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailRow, setDetailRow] = useState<AddressRow | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  // form + cascada
  const [regions, setRegions] = useState<Region[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [form, setForm] = useState<AddressFormValue>({
    street:"", number:"", regionId:"", communeId:"", postalCode:"", references:""
  });

  // Transformar datos de Chilexpress a estructura de Region/Commune (sin provincias)
  useEffect(() => {
    if (chilexpressRegions.length === 0) return;
    
    (async () => {
      const mappedRegions: Region[] = [];
      
      for (const region of chilexpressRegions) {
        const regionId = (region as any).regionId;
        const areas = await loadCoverageAreas(regionId);
        
        // Deduplicar: mantener el PRIMERO por nombre (para UX)
        const uniqueByName = Array.from(
          new Map(areas.map(a => [a.countyName, a])).values()
        );
        
        console.log(`Region ${regionId}: ${areas.length} areas brutos -> ${uniqueByName.length} unicos por nombre`);
        
        mappedRegions.push({
          name: (region as any).regionName,
          code: regionId,
          communes: uniqueByName.map(area => ({
            name: area.countyName,
            code: area.countyCode,
          })),
        });
      }
      setRegions(mappedRegions);
    })();
  }, [chilexpressRegions]);

  const requiredOK = useMemo(() =>
    form.regionId && form.communeId && form.street && form.number,
  [form]);

  // En modo edición, permitir guardar aunque no haya interactuado con los campos
  const canSave = mode === "edit" || requiredOK;

  function onOpenCreate() {
    setMode("create"); setCurrentId(null);
    setForm({ street:"", number:"", regionId:"", communeId:"", postalCode:"", references:"" });
    setCommunes([]);
    setOpenForm(true);
  }

  function onOpenEdit(row: AddressRow) {
    setMode("edit");
    const rid = (row as any)._id ?? (row as any).id;
    setCurrentId(rid);
    const region = (row as any).regionId ?? (row as any).region ?? "";
    const countyCode = (row as any).countyCode ?? "";
    const communeName = (row as any).communeId ?? (row as any).commune ?? (row as any).comuna ?? "";
    setForm({
      street: row.street ?? "",
      number: row.number ?? "",
      regionId: region,
      communeId: communeName,
      countyCode: countyCode,
      postalCode: (row as any).postalCode ?? (row as any).postal_code ?? "",
      references: row.references ?? "",
    });
    const rMatch = regions.find(r => r.name === region) || null;
    const communes = rMatch?.communes ?? [];
    setCommunes(communes);
    setOpenForm(true);
  }

  function onView(row: AddressRow) {
    setDetailRow(row);
    setOpenDetail(true);
  }

  function onAskDelete(id: string | number) {
    setCurrentId(id);
    setOpenDelete(true);
  }

  async function onSave() {
    const payload: NewAddress = {
      street: form.street,
      number: form.number,
      regionId: form.regionId,
      communeId: form.communeId,
      countyCode: form.countyCode, // Código Chilexpress
      postalCode: form.postalCode || "",
      references: form.references || "",
    };
    if (mode === "create") await add(payload);
    else if (currentId != null) await edit(currentId, payload);
    setOpenForm(false);
  }

  return (
    <Box sx={{ px: { xs: 1, md: 0 }, py: 1, mb: 12 }}>
      <NavigationButtons />
      <PageCard>
        <SectionHeader
          title="Mis direcciones"
          subtitle="Añade y administra tus direcciones de envío."
          actions={
            <Button onClick={onOpenCreate} startIcon={<AddIcon/>} variant="contained" size="small">
              Nueva dirección
            </Button>
          }
        />

        <Card variant="outlined" sx={{ p: 1.5, mt: 1.5, mb: 2 }}>
          <AddressTable
            rows={items}
            loading={loading}
            onView={onView}
            onEdit={onOpenEdit}
            onDelete={(id) => onAskDelete(id)}
          />
        </Card>
      </PageCard>

      <AddressModal
        open={openForm}
        title={mode === "create" ? "Nueva dirección" : "Editar dirección"}
        value={form}
        onChange={setForm}
        onClose={() => setOpenForm(false)}
        onSave={onSave}
        disabledSave={!canSave}
        regions={regions}
        communes={communes}
        onSelectRegion={(_, v) => { 
          // En modo edición, no limpiar communeId y countyCode
          if (mode === "edit") {
            setForm(f => ({...f, regionId: v?.name ?? ""}));
          } else {
            setForm(f => ({...f, regionId: v?.name ?? "", communeId:"", countyCode: ""}));
          }
          setCommunes(v?.communes ?? []); 
        }}
        onSelectCommune={(_, v) => { setForm(f => ({...f, communeId: v?.name ?? "", countyCode: v?.code ?? ""})); }}
      />

      <DetailDialog open={openDetail} row={detailRow} onClose={() => setOpenDetail(false)} />

      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => { if (currentId != null) await remove(currentId); setOpenDelete(false); }}
      />
    </Box>
  );
}
