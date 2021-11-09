import * as Yup from "yup";

import FormUser from "./FormUser";
import { ALREADY_EXIST } from "../src/constant";

export default function CreateUser(props) {
  const { openModal, handleClose, userToEdit, editUser } = props;

  const initialValues = {
    nom: userToEdit && userToEdit.nom ? userToEdit.nom : "",
    prenom: userToEdit && userToEdit.prenom ? userToEdit.prenom : "",
  };
  const validationSchema = Yup.object({
    nom: Yup.string().max(100, "Nom trop grand").required("Nom ?"),
    prenom: Yup.string().max(100, "Prénom trop grand").required("Prénom ?"),
  });

  const onSubmit = async (values, formik) => {
    const res = editUser(values, userToEdit.id);
    if (res === ALREADY_EXIST) {
      const errorMessage = "Cet utilisateur existe déjà";
      console.error(errorMessage);
      formik.setErrors({ ...formik.errors, global: errorMessage });
    } else {
      handleClose();
    }
  };

  return (
    <FormUser
      title="Editer un utilisateur"
      openModal={openModal}
      handleClose={handleClose}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    />
  );
}
