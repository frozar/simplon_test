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
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import MuiAlert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Link from "../src/Link";
import CreateUser from "../components/CreateUser";
import EditUser from "../components/EditUser";
import { SUCCESS, ALREADY_EXIST } from "../src/constant";

const CustomizedPaper = styled(Paper)(({ theme }) => {
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

const defaultRows = [
  { id: 1, nom: "Wissart", prenom: "Lolita" },
  { id: 2, nom: "Deniset", prenom: "Armand" },
  { id: 3, nom: "Rozar", prenom: "Fabien" },
];

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

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Utilisateur() {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [deleteDisable, setDeleteDisable] = React.useState(true);
  const [rows, setRows] = React.useState(defaultRows);
  const [openCreateUser, setOpenCreateUser] = React.useState(false);
  const [openEditUser, setOpenEditUser] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const selectionToDelete = React.useRef([]);
  const userToEdit = React.useRef(null);
  const notificationMessage = React.useRef("");

  const handleOpenCreateUser = () => setOpenCreateUser(true);
  const handleCloseCreateUser = () => setOpenCreateUser(false);

  const handleOpenEditUser = () => setOpenEditUser(true);
  const handleCloseEditUser = () => setOpenEditUser(false);

  const handleDelete = () => {
    const filtedRows = rows.filter(
      (item) => !selectionToDelete.current.includes(item.id)
    );
    setRows(filtedRows);
    notificationMessage.current = "Utilisateur supprimé";
    setOpenSnackBar(true);
  };

  const showSnackBar = (notificationMessageArg) => {
    notificationMessage.current = notificationMessageArg;
    setOpenSnackBar(true);
  };

  const hideSnackBar = () => {
    setOpenSnackBar(false);
  };

  const handleEdit = (params) => {
    const { row: user } = params;
    userToEdit.current = user;
    handleOpenEditUser();
  };

  const newUser = (values) => {
    const alreadyExist =
      rows.filter(
        (item) => item.nom === values.nom && item.prenom === values.prenom
      ).length !== 0;
    if (alreadyExist) {
      return ALREADY_EXIST;
    } else {
      const ids = rows.map((item) => item.id);
      let newId = 1;
      while (ids.includes(newId)) {
        newId += 1;
      }
      setRows([...rows, { id: newId, nom: values.nom, prenom: values.prenom }]);
      showSnackBar("Utilisateur ajouté");
      return SUCCESS;
    }
  };

  const editUser = (values, id) => {
    const alreadyExist =
      rows.filter(
        (item) => item.nom === values.nom && item.prenom === values.prenom
      ).length !== 0;
    if (alreadyExist) {
      return ALREADY_EXIST;
    } else {
      const mappedRows = rows.map((item) => {
        if (item.id === id) {
          return { ...item, nom: values.nom, prenom: values.prenom };
        } else {
          return item;
        }
      });
      setRows(mappedRows);
      showSnackBar("Utilisateur modifié");
      return SUCCESS;
    }
  };

  let columnWidth = 150;
  if (matchesSM) {
    columnWidth = 90;
  }

  const columns = [
    {
      id: 1,
      field: "nom",
      headerName: "Nom",
      width: columnWidth,
      hide: false,
      hideSortIcons: true,
    },
    { id: 2, field: "prenom", headerName: "Prénom", width: columnWidth },
    {
      id: 3,
      field: "edit",
      headerName: matchesSM ? "Edi." : "Editer",
      width: columnWidth / 1.5,
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

  let density = "standard";
  if (matchesSM) {
    density = "compact";
  }

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
              {matchesSM ? (
                <Link href="/">
                  <Button variant="contained" color="secondary">
                    <ArrowBackIosIcon fontSize="small" />
                  </Button>
                </Link>
              ) : (
                <Link href="/">
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ArrowBackIosIcon fontSize="large" />}
                  >
                    Accueil
                  </Button>
                </Link>
              )}
            </Grid>
            <Grid item>
              <Typography variant="h6" component="h2" color="primary">
                Utilisateurs
              </Typography>
            </Grid>
            <Grid item>
              {matchesSM ? (
                <Button
                  aria-label="add"
                  color="secondary"
                  onClick={handleOpenCreateUser}
                >
                  <PersonAddIcon />
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<PersonAddIcon />}
                  onClick={handleOpenCreateUser}
                >
                  Nouvel utilisateur
                </Button>
              )}
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
                selectionToDelete.current = newSelectionModel;
              }}
              selectionModel={selectionToDelete.current}
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
        newUser={newUser}
      />
      <EditUser
        openModal={openEditUser}
        handleClose={handleCloseEditUser}
        userToEdit={userToEdit.current}
        editUser={editUser}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackBar}
        onClose={hideSnackBar}
        TransitionComponent={SlideTransition}
        autoHideDuration={3000}
      >
        <Alert onClose={hideSnackBar} severity="success" sx={{ width: "100%" }}>
          {notificationMessage.current}
        </Alert>
      </Snackbar>
    </>
  );
}
