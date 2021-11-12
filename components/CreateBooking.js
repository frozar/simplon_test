import * as Yup from "yup";

import moment from "moment";

import FormBooking from "./FormBooking";
import {
  CHRONOLOGICAL_ERROR,
  USER_INTERSECTION_ERROR,
  COMPUTER_INTERSECTION_ERROR,
} from "../src/constant";

const computeRoundDate = (moment) => {
  const date = moment.toDate();
  let min = date.getMinutes();
  min = Math.floor(min / 5) * 5;
  date.setMinutes(min);
  date.setSeconds(0, 0);
  return date;
};

export default function CreateBooking(props) {
  const { openModal, handleClose, newBooking } = props;

  const momentDebut = moment().add(5, "minute");
  const dateDebut = computeRoundDate(momentDebut);
  const momentFin = moment().add(35, "minute");
  const dateFin = computeRoundDate(momentFin);

  const initialValues = {
    utilisateur: "",
    ordinateur: "",
    debut: dateDebut,
    fin: dateFin,
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
