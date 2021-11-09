import Grid from "@mui/material/Grid";
import CustomizedPaper from "./CustomizedPaper";

export default function Container(props) {
  const { children, ...other } = props;
  return (
    <Grid
      container
      item
      style={{
        width: "100%",
      }}
      {...other}
    >
      <CustomizedPaper>{children}</CustomizedPaper>
    </Grid>
  );
}
