import React from "react";
import Head from "next/head";
import { styled, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {
  DataGrid,
  GridColumnMenu,
  GridColumnMenuContainer,
  GridFilterMenuItem,
  SortGridMenuItems,
  GridOverlay,
} from "@mui/x-data-grid";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Link from "../src/Link";
import CreateUser from "../components/CreateUser";

const CustomizedPaper = styled(Paper)(
  ({ theme }) => `
    width: 100%;
    margin: ${theme.spacing(2)};
    padding: ${theme.spacing(2)};
    box-shadow: ${theme.shadows[10]};
  `
);

const defaultRows = [
  { id: 1, nom: "Wissart", prenom: "Lolita" },
  { id: 2, nom: "Deniset", prenom: "Armand" },
  { id: 3, nom: "Rozar", prenom: "Fabien" },
];

function CustomColumnMenuComponent(props) {
  // const classes = useStyles();
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

function CustomNoRowsOverlay() {
  const theme = useTheme();
  return (
    <GridOverlay
      style={{
        background: theme.palette.grey[200],
      }}
    >
      <Typography variant="caption">Pas d&apos;utilisateurs</Typography>
    </GridOverlay>
  );
}

export default function Utilisateur() {
  const theme = useTheme();

  const [deleteDisable, setDeleteDisable] = React.useState(true);
  const [selectionToDelete, setSelectionToDelete] = React.useState([]);
  const [rows, setRows] = React.useState(defaultRows);
  const [openCreateUser, setOpenCreateUser] = React.useState(false);

  const handleOpenCreateUser = () => setOpenCreateUser(true);
  const handleCloseCreateUser = () => setOpenCreateUser(false);

  const handleDelete = () => {
    const filtedRows = rows.filter(
      (item) => !selectionToDelete.includes(item.id)
    );
    setRows(filtedRows);
  };

  const handleEdit = (params) => {
    console.log(params);
  };

  const columns = [
    {
      id: 1,
      field: "nom",
      headerName: "Nom",
      width: 150,
      hide: false,
      hideSortIcons: true,
    },
    { id: 2, field: "prenom", headerName: "Prénom", width: 150 },
    {
      id: 3,
      field: "edit",
      headerName: "Editer",
      width: 70,
      disableColumnMenu: true,
      disableColumnSelector: true,

      renderCell: (params) => {
        const { id } = params.row;
        return (
          <IconButton aria-label="edit" onClick={() => handleEdit(params)}>
            <EditIcon />
          </IconButton>
        );
      },
    },
  ];

  return (
    <>
      <Head>
        <title>RéservAli | Utilisateur</title>
        <meta
          name="description"
          content="Application de réservation d'ordinateur"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid
        container
        item
        style={{
          width: "100%",
        }}
      >
        <CustomizedPaper>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginBottom: theme.spacing(2) }}
          >
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ArrowBackIosIcon fontSize="large" />}
              >
                <Link href="/">Accueil</Link>
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="h6" component="h2" color="primary">
                Utilisateurs
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<PersonAddIcon />}
                onClick={handleOpenCreateUser}
              >
                Nouvel utilisateur
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="flex-start"
            style={{ marginBottom: theme.spacing(1) }}
          >
            <IconButton
              aria-label="delete"
              disabled={deleteDisable}
              onClick={handleDelete}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
          <div
            style={{
              height: "60vh",
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(newSelectionModel) => {
                // console.log("newSelectionModel", newSelectionModel);
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
                NoRowsOverlay: CustomNoRowsOverlay,
              }}
            />
          </div>
        </CustomizedPaper>
      </Grid>
      <CreateUser
        openModal={openCreateUser}
        handleClose={handleCloseCreateUser}
      />
    </>
  );
}
