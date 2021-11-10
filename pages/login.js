import React from "react";
import Head from "next/head";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import MuiAlert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";

import Container from "../components/Container";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Ordianteur() {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Head>
        <title>RéservAli | Login</title>
        <meta
          name="description"
          content="Application de réservation d'ordinateur"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Grid container direction="column" spacing={1}>
          <Grid container item justifyContent="center" alignItems="center">
            {/* <Grid item>
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
            </Grid> */}
            <Grid item>
              <Typography variant="h6" component="h2" color="primary">
                Login
              </Typography>
            </Grid>
            {/* <Grid item>
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
            </Grid> */}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
