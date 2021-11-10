import React from "react";
import Head from "next/head";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import MuiAlert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";

import Link from "../src/Link";
import CreateUser from "../components/CreateUser";
import EditUser from "../components/EditUser";
import Container from "../components/Container";
import CustomDataGrid from "../components/CustomDataGrid";
import { SUCCESS, ALREADY_EXIST } from "../src/constant";

const defaultRows = [
  { id: 1, nom: "Wissart", prenom: "Lolita" },
  { id: 2, nom: "Deniset", prenom: "Armand" },
  { id: 3, nom: "Rozar", prenom: "Fabien" },
];

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Utilisateur() {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [rows, setRows] = React.useState(defaultRows);
  const [openCreateUser, setOpenCreateUser] = React.useState(false);
  const [openEditUser, setOpenEditUser] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const userToEdit = React.useRef(null);
  const notificationMessage = React.useRef("");

  const handleOpenCreateUser = () => setOpenCreateUser(true);
  const handleCloseCreateUser = () => setOpenCreateUser(false);

  const handleOpenEditUser = () => setOpenEditUser(true);
  const handleCloseEditUser = () => setOpenEditUser(false);

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

      <Container>
        <Grid container direction="column" spacing={1}>
          <Grid
            container
            item
            justifyContent="space-between"
            alignItems="center"
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
                  aria-label="add-user"
                  color="secondary"
                  onClick={handleOpenCreateUser}
                >
                  <PersonAddIcon />
                </Button>
              ) : (
                <Button
                  aria-label="add-user"
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
          <CustomDataGrid
            rows={rows}
            setRows={setRows}
            columns={columns}
            showSnackBar={showSnackBar}
            deleteMessage="Utilisateur supprimé"
          />
        </Grid>
      </Container>

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
