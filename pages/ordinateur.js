import React from "react";
import Head from "next/head";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Typography from "@mui/material/Typography";

import Link from "../src/Link";

const styleAccueilButton = {
  position: "absolute",
  top: "0",
  left: "0",
  marginTop: "5px",
  marginLeft: "14px",
};

export default function Utilisateur() {
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

      <Button
        variant="contained"
        color="secondary"
        startIcon={<ArrowBackIosIcon fontSize="large" />}
        sx={styleAccueilButton}
      >
        <Link href="/">Accueil</Link>
      </Button>
      <Grid container justifyContent="center">
        <Grid item>
          <Typography variant="h1">Hello ordinateur</Typography>
        </Grid>
      </Grid>
    </>
  );
}
