import * as Yup from "yup";

import FormBooking from "./FormBooking";
import {
  CHRONOLOGICAL_ERROR,
  USER_INTERSECTION_ERROR,
  COMPUTER_INTERSECTION_ERROR,
} from "../src/constant";

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
    const bookingCandidate = values;
    const res = await newBooking(bookingCandidate);
    if (res === CHRONOLOGICAL_ERROR) {
      const errorMessage = "La fin de la réservation doit être après le début";
      console.error(errorMessage);
      formik.setErrors({ ...formik.errors, global: errorMessage });
    } else if (res === USER_INTERSECTION_ERROR) {
      const errorMessage = `${bookingCandidate.utilisateur} a déjà réservé un ordinateur sur cette période`;
      console.error(errorMessage);
      formik.setErrors({ ...formik.errors, global: errorMessage });
    } else if (res === COMPUTER_INTERSECTION_ERROR) {
      console.log("bookingCandidate.ordinateur", bookingCandidate.ordinateur);
      const errorMessage = `${bookingCandidate.ordinateur} a déjà été réservé sur cette période`;
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
