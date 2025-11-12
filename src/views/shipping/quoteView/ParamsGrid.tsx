// src/views/shipping/Quote/ParamsGrid.tsx
import { Box } from "@mui/material";
import ParamCell from "../../../components/common/feedback/ParamCell";

export default function ParamsGrid(props: {
  weight: string; setWeight: (v: string) => void;
  height: string; setHeight: (v: string) => void;
  width: string;  setWidth: (v: string) => void;
  length: string; setLength: (v: string) => void;
  declared: string; setDeclared: (v: string) => void;
  volumeM3: string;
}) {
  const { weight, setWeight, height, setHeight, width, setWidth, length, setLength, declared, setDeclared, volumeM3 } = props;

  return (
    <Box sx={{ display: "grid", gap: 0.75, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" } }}>
      <ParamCell label="Peso" unit="kg" value={weight} onChange={setWeight} />
      <ParamCell label="Alto" unit="cm" value={height} onChange={setHeight} />
      <ParamCell label="Ancho" unit="cm" value={width} onChange={setWidth} />
      <ParamCell label="Largo" unit="cm" value={length} onChange={setLength} />
      <ParamCell label="Volumen" unit="m³" value={volumeM3} readOnly />
      <ParamCell label="Valor declarado" unit="CLP" value={declared} onChange={setDeclared} />
    </Box>
  );
}
