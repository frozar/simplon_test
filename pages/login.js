// import React from "react";
// import Head from "next/head";
// import { useTheme } from "@mui/material/styles";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";

// import MuiAlert from "@mui/material/Alert";
// import useMediaQuery from "@mui/material/useMediaQuery";

// import Container from "../components/Container";

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// export default function Login() {
//   const theme = useTheme();
//   const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

//   return (
//     <>
//       <Head>
//         <title>RéservAli | Login</title>
//         <meta
//           name="description"
//           content="Application de réservation d'ordinateur"
//         />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <Container>
//         <Grid container direction="column" spacing={1}>
//           <Grid container item justifyContent="center" alignItems="center">
//             <Grid item>
//               <Typography variant="h6" component="h2" color="primary">
//                 Login
//               </Typography>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Container>
//     </>
//   );
// }

// import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { useForm } from "react-hook-form";
// // import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";

// import { userService } from "services";

// export default Login;

// function Login() {
//   const router = useRouter();

//   useEffect(() => {
//     // redirect to home if already logged in
//     if (userService.userValue) {
//       router.push("/");
//     }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // form validation rules
//   const validationSchema = Yup.object().shape({
//     username: Yup.string().required("Username is required"),
//     password: Yup.string().required("Password is required"),
//   });
//   // const formOptions = { resolver: yupResolver(validationSchema) };
//   const formOptions = { resolver: () => {} };

//   // get functions to build form with useForm() hook
//   const { register, handleSubmit, setError, formState } = useForm(formOptions);
//   const { errors } = formState;

//   function onSubmit({ username, password }) {
//     return userService
//       .login(username, password)
//       .then(() => {
//         // get return url from query parameters or default to '/'
//         const returnUrl = router.query.returnUrl || "/";
//         router.push(returnUrl);
//       })
//       .catch((error) => {
//         setError("apiError", { message: error });
//       });
//   }

//   return (
//     <div className="col-md-6 offset-md-3 mt-5">
//       <div className="alert alert-info">
//         Username: test
//         <br />
//         Password: test
//       </div>
//       <div className="card">
//         <h4 className="card-header">Next.js Basic Authentication Example</h4>
//         <div className="card-body">
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="form-group">
//               <label>Username</label>
//               <input
//                 name="username"
//                 type="text"
//                 {...register("username")}
//                 className={`form-control ${
//                   errors.username ? "is-invalid" : ""
//                 }`}
//               />
//               <div className="invalid-feedback">{errors.username?.message}</div>
//             </div>
//             <div className="form-group">
//               <label>Password</label>
//               <input
//                 name="password"
//                 type="password"
//                 {...register("password")}
//                 className={`form-control ${
//                   errors.password ? "is-invalid" : ""
//                 }`}
//               />
//               <div className="invalid-feedback">{errors.password?.message}</div>
//             </div>
//             <button
//               disabled={formState.isSubmitting}
//               className="btn btn-primary"
//             >
//               {formState.isSubmitting && (
//                 <span className="spinner-border spinner-border-sm mr-1"></span>
//               )}
//               Login
//             </button>
//             {errors.apiError && (
//               <div className="alert alert-danger mt-3 mb-0">
//                 {errors.apiError?.message}
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect } from "react";
import { useRouter } from "next/router";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
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

  // // form validation rules
  // const validationSchema = Yup.object().shape({
  //   username: Yup.string().required("Username is required"),
  //   password: Yup.string().required("Password is required"),
  // });
  // // const formOptions = { resolver: yupResolver(validationSchema) };
  // const formOptions = { resolver: () => {} };

  // // get functions to build form with useForm() hook
  // const { register, handleSubmit, setError, formState } = useForm(formOptions);
  // const { errors } = formState;

  function onSubmit({ login: username, password }, formik) {
    return userService
      .login(username, password)
      .then(() => {
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl || "/";
        router.push(returnUrl);
      })
      .catch((error) => {
        // setError("apiError", { message: error });
        // const errorMessage = "Cet utilisateur existe déjà";
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
    // <div className="col-md-6 offset-md-3 mt-5">
    //   <div className="alert alert-info">
    //     Username: test
    //     <br />
    //     Password: test
    //   </div>
    //   <div className="card">
    //     <h4 className="card-header">Next.js Basic Authentication Example</h4>
    //     <div className="card-body">
    //       <form onSubmit={handleSubmit(onSubmit)}>
    //         <div className="form-group">
    //           <label>Username</label>
    //           <input
    //             name="username"
    //             type="text"
    //             {...register("username")}
    //             className={`form-control ${
    //               errors.username ? "is-invalid" : ""
    //             }`}
    //           />
    //           <div className="invalid-feedback">{errors.username?.message}</div>
    //         </div>
    //         <div className="form-group">
    //           <label>Password</label>
    //           <input
    //             name="password"
    //             type="password"
    //             {...register("password")}
    //             className={`form-control ${
    //               errors.password ? "is-invalid" : ""
    //             }`}
    //           />
    //           <div className="invalid-feedback">{errors.password?.message}</div>
    //         </div>
    //         <button
    //           disabled={formState.isSubmitting}
    //           className="btn btn-primary"
    //         >
    //           {formState.isSubmitting && (
    //             <span className="spinner-border spinner-border-sm mr-1"></span>
    //           )}
    //           Login
    //         </button>
    //         {errors.apiError && (
    //           <div className="alert alert-danger mt-3 mb-0">
    //             {errors.apiError?.message}
    //           </div>
    //         )}
    //       </form>
    //     </div>
    //   </div>
    // </div>

    <Container>
      <FormLogin
        title="Login"
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      />
    </Container>
  );
}
