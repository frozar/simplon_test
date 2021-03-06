import {
  retrieveItems,
  retrieveItem,
  newItem,
  updateItem,
  deleteItem,
} from "./generique";

const COLLECTION_ORDINATEUR = "computer";

export async function retrieveComputersInDB() {
  return retrieveItems(COLLECTION_ORDINATEUR);
}

export async function retrieveComputerInDB(id) {
  return retrieveItem(COLLECTION_ORDINATEUR, id);
}

export async function newComputerInDB(values) {
  return newItem(COLLECTION_ORDINATEUR, values);
}

export async function updateComputerInDB(values, id) {
  return updateItem(COLLECTION_ORDINATEUR, values, id);
}

export async function deleteComputerInDB(id) {
  return deleteItem(COLLECTION_ORDINATEUR, id);
}
