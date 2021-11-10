import * as Yup from "yup";

import FormComputer from "./FormComputer";
import { ALREADY_EXIST } from "../src/constant";

export default function CreateComputer(props) {
  const { openModal, handleClose, newComputer } = props;

  const initialValues = {
    nom: "",
  };
  const validationSchema = Yup.object({
    nom: Yup.string().max(100, "Nom trop grand").required("Nom ?"),
  });

  const onSubmit = async (values, formik) => {
    const res = newComputer(values);
    if (res === ALREADY_EXIST) {
      const errorMessage = "Cet ordinateur existe déjà";
      console.error(errorMessage);
      formik.setErrors({ ...formik.errors, global: errorMessage });
    } else {
      handleClose();
    }
  };

  return (
    <FormComputer
      title="Nouvel ordinateur"
      openModal={openModal}
      handleClose={handleClose}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    />
  );
}
