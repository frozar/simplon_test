import React from "react";
import Head from "next/head";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import LogoutIcon from "@mui/icons-material/Logout";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import PersonIcon from "@mui/icons-material/Person";
import ComputerIcon from "@mui/icons-material/Computer";

import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline/lib";
import moment from "moment";
// make sure you include the timeline stylesheet or the timeline
// will not be styled
import "react-calendar-timeline/lib/Timeline.css";

import Container from "../components/Container";

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

export default function Home() {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const headerRef = React.useRef(null);
  const [calendarWidth, setCalendarWidth] = React.useState(null);

  React.useEffect(() => {
    // console.dir(headerRef.current.offsetWidth);
    setCalendarWidth(headerRef.current.offsetWidth);
  }, [headerRef]);

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

          {calendarWidth && (
            <Grid
              container
              item
              style={{
                width: `${calendarWidth}px`,
                display: "block",
              }}
            >
              <Timeline
                groups={groups}
                items={items}
                defaultTimeStart={moment().add(-12, "hour")}
                defaultTimeEnd={moment().add(12, "hour")}
              >
                <TimelineHeaders className="sticky">
                  <DateHeader unit="primaryHeader" />
                  <DateHeader />
                </TimelineHeaders>
              </Timeline>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}
