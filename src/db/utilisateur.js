import { retrieveItem, newItem, updateItem, deleteItem } from "./generique";

const COLLECTION_UTILISATEUR = "utilisateur";

export async function retrieveUserInDB() {
  return retrieveItem(COLLECTION_UTILISATEUR);
}

export async function newUserInDB(values) {
  return newItem(COLLECTION_UTILISATEUR, values);
}

export async function updateUserInDB(values, id) {
  return updateItem(COLLECTION_UTILISATEUR, values, id);
}

export async function deleteUserInDB(id) {
  return deleteItem(COLLECTION_UTILISATEUR, id);
}
