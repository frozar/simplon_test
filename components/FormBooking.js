import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuItem from "@mui/material/MenuItem";

// import DateAdapter from "@mui/lab/AdapterMoment";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";

import { Formik, Form, Field } from "formik";

import { retrieveUsersInDB } from "../src/db/utilisateur";
import { retrieveComputersInDB } from "../src/db/ordinateur";

function AutofocusTextField(props) {
  return <TextField {...props} autoFocus />;
}

function dateOnly(inputDate) {
  let dateToDeal;
  if (inputDate === undefined) {
    dateToDeal = new Date();
  } else {
    dateToDeal = inputDate;
  }
  const dayStr = String(dateToDeal.getDate()).padStart(2, "0");
  const monthStr = String(dateToDeal.getMonth() + 1).padStart(2, "0");
  const yearStr = String(dateToDeal.getFullYear()).padStart(4, "0");
  const dateStr = `${yearStr}-${monthStr}-${dayStr}`;
  const dateOnly = new Date(dateStr);
  return dateOnly;
}

function UserField(props) {
  const { formik } = props;

  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    const process = async () => {
      const usersInDB = await retrieveUsersInDB();
      // console.log("usersInDB", usersInDB);
      setUsers(
        usersInDB.map((item) => ({
          id: item.id,
          label: `${item.nom} ${item.prenom}`,
        }))
      );
    };
    process();
  }, []);

  return (
    <FormControl style={{ width: "100%" }}>
      <Field
        name="utilisateur"
        id="utilisateur"
        label="Utilisateur"
        type="text"
        component={TextField}
        variant="outlined"
        required
        value={formik.values.utilisateur}
        onBlur={formik.handleBlur("utilisateur")}
        onChange={formik.handleChange("utilisateur")}
        error={
          formik.errors.utilisateur !== undefined && formik.touched.utilisateur
        }
        select={true}
      >
        <MenuItem value="">
          <Typography variant="body1">
            <em>None</em>
          </Typography>
        </MenuItem>
        {users.map((user) => {
          return (
            <MenuItem key={user.id} value={user.label}>
              <Typography variant="body1">{user.label}</Typography>
            </MenuItem>
          );
        })}
      </Field>
      {formik.errors.utilisateur !== undefined && formik.touched.utilisateur ? (
        <FormHelperText error>{formik.errors.utilisateur}</FormHelperText>
      ) : null}
    </FormControl>
  );
}

function ComputerField(props) {
  const { formik } = props;

  const [computers, setComputers] = React.useState([]);

  React.useEffect(() => {
    const process = async () => {
      const computersInDB = await retrieveComputersInDB();
      // console.log("computersInDB", computersInDB);
      setComputers(
        computersInDB.map((item) => ({
          id: item.id,
          label: `${item.nom}`,
        }))
      );
    };
    process();
  }, []);

  return (
    <FormControl style={{ width: "100%" }}>
      <Field
        name="ordinateur"
        id="ordinateur"
        label="Ordinateur"
        type="text"
        component={TextField}
        variant="outlined"
        required
        value={formik.values.ordinateur}
        onBlur={formik.handleBlur("ordinateur")}
        onChange={formik.handleChange("ordinateur")}
        error={
          formik.errors.ordinateur !== undefined && formik.touched.ordinateur
        }
        select={true}
      >
        <MenuItem value="">
          <Typography variant="body1">
            <em>None</em>
          </Typography>
        </MenuItem>
        {computers.map((computer) => {
          return (
            <MenuItem key={computer.id} value={computer.label}>
              <Typography variant="body1">{computer.label}</Typography>
            </MenuItem>
          );
        })}
      </Field>
      {formik.errors.ordinateur !== undefined && formik.touched.ordinateur ? (
        <FormHelperText error>{formik.errors.ordinateur}</FormHelperText>
      ) : null}
    </FormControl>
  );
}

function LocalizedDateTimePicker(props) {
  const {
    // variant,
    // field: { name, value },
    onChange: onChangeArg,
    ...other
  } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        // type="text"
        // value={value}
        // onChange={onChangeArg}
        minutesStep={5}
        renderInput={(params) => {
          // console.log("params", params);
          return (
            <TextField // type="text"
              {...params}
            />
          );
        }}
        ampm={false}
        onChange={(valueArg) => {
          // console.log("valueArg", valueArg);
          onChangeArg({
            target: {
              name: "debut",
              // value: dateOnly(valueArg),
              value: valueArg,
            },
          });
        }}
        {...other}
      />
    </LocalizationProvider>
  );
}

export default function FormBooking(props) {
  const {
    title,
    openModal,
    handleClose,
    initialValues,
    validationSchema,
    onSubmit,
  } = props;
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  let boxWidth = "60%";
  if (matchesSM) {
    boxWidth = "90%";
  }

  const styleModal = {
    position: "absolute",
    left: "50%",
    top: "20%",
    transform: "translate(-50%, 0%)",
    bgcolor: "background.paper",
    borderRadius: "20px",
    boxShadow: 24,
    p: 2,
    width: boxWidth,
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="form-user-popup"
      aria-describedby="form-user-popup"
    >
      <Box sx={styleModal}>
        <Grid
          container
          justifyContent="center"
          direction="column"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h6" component="h2" color="primary">
              {title}
            </Typography>
          </Grid>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              // console.log(
              //   "formik.errors.debut",
              //   formik.errors.debut,
              //   "formik.touched.debut",
              //   formik.touched.debut
              // );
              return (
                <Form style={{ width: "100%" }}>
                  <Grid container>
                    <Grid
                      container
                      item
                      justifyContent="space-evenly"
                      spacing={2}
                      style={{ marginTop: "1px" }}
                    >
                      <Grid item xs={6}>
                        {/* <FormControl style={{ width: "100%" }}>
                          <Field
                            name="nom"
                            id="nom"
                            label="Nom"
                            type="text"
                            component={AutofocusTextField}
                            variant="outlined"
                            required
                            value={formik.values.nom}
                            onBlur={formik.handleBlur("nom")}
                            onChange={formik.handleChange("nom")}
                            error={
                              formik.errors.nom !== undefined &&
                              formik.touched.nom
                            }
                            placeholder=""
                          />
                          {formik.errors.nom !== undefined &&
                          formik.touched.nom ? (
                            <FormHelperText error>
                              {formik.errors.nom}
                            </FormHelperText>
                          ) : null}
                        </FormControl> */}
                        <UserField formik={formik} />
                      </Grid>
                      <Grid item xs={6}>
                        {/* <FormControl style={{ width: "100%" }}>
                          <Field
                            name="prenom"
                            id="prenom"
                            label="Prénom"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            required
                            value={formik.values.prenom}
                            onBlur={formik.handleBlur("prenom")}
                            onChange={formik.handleChange("prenom")}
                            error={
                              formik.errors.prenom !== undefined &&
                              formik.touched.prenom
                            }
                            placeholder=""
                          />
                          {formik.errors.prenom !== undefined &&
                          formik.touched.prenom ? (
                            <FormHelperText error>
                              {formik.errors.prenom}
                            </FormHelperText>
                          ) : null}
                        </FormControl> */}
                        <ComputerField formik={formik} />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      item
                      justifyContent="space-evenly"
                      spacing={2}
                      style={{ marginTop: "1px" }}
                    >
                      <Grid item xs={6}>
                        <FormControl style={{ width: "100%" }}>
                          <Field
                            name="debut"
                            id="debut"
                            label="Début"
                            type="text"
                            component={LocalizedDateTimePicker}
                            variant="outlined"
                            required
                            value={formik.values.debut}
                            onBlur={formik.handleBlur("debut")}
                            onChange={formik.handleChange("debut")}
                            error={
                              formik.errors.debut !== undefined &&
                              formik.touched.debut
                            }
                          />
                          {formik.errors.debut !== undefined &&
                          formik.touched.debut ? (
                            <FormHelperText error>
                              {formik.errors.debut}
                            </FormHelperText>
                          ) : null}
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl style={{ width: "100%" }}>
                          <Field
                            name="fin"
                            id="fin"
                            label="Fin"
                            type="text"
                            component={LocalizedDateTimePicker}
                            variant="outlined"
                            required
                            value={formik.values.fin}
                            onBlur={formik.handleBlur("fin")}
                            onChange={formik.handleChange("fin")}
                            error={
                              formik.errors.fin !== undefined &&
                              formik.touched.fin
                            }
                          />
                          {formik.errors.fin !== undefined &&
                          formik.touched.fin ? (
                            <FormHelperText error>
                              {formik.errors.fin}
                            </FormHelperText>
                          ) : null}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  {Object.keys(formik.errors).includes("global") &&
                    formik.errors.global.length !== 0 && (
                      <Grid
                        container
                        justifyContent="center"
                        item
                        style={{ marginTop: "16px" }}
                      >
                        <Typography variant="subtitle1" color="error">
                          {formik.errors.global}
                        </Typography>
                      </Grid>
                    )}
                  <Grid
                    container
                    justifyContent="flex-end"
                    item
                    style={{ marginTop: "16px" }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        !(formik.dirty && formik.isValid) || formik.isSubmitting
                      }
                      onClick={(evt) => {
                        formik.submitForm(evt, formik);
                      }}
                    >
                      <Typography variant="button">VALIDER</Typography>
                    </Button>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </Grid>
      </Box>
    </Modal>
  );
}
