import { InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";

export const InputPassword = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    position: "relative",
    fontSize: 13,
    fontWeight: 500,
    padding: "14px 18px 14px 18px",
  },
  borderWidth: "1px",
  borderStyle: "solid",
  borderRadius: "12px",
  justifyContent: "space-between",
}));

// Alias para compatibilidad
export const InputPassWord = InputPassword;

export default InputPassword;
