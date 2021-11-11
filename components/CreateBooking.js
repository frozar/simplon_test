import * as Yup from "yup";

import FormBooking from "./FormBooking";
import { ALREADY_EXIST } from "../src/constant";

export default function CreateBooking(props) {
  const { openModal, handleClose, newBooking } = props;

  const initialValues = {
    utilisateur: "",
    ordinateur: "",
    debut: new Date(),
    fin: new Date(),
  };
  const validationSchema = Yup.object({
    utilisateur: Yup.string().required("Utilisateur ?"),
    ordinateur: Yup.string().required("Ordinateur ?"),
    debut: Yup.date().required("Début ?"),
    fin: Yup.date().required("Fin ?"),
  });

  const onSubmit = async (values, formik) => {
    const res = await newBooking(values);
    if (res === ALREADY_EXIST) {
      const errorMessage = "Cette réservation existe déjà";
      console.error(errorMessage);
      formik.setErrors({ ...formik.errors, global: errorMessage });
    } else {
      handleClose();
    }
  };

  return (
    <FormBooking
      title="Nouvelle réservation"
      openModal={openModal}
      handleClose={handleClose}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    />
  );
}
