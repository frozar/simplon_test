import {
  retrieveItems,
  retrieveItem,
  newItem,
  updateItem,
  deleteItem,
} from "./generique";

const COLLECTION_RESERVATION = "reservation";

export async function retrieveBookingsInDB() {
  return retrieveItems(COLLECTION_RESERVATION);
}

export async function retrieveBookingInDB(id) {
  return retrieveItem(COLLECTION_RESERVATION, id);
}

export async function newBookingInDB(values) {
  return newItem(COLLECTION_RESERVATION, values);
}

export async function updateBookingInDB(values, id) {
  return updateItem(COLLECTION_RESERVATION, values, id);
}

export async function deleteBookingInDB(id) {
  return deleteItem(COLLECTION_RESERVATION, id);
}
