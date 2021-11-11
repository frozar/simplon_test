import * as Yup from "yup";

import FormBooking from "./FormBooking";
import {
  CHRONOLOGICAL_ERROR,
  USER_INTERSECTION_ERROR,
  COMPUTER_INTERSECTION_ERROR,
} from "../src/constant";

export default function EditBooking(props) {
  const { openModal, handleClose, bookingToEdit, editBooking } = props;

  const initialValues = {
    utilisateur:
      bookingToEdit && bookingToEdit.utilisateur
        ? bookingToEdit.utilisateur
        : "",
    ordinateur:
      bookingToEdit && bookingToEdit.ordinateur ? bookingToEdit.ordinateur : "",
    debut:
      bookingToEdit && bookingToEdit.debut
        ? bookingToEdit.debut.toDate()
        : new Date(),
    fin:
      bookingToEdit && bookingToEdit.fin
        ? bookingToEdit.fin.toDate()
        : new Date(),
  };
  const validationSchema = Yup.object({
    utilisateur: Yup.string().required("Utilisateur ?"),
    ordinateur: Yup.string().required("Ordinateur ?"),
    debut: Yup.date().required("Début ?"),
    fin: Yup.date().required("Fin ?"),
  });

  const onSubmit = async (values, formik) => {
    const bookingCandidate = values;
    const res = await editBooking(bookingCandidate, bookingToEdit.id);
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
      title="Modifier réservation"
      openModal={openModal}
      handleClose={handleClose}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    />
  );
}
