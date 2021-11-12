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
import {
  retrieveComputersInDB,
  retrieveComputerInDB,
  newComputerInDB,
  updateComputerInDB,
  deleteComputerInDB,
} from "../src/db/ordinateur";
import {
  retrieveBookingsInDB,
  deleteBookingInDB,
  updateBookingInDB,
} from "../src/db/reservation";

const defaultRows = [
  // "Supercomputer Fugaku", "Summit", "Sierra"
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
  const [loading, setLoading] = React.useState(true);
  const [selectionToDelete, setSelectionToDelete] = React.useState([]);

  const computerToEdit = React.useRef(null);
  const severity = React.useRef("success");
  const notificationMessage = React.useRef("");

  const updateRowsFromDB = React.useCallback(async () => {
    const computers = await retrieveComputersInDB();
    setRows(computers);
  }, []);

  // Init rows
  React.useEffect(() => {
    const process = async () => {
      setLoading(true);
      await updateRowsFromDB();
      setLoading(false);
    };
    process();
  }, [updateRowsFromDB]);

  const handleOpenCreateComputer = () => setOpenCreateComputer(true);
  const handleCloseCreateComputer = () => setOpenCreateComputer(false);

  const handleOpenEditComputer = () => setOpenEditComputer(true);
  const handleCloseEditComputer = () => setOpenEditComputer(false);

  const showSnackBar = (notificationMessageArg, severityArg = "success") => {
    severity.current = severityArg;
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
      const process = async () => {
        setLoading(true);
        const newComputer = await newComputerInDB(values);
        if (newComputer !== null) {
          showSnackBar("Ordinateur ajouté");
          setRows([...rows, newComputer]);
        } else {
          showSnackBar("ERROR: ajout ordinateur", "error");
        }
        setLoading(false);
      };
      process();
      return SUCCESS;
    }
  };

  const editComputer = (computeCandidate, id) => {
    const alreadyExist =
      rows.filter((item) => item.nom === computeCandidate.nom).length !== 0;
    if (alreadyExist) {
      return ALREADY_EXIST;
    } else {
      const process = async () => {
        setLoading(true);
        try {
          const { nom: computerName } = await retrieveComputerInDB(id);

          // Modify the existing booking to match with the new computer name
          const bookings = await retrieveBookingsInDB();
          const bookingsToModify = bookings.filter(
            (b) => b.ordinateur === computerName
          );

          const modifiedBookings = bookingsToModify.map((b) => ({
            ...b,
            ordinateur: computeCandidate.nom,
          }));

          const toWait = [];
          for (const b of modifiedBookings) {
            const { id, ...values } = b;
            toWait.push(updateBookingInDB(values, b.id));
          }
          await Promise.all(toWait);

          await updateComputerInDB(computeCandidate, id);
          showSnackBar("Ordinateur modifié");
          await updateRowsFromDB();
        } catch (e) {
          console.error("Error modification ordinateur: ", e);
          showSnackBar("ERROR: modification ordinateur", "error");
        }
        setLoading(false);
      };
      process();
      return SUCCESS;
    }
  };

  const deleteComputer = async () => {
    setLoading(true);
    // Cascade on delete relation between computer and reservation
    const toWait = [];
    for (const computerId of selectionToDelete) {
      toWait.push(retrieveComputerInDB(computerId));
    }
    await Promise.all(toWait);
    const computersToDelete = [];
    for (const wkComputer of toWait) {
      const computer = await wkComputer;
      computersToDelete.push(computer);
    }
    const computersName = computersToDelete.map((c) => `${c.nom}`);

    const bookings = await retrieveBookingsInDB();
    const bookingsToDelete = bookings.filter((b) =>
      computersName.includes(b.ordinateur)
    );

    toWait.length = 0;
    for (const { id: bookingId } of bookingsToDelete) {
      toWait.push(deleteBookingInDB(bookingId));
    }
    await Promise.all(toWait);

    toWait.length = 0;
    for (const computerId of selectionToDelete) {
      toWait.push(deleteComputerInDB(computerId));
    }
    await Promise.all(toWait);
    showSnackBar("Ordinateur supprimé");
    await updateRowsFromDB();
    setLoading(false);
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
            <Grid item xs={2} sm={3}>
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

            <Grid container item justifyContent="center" xs={8} sm={6}>
              <Typography variant="h6" component="h2" color="primary">
                Ordinateurs
              </Typography>
            </Grid>

            <Grid item xs={2} sm={3} />
          </Grid>
          <CustomDataGrid
            rows={rows}
            columns={columns}
            handleDelete={deleteComputer}
            selectionToDelete={selectionToDelete}
            setSelectionToDelete={setSelectionToDelete}
            emptyMessage="Pas d'ordinateurs"
            handleCreateItem={handleOpenCreateComputer}
            loading={loading}
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
        <Alert
          onClose={hideSnackBar}
          severity={severity.current}
          sx={{ width: "100%" }}
        >
          {notificationMessage.current}
        </Alert>
      </Snackbar>
    </>
  );
}
