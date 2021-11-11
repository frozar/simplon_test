import React from "react";
import Head from "next/head";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import MuiAlert from "@mui/material/Alert";

import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import PersonIcon from "@mui/icons-material/Person";
import ComputerIcon from "@mui/icons-material/Computer";

import moment from "moment";

import Container from "../components/Container";
import Calendar from "../components/Calendar";
import CustomDataGrid from "../components/CustomDataGrid";
import CreateBooking from "../components/CreateBooking";
import EditBooking from "../components/EditBooking";
import { retrieveUserInDB } from "../src/db/utilisateur";
import { retrieveComputerInDB } from "../src/db/ordinateur";
import {
  retrieveBookingsInDB,
  newBookingInDB,
  deleteBookingInDB,
  updateBookingInDB,
} from "../src/db/reservation";

import { SUCCESS, ALREADY_EXIST } from "../src/constant";

import Link from "../src/Link";

const groups = [...Array(50).keys()].map((i) => ({ id: i, title: `PC ${i}` }));
const items = [
  {
    id: 1,
    group: 1,
    title: "item 1",
    start_time: moment(),
    end_time: moment().add(1, "hour"),
  },
  {
    id: 2,
    group: 2,
    title: "item 2",
    start_time: moment().add(-0.5, "hour"),
    end_time: moment().add(0.5, "hour"),
  },
  {
    id: 3,
    group: 1,
    title: "item 3",
    start_time: moment().add(2, "hour"),
    end_time: moment().add(3, "hour"),
  },
];

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const defaultRows = [
  // {
  //   id: 1,
  //   utilisateur: "Wissart Lolita",
  //   ordinateur: "Summit",
  //   debut: moment(),
  //   fin: moment().add(1, "hour"),
  // },
];

const usersCache = {};
const computersCache = {};

export default function Home() {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [rows, setRows] = React.useState(defaultRows);
  const [openCreateBooking, setOpenCreateBooking] = React.useState(false);
  const [openEditBooking, setOpenEditBooking] = React.useState(false);
  // const [renderRows, setRenderRows] = React.useState(rows);
  const headerRef = React.useRef(null);
  const [calendarWidth, setCalendarWidth] = React.useState(null);
  const [selectionToDelete, setSelectionToDelete] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const bookingToEdit = React.useRef(null);
  const severity = React.useRef("success");
  const notificationMessage = React.useRef("");

  const handleOpenCreateBooking = () => setOpenCreateBooking(true);
  const handleCloseCreateBooking = () => setOpenCreateBooking(false);

  const handleOpenEditBooking = () => setOpenEditBooking(true);
  const handleCloseEditBooking = () => setOpenEditBooking(false);

  const showSnackBar = (notificationMessageArg, severityArg = "success") => {
    severity.current = severityArg;
    notificationMessage.current = notificationMessageArg;
    setOpenSnackBar(true);
  };

  const hideSnackBar = () => {
    setOpenSnackBar(false);
  };

  const handleEdit = (params) => {
    const { row: booking } = params;
    bookingToEdit.current = booking;
    handleOpenEditBooking();
  };

  const updateRowsFromDB = React.useCallback(async () => {
    const bookings = await retrieveBookingsInDB();
    setRows(bookings);
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

  // Update calendar
  React.useEffect(() => {
    setTimeout(() => {
      // console.dir(headerRef.current);
      // console.log("offsetWidth", headerRef.current.offsetWidth);
      setCalendarWidth(headerRef.current.offsetWidth);
    }, 0);
  }, [headerRef]);

  // const resolveItems = async (ids, retrieveFunc, cache) => {
  //   const items = {};
  //   for (const id of ids) {
  //     if (cache[id] !== undefined) {
  //       items[id] = cache[id];
  //     } else {
  //       items[id] = await retrieveFunc(id);
  //     }
  //   }
  //   return items;
  // };

  // const processRows = React.useCallback(async (rowsArg) => {
  //   const userIds = rowsArg.map((item) => item.utilisateur);
  //   const computerIds = rowsArg.map((item) => item.ordinateur);
  //   const users = await resolveItems(userIds, retrieveUserInDB, usersCache);
  //   const computers = await resolveItems(
  //     computerIds,
  //     retrieveComputerInDB,
  //     computersCache
  //   );

  //   const processedRows = rowsArg.map((item) => {
  //     const user = users[item.utilisateur];
  //     const userFullName = `${user.nom} ${user.prenom}`;
  //     return {
  //       ...item,
  //       utilisateur: userFullName,
  //       ordinateur: computers[item.ordinateur].nom,
  //     };
  //   });
  //   setRenderRows(processedRows);
  // }, []);

  // // Update renderRows
  // React.useEffect(() => {
  //   const process = async () => {
  //     setLoading(true);
  //     await processRows(rows);
  //     setLoading(false);
  //   };
  //   process();
  // }, [rows, processRows]);

  let columnWidth = 180;
  if (matchesSM) {
    columnWidth = 170;
  }

  const renderDate = (params) => {
    // console.log("params.value", params.value);
    const momentVar = moment(params.value.toDate());
    // const date = params.value.toDate();
    // console.log("date", date);
    momentVar.local("fr");
    const formatedDate = momentVar.format("YYYY/MM/DD HH:mm");
    return formatedDate;
  };

  const columns = [
    {
      id: 1,
      field: "utilisateur",
      headerName: "Utilisateur",
      width: columnWidth,
    },
    {
      id: 2,
      field: "ordinateur",
      headerName: "Ordinateur",
      width: columnWidth,
    },
    {
      id: 3,
      field: "debut",
      headerName: "Début",
      width: columnWidth,
      renderCell: renderDate,
    },
    {
      id: 4,
      field: "fin",
      headerName: "Fin",
      width: columnWidth,
      renderCell: renderDate,
    },
    {
      id: 5,
      field: "edit",
      headerName: matchesSM ? "Edi." : "Editer",
      width: columnWidth / 1.75,
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

  const newBooking = async (values) => {
    // // TODO: intersection avec les réservations existantes
    // const alreadyExist =
    //   rows.filter(
    //     (item) => item.nom === values.nom && item.prenom === values.prenom
    //   ).length !== 0;
    // if (alreadyExist) {
    //   return ALREADY_EXIST;
    // } else {
    //   const process = async () => {
    //     setLoading(true);
    //     const newBooking = await newUserInDB(values);
    //     if (newBooking !== null) {
    //       showSnackBar("Réservation ajoutée");
    //       setRows([...rows, newBooking]);
    //     } else {
    //       showSnackBar("ERROR: ajout réservation", "error");
    //     }
    //     setLoading(false);
    //   };
    //   process();
    //   return SUCCESS;
    // }

    // console.log("values", values);
    // console.log("typeof debut", typeof values.debut);
    // console.dir(values.debut);
    // const debutMoment = moment(values.debut);
    // console.dir(debutMoment);
    // {
    //   id: 1,
    //   utilisateur: "Wissart Lolita",
    //   ordinateur: "Summit",
    //   debut: moment(),
    //   fin: moment().add(1, "hour"),
    // }
    const process = async () => {
      setLoading(true);
      const newBooking = await newBookingInDB(values);
      if (newBooking !== null) {
        showSnackBar("Réservation ajouté");
        // setRows([...rows, newBooking]);
        updateRowsFromDB();
      } else {
        showSnackBar("ERROR: ajout réservation", "error");
      }
      setLoading(false);
    };
    process();
    return SUCCESS;
  };

  const editBooking = (values, id) => {
    // const alreadyExist =
    //   rows.filter(
    //     (item) => item.nom === values.nom && item.prenom === values.prenom
    //   ).length !== 0;
    // if (alreadyExist) {
    //   return ALREADY_EXIST;
    // } else {
    const process = async () => {
      setLoading(true);
      try {
        // console.log("values", values);
        await updateBookingInDB(values, id);
        showSnackBar("Réservation modifiée");
        updateRowsFromDB();
      } catch (e) {
        console.error("Error modification réservation: ", e);
        showSnackBar("ERROR: modification réservation", "error");
      }
      setLoading(false);
    };
    process();
    return SUCCESS;
    // }
  };

  const deleteBooking = async () => {
    const toWait = [];
    // console.log("selectionToDelete", selectionToDelete);
    for (const bookingId of selectionToDelete) {
      toWait.push(deleteBookingInDB(bookingId));
    }
    await Promise.all(toWait);
    showSnackBar("Réservation supprimé");
    updateRowsFromDB();
  };

  const dataGridDisplay = true;

  return (
    <>
      <Head>
        <title>RéservAli | Accueil</title>
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
            ref={headerRef}
          >
            <Grid item>
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <Link href="/utilisateur">
                    {matchesSM ? (
                      <Button
                        variant="contained"
                        startIcon={<SettingsApplicationsIcon />}
                      >
                        <PersonIcon />
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={
                          <SettingsApplicationsIcon fontSize="large" />
                        }
                      >
                        <Typography variant="button">Utilisateur</Typography>
                      </Button>
                    )}
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/ordinateur">
                    {matchesSM ? (
                      <Button
                        variant="contained"
                        startIcon={<SettingsApplicationsIcon />}
                      >
                        <ComputerIcon />
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={
                          <SettingsApplicationsIcon fontSize="large" />
                        }
                      >
                        <Typography variant="button">Ordinateur</Typography>
                      </Button>
                    )}
                  </Link>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Typography variant="h3" component="h1" color="primary">
                RéservAli
              </Typography>
            </Grid>

            <Grid item>
              <Link href="/login">
                {matchesSM ? (
                  <Button variant="contained" color="secondary">
                    <LogoutIcon />
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<LogoutIcon fontSize="large" />}
                  >
                    Logout
                  </Button>
                )}
              </Link>
            </Grid>
          </Grid>

          {dataGridDisplay ? (
            <CustomDataGrid
              rows={rows}
              // rows={renderRows}
              columns={columns}
              handleDelete={deleteBooking}
              selectionToDelete={selectionToDelete}
              setSelectionToDelete={setSelectionToDelete}
              emptyMessage="Pas de réservations"
              handleCreateItem={handleOpenCreateBooking}
              loading={loading}
            />
          ) : (
            calendarWidth && (
              <Calendar
                groups={groups}
                items={items}
                calendarWidth={calendarWidth}
              />
            )
          )}
        </Grid>
      </Container>

      <CreateBooking
        openModal={openCreateBooking}
        handleClose={handleCloseCreateBooking}
        newBooking={newBooking}
      />
      <EditBooking
        openModal={openEditBooking}
        handleClose={handleCloseEditBooking}
        bookingToEdit={bookingToEdit.current}
        editBooking={editBooking}
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
