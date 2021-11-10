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
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ComputerIcon from "@mui/icons-material/Computer";
import EditIcon from "@mui/icons-material/Edit";

import Link from "../src/Link";
import CreateComputer from "../components/CreateComputer";
import EditComputer from "../components/EditComputer";
import Container from "../components/Container";
import CustomDataGrid from "../components/CustomDataGrid";
import { SUCCESS, ALREADY_EXIST } from "../src/constant";

const defaultRows = [
  { id: 1, nom: "Supercomputer Fugaku" },
  { id: 2, nom: "Summit" },
  { id: 3, nom: "Sierra" },
];

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Ordianteur() {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [rows, setRows] = React.useState(defaultRows);
  const [openCreateComputer, setOpenCreateComputer] = React.useState(false);
  const [openEditComputer, setOpenEditComputer] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const computerToEdit = React.useRef(null);
  const notificationMessage = React.useRef("");

  const handleOpenCreateComputer = () => setOpenCreateComputer(true);
  const handleCloseCreateComputer = () => setOpenCreateComputer(false);

  const handleOpenEditComputer = () => setOpenEditComputer(true);
  const handleCloseEditComputer = () => setOpenEditComputer(false);

  const showSnackBar = (notificationMessageArg) => {
    notificationMessage.current = notificationMessageArg;
    setOpenSnackBar(true);
  };

  const hideSnackBar = () => {
    setOpenSnackBar(false);
  };

  const handleEdit = (params) => {
    const { row: computer } = params;
    computerToEdit.current = computer;
    handleOpenEditComputer();
  };

  const newComputer = (values) => {
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
      showSnackBar("Ordinateur ajouté");
      return SUCCESS;
    }
  };

  const editComputer = (values, id) => {
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
      showSnackBar("Ordinateur modifié");
      return SUCCESS;
    }
  };

  let columnWidth = 200;
  if (matchesSM) {
    columnWidth = 180;
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
    {
      id: 2,
      field: "edit",
      headerName: matchesSM ? "Edi." : "Editer",
      width: columnWidth / 2.5,
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
        <title>RéservAli | Ordinateur</title>
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
                Ordinateurs
              </Typography>
            </Grid>
            <Grid item>
              {matchesSM ? (
                <Button
                  aria-label="add-computer"
                  variant="outlined"
                  color="secondary"
                  startIcon={<ComputerIcon />}
                  onClick={handleOpenCreateComputer}
                >
                  +
                </Button>
              ) : (
                <Button
                  aria-label="add-computer"
                  variant="outlined"
                  color="secondary"
                  startIcon={<ComputerIcon />}
                  onClick={handleOpenCreateComputer}
                >
                  Nouvel ordinateur
                </Button>
              )}
            </Grid>
          </Grid>
          <CustomDataGrid
            rows={rows}
            setRows={setRows}
            columns={columns}
            showSnackBar={showSnackBar}
            deleteMessage="Ordinateur supprimé"
          />
        </Grid>
      </Container>

      <CreateComputer
        openModal={openCreateComputer}
        handleClose={handleCloseCreateComputer}
        newComputer={newComputer}
      />
      <EditComputer
        openModal={openEditComputer}
        handleClose={handleCloseEditComputer}
        userToEdit={computerToEdit.current}
        editUser={editComputer}
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
