import * as Yup from "yup";

import FormBooking from "./FormBooking";
import { ALREADY_EXIST } from "../src/constant";

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
    const res = await editBooking(values, bookingToEdit.id);
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
      title="Modifier réservation"
      openModal={openModal}
      handleClose={handleClose}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    />
  );
}
