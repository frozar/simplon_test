import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

import CustomizedPaper from "./CustomizedPaper";

export default function Container(props) {
  const { children, ...other } = props;
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  if (matchesSM) {
    return (
      <Box sx={{ p: 1 }} {...other}>
        {children}
      </Box>
    );
  } else {
    return (
      <Box sx={{ p: 1 }} {...other}>
        <CustomizedPaper sx={{ p: 2, m: 0 }}>{children}</CustomizedPaper>
      </Box>
    );
  }
}
