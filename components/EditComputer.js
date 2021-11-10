import * as Yup from "yup";

import FormComputer from "./FormComputer";
import { ALREADY_EXIST } from "../src/constant";

export default function EditComputer(props) {
  const { openModal, handleClose, userToEdit, editUser } = props;

  const initialValues = {
    nom: userToEdit && userToEdit.nom ? userToEdit.nom : "",
  };
  const validationSchema = Yup.object({
    nom: Yup.string().max(100, "Nom trop grand").required("Nom ?"),
  });

  const onSubmit = async (values, formik) => {
    const res = editUser(values, userToEdit.id);
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
      title="Editer un ordinateur"
      openModal={openModal}
      handleClose={handleClose}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    />
  );
}
