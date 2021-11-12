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

export default function FormUser(props) {
  const {
    title,
    // openModal,
    // handleClose,
    initialValues,
    validationSchema,
    onSubmit,
  } = props;
  // const theme = useTheme();
  // const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  // let boxWidth = "60%";
  // if (matchesSM) {
  //   boxWidth = "90%";
  // }

  // const styleModal = {
  //   position: "absolute",
  //   left: "50%",
  //   top: "20%",
  //   transform: "translate(-50%, 0%)",
  //   bgcolor: "background.paper",
  //   borderRadius: "20px",
  //   boxShadow: 24,
  //   p: 2,
  //   width: boxWidth,
  // };

  return (
    // <Modal
    //   open={openModal}
    //   onClose={handleClose}
    //   aria-labelledby="form-user-popup"
    //   aria-describedby="form-user-popup"
    // >
    // <Box sx={styleModal}>
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
                      name="login"
                      id="login"
                      label="Login"
                      type="text"
                      component={TextField}
                      variant="outlined"
                      required
                      value={formik.values.login}
                      onBlur={formik.handleBlur("login")}
                      onChange={formik.handleChange("login")}
                      error={
                        formik.errors.login !== undefined &&
                        formik.touched.login
                      }
                      placeholder=""
                    />
                    {formik.errors.login !== undefined &&
                    formik.touched.login ? (
                      <FormHelperText error>
                        {formik.errors.login}
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl style={{ width: "100%" }}>
                    <Field
                      name="password"
                      id="password"
                      label="Password"
                      type="password"
                      component={TextField}
                      variant="outlined"
                      required
                      value={formik.values.password}
                      onBlur={formik.handleBlur("password")}
                      onChange={formik.handleChange("password")}
                      error={
                        formik.errors.password !== undefined &&
                        formik.touched.password
                      }
                      placeholder=""
                    />
                    {formik.errors.password !== undefined &&
                    formik.touched.password ? (
                      <FormHelperText error>
                        {formik.errors.password}
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
    // </Box>
    // </Modal>
  );
}
