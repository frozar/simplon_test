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

import { Formik, Form, Field } from "formik";

function AutofocusTextField(props) {
  return <TextField {...props} autoFocus />;
}

export default function FormUser(props) {
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
              return (
                <Form style={{ width: "100%" }}>
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
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl style={{ width: "100%" }}>
                        <Field
                          name="prenom"
                          id="prenom"
                          label="Pr??nom"
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
                      </FormControl>
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
