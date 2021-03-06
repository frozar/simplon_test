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
import EditIcon from "@mui/icons-material/Edit";

import Link from "../src/Link";
import CreateUser from "../components/CreateUser";
import EditUser from "../components/EditUser";
import Container from "../components/Container";
import CustomDataGrid from "../components/CustomDataGrid";
import { SUCCESS, ALREADY_EXIST } from "../src/constant";
import {
  retrieveUsersInDB,
  retrieveUserInDB,
  newUserInDB,
  updateUserInDB,
  deleteUserInDB,
} from "../src/db/utilisateur";
import {
  retrieveBookingsInDB,
  deleteBookingInDB,
  updateBookingInDB,
} from "../src/db/reservation";

const defaultRows = [
  // "Wissart Lolita", "Deniset Armand", "Rozar Fabien"
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
  const [loading, setLoading] = React.useState(true);
  const [selectionToDelete, setSelectionToDelete] = React.useState([]);

  const userToEdit = React.useRef(null);
  const severity = React.useRef("success");
  const notificationMessage = React.useRef("");

  const updateRowsFromDB = React.useCallback(async () => {
    const users = await retrieveUsersInDB();
    setRows(users);
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

  const handleOpenCreateUser = () => setOpenCreateUser(true);
  const handleCloseCreateUser = () => setOpenCreateUser(false);

  const handleOpenEditUser = () => setOpenEditUser(true);
  const handleCloseEditUser = () => setOpenEditUser(false);

  const showSnackBar = (notificationMessageArg, severityArg = "success") => {
    severity.current = severityArg;
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

  const newUser = async (values) => {
    const alreadyExist =
      rows.filter(
        (item) => item.nom === values.nom && item.prenom === values.prenom
      ).length !== 0;
    if (alreadyExist) {
      return ALREADY_EXIST;
    } else {
      const process = async () => {
        setLoading(true);
        const newUser = await newUserInDB(values);
        if (newUser !== null) {
          showSnackBar("Utilisateur ajout??");
          setRows([...rows, newUser]);
        } else {
          showSnackBar("ERROR: ajout utilisateur", "error");
        }
        setLoading(false);
      };
      process();
      return SUCCESS;
    }
  };

  const editUser = (userCandidate, id) => {
    const alreadyExist =
      rows.filter(
        (item) =>
          item.nom === userCandidate.nom && item.prenom === userCandidate.prenom
      ).length !== 0;
    if (alreadyExist) {
      return ALREADY_EXIST;
    } else {
      const process = async () => {
        setLoading(true);
        try {
          const { nom, prenom } = await retrieveUserInDB(id);
          const userFullName = `${nom} ${prenom}`;

          // Modify the existing booking to match with the new utilisateur name
          const bookings = await retrieveBookingsInDB();
          const bookingsToModify = bookings.filter(
            (b) => b.utilisateur === userFullName
          );

          const modifiedBookings = bookingsToModify.map((b) => ({
            ...b,
            utilisateur: `${userCandidate.nom} ${userCandidate.prenom}`,
          }));

          const toWait = [];
          for (const b of modifiedBookings) {
            const { id, ...values } = b;
            toWait.push(updateBookingInDB(values, b.id));
          }
          await Promise.all(toWait);

          await updateUserInDB(userCandidate, id);
          showSnackBar("Utilisateur modifi??");
          await updateRowsFromDB();
        } catch (e) {
          console.error("Error modification utilisateur: ", e);
          showSnackBar("ERROR: modification utilisateur", "error");
        }
        setLoading(false);
      };
      process();
      return SUCCESS;
    }
  };

  const deleteUser = async () => {
    setLoading(true);
    // Cascade on delete relation between utilisateur and reservation
    const toWait = [];
    for (const userId of selectionToDelete) {
      toWait.push(retrieveUserInDB(userId));
    }
    await Promise.all(toWait);
    const usersToDelete = [];
    for (const wkUser of toWait) {
      const user = await wkUser;
      usersToDelete.push(user);
    }
    const userFullName = usersToDelete.map((u) => `${u.nom} ${u.prenom}`);

    const bookings = await retrieveBookingsInDB();
    const bookingsToDelete = bookings.filter((b) =>
      userFullName.includes(b.utilisateur)
    );

    toWait.length = 0;
    for (const { id: bookingId } of bookingsToDelete) {
      toWait.push(deleteBookingInDB(bookingId));
    }
    await Promise.all(toWait);

    toWait.length = 0;
    for (const userId of selectionToDelete) {
      toWait.push(deleteUserInDB(userId));
    }
    await Promise.all(toWait);
    showSnackBar("Utilisateur supprim??");
    await updateRowsFromDB();
    setLoading(false);
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
    },
    { id: 2, field: "prenom", headerName: "Pr??nom", width: columnWidth },
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
        <title>R??servAli | Utilisateur</title>
        <meta
          name="description"
          content="Application de r??servation d'ordinateur"
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
                Utilisateurs
              </Typography>
            </Grid>
            <Grid item xs={2} sm={3} />
          </Grid>
          <CustomDataGrid
            rows={rows}
            columns={columns}
            handleDelete={deleteUser}
            selectionToDelete={selectionToDelete}
            setSelectionToDelete={setSelectionToDelete}
            emptyMessage="Pas d'utilisateurs"
            handleCreateItem={handleOpenCreateUser}
            loading={loading}
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
