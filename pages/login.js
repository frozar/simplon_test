import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import * as Yup from "yup";

import { userService } from "services";

import FormLogin from "../components/FormLogin";
import Container from "../components/Container";

export default Login;

function Login() {
  const router = useRouter();

  useEffect(() => {
    // redirect to home if already logged in
    if (userService.userValue) {
      router.push("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit({ login: username, password }, formik) {
    return userService
      .login(username, password)
      .then(() => {
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl || "/";
        router.push(returnUrl);
      })
      .catch((error) => {
        console.error(error);
        formik.setErrors({ ...formik.errors, global: error });
      });
  }

  const initialValues = {
    login: "",
    password: "",
  };
  const validationSchema = Yup.object({
    login: Yup.string().required("Login ?"),
    password: Yup.string().required("Password ?"),
  });

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
        <FormLogin
          title="Login"
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        />
      </Container>
    </>
  );
}
