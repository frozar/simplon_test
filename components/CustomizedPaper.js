import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";

export default styled(Paper)(({ theme }) => {
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  let margin = 2;
  let padding = 2;
  if (matchesSM) {
    margin = 0;
    padding = 1;
  }
  return `
    width: 100%;
    margin: ${theme.spacing(margin)};
    padding: ${theme.spacing(padding)};
    box-shadow: ${theme.shadows[10]};
  `;
});
