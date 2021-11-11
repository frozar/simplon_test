import React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import {
  DataGrid,
  GridColumnMenu,
  GridColumnMenuContainer,
  GridFilterMenuItem,
  SortGridMenuItems,
  GridOverlay,
} from "@mui/x-data-grid";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function CustomColumnMenuComponent(props) {
  const { hideMenu, currentColumn, color, ...other } = props;
  const possibleColumnNames = ["nom", "prenom"];

  if (possibleColumnNames.includes(currentColumn.field)) {
    return (
      <GridColumnMenuContainer
        hideMenu={hideMenu}
        currentColumn={currentColumn}
        {...other}
      >
        <SortGridMenuItems onClick={hideMenu} column={currentColumn} />
        <GridFilterMenuItem onClick={hideMenu} column={currentColumn} />
      </GridColumnMenuContainer>
    );
  }

  return (
    <GridColumnMenu
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      {...other}
    />
  );
}

function CustomNoRowsOverlay(message) {
  const theme = useTheme();
  // eslint-disable-next-line react/display-name
  return () => {
    return (
      <GridOverlay
        style={{
          background: theme.palette.grey[200],
        }}
      >
        <Typography variant="caption">{message}</Typography>
      </GridOverlay>
    );
  };
}

export default function CustomDataGrid(props) {
  const {
    rows,
    columns,
    handleDelete,
    selectionToDelete,
    setSelectionToDelete,
    emptyMessage,
    handleCreateItem,
    ...other
  } = props;
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [deleteDisable, setDeleteDisable] = React.useState(true);

  let density = "standard";
  if (matchesSM) {
    density = "compact";
  }

  return (
    <Grid container item spacing={1}>
      <Grid container item>
        <Grid container justifyContent="space-between">
          <Grid item>
            <IconButton
              aria-label="add"
              onClick={handleCreateItem}
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="delete"
              disabled={deleteDisable}
              onClick={handleDelete}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        item
        style={{
          height: "70vh",
          width: "100%",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          density={density}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(newSelectionModel) => {
            if (newSelectionModel.length === 0 && !deleteDisable) {
              setDeleteDisable(true);
            } else if (newSelectionModel.length !== 0 && deleteDisable) {
              setDeleteDisable(false);
            }
            setSelectionToDelete(newSelectionModel);
          }}
          selectionModel={selectionToDelete}
          components={{
            ColumnMenu: CustomColumnMenuComponent,
            NoRowsOverlay: CustomNoRowsOverlay(emptyMessage),
          }}
          {...other}
        />
      </Grid>
    </Grid>
  );
}
