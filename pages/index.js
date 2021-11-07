import React from "react";
import Head from "next/head";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import LogoutIcon from "@mui/icons-material/Logout";

import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline/lib";
import moment from "moment";
// make sure you include the timeline stylesheet or the timeline
// will not be styled
import "react-calendar-timeline/lib/Timeline.css";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 2,
};

const styleLogoutButton = {
  position: "absolute",
  top: "0",
  right: "0",
  marginRight: "14px",
  marginTop: "5px",
};

const groups = [...Array(5).keys()].map((i) => ({ id: i, title: `PC ${i}` }));
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

export default function Home() {
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

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
      <Button
        variant="contained"
        color="secondary"
        startIcon={<LogoutIcon fontSize="large" />}
        sx={styleLogoutButton}
      >
        Logout
      </Button>
      <Grid container justifyContent="center">
        <Grid item>
          <h1>RéservAli</h1>
        </Grid>
      </Grid>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().add(-12, "hour")}
        defaultTimeEnd={moment().add(12, "hour")}
      >
        <TimelineHeaders className="sticky">
          <SidebarHeader>
            {({ getRootProps }) => {
              return (
                <div {...getRootProps()}>
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    style={{ height: "100%" }}
                  >
                    <Grid item>
                      <Button variant="contained" onClick={handleOpen}>
                        <Typography id="admin-button" variant="button">
                          Admin
                        </Typography>
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              );
            }}
          </SidebarHeader>
          <DateHeader unit="primaryHeader" />
          <DateHeader />
        </TimelineHeaders>
      </Timeline>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal}>
          <Grid container justifyContent="center">
            <Grid item>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Panneau d&apos;administration
              </Typography>
            </Grid>
            <Grid
              container
              item
              justifyContent="space-evenly"
              style={{ marginTop: "15px" }}
            >
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => alert("utilisateur")}
                >
                  <Typography id="admin-utilisateur-button" variant="button">
                    Gérer les utilisateurs
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={() => alert("machine")}>
                  <Typography id="admin-machine-button" variant="button">
                    Gérer les machines
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
}
