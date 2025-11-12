import { useMemo, useState } from "react";
import { Box, Button, Card, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageCard from "../../../components/primitives/PageCard";
import SectionHeader from "../../../components/primitives/SectionHeader";
import AddressTable from "./AddressTable";
import AddressModal from "./AddressModal";
import DetailDialog from "./DetailDialog";
import DeleteDialog from "./DeleteDialog";
import { useAddressesCrud } from "./hooks/useAddressesCrud";
import { getRegionsWithProvincesAndCommunes, type PostalRegion, type PostalProvince, type PostalCommune } from "../../../db/config/postal.service";
import { useEffect } from "react";
import type { AddressRow, NewAddress } from "../../../types/address";
import type { AddressFormValue, Region, Province, Commune } from "../../../components/forms/AddressForm";

const mapPostal = (data: PostalRegion[]): Region[] =>
  data.map((r) => ({
    name: r.name,
    provinces: r.provinces?.map((p: PostalProvince) => ({
      name: p.name,
      communes: p.communes?.map((c: PostalCommune) => ({ name: c.name })) ?? [],
    })) ?? [],
  }));

export default function AddressesPage() {
  const userId = "1"; // sustituir por auth real
  const { items, loading, add, edit, remove } = useAddressesCrud(userId);

  // UI state
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create"|"edit">("create");
  const [currentId, setCurrentId] = useState<string | number | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailRow, setDetailRow] = useState<AddressRow | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  // form + cascada
  const [regions, setRegions] = useState<Region[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [form, setForm] = useState<AddressFormValue>({
    street:"", number:"", regionId:"", provinceId:"", communeId:"", postalCode:"", references:""
  });

  useEffect(() => {
    (async () => {
      const data = await getRegionsWithProvincesAndCommunes();
      setRegions(mapPostal(data));
    })();
  }, []);

  const requiredOK = useMemo(() =>
    form.regionId && form.provinceId && form.communeId && form.street && form.number,
  [form]);

  function onOpenCreate() {
    setMode("create"); setCurrentId(null);
    setForm({ street:"", number:"", regionId:"", provinceId:"", communeId:"", postalCode:"", references:"" });
    setProvinces([]); setCommunes([]);
    setOpenForm(true);
  }

  function onOpenEdit(row: AddressRow) {
    setMode("edit");
    const rid = (row as any)._id ?? (row as any).id;
    setCurrentId(rid);
    const region = (row as any).regionId ?? (row as any).region ?? "";
    const province = (row as any).provinceId ?? (row as any).province ?? "";
    const commune = (row as any).communeId ?? (row as any).comune ?? "";
    setForm({
      street: row.street ?? "",
      number: row.number ?? "",
      regionId: region,
      provinceId: province,
      communeId: commune,
      postalCode: (row as any).postalCode ?? (row as any).postal_code ?? "",
      references: row.references ?? "",
    });
    const rMatch = regions.find(r => r.name === region) || null;
    setProvinces(rMatch?.provinces ?? []);
    const pMatch = rMatch?.provinces?.find(p => p.name === province) || null;
    setCommunes(pMatch?.communes ?? []);
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
      street: form.street, number: form.number,
      regionId: form.regionId, provinceId: form.provinceId, communeId: form.communeId,
      postalCode: form.postalCode || "", references: form.references || "",
    };
    if (mode === "create") await add(payload);
    else if (currentId != null) await edit(currentId, payload);
    setOpenForm(false);
  }

  return (
    <Box sx={{ px: { xs: 2, md: 0 }, py: 1 }}>
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

        <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Lista</Typography>
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
        disabledSave={!requiredOK}
        regions={regions}
        provinces={provinces}
        communes={communes}
        onSelectRegion={(_, v) => { setForm(f => ({...f, regionId: v?.name ?? "", provinceId:"", communeId:""})); setProvinces(v?.provinces ?? []); setCommunes([]); }}
        onSelectProvince={(_, v) => { setForm(f => ({...f, provinceId: v?.name ?? "", communeId:""})); setCommunes(v?.communes ?? []); }}
        onSelectCommune={(_, v) => { setForm(f => ({...f, communeId: v?.name ?? ""})); }}
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
