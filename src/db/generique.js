import { app } from "../firebase";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const db = getFirestore(app);

export async function retrieveItems(collectionArg) {
  const querySnapshot = await getDocs(collection(db, collectionArg));
  const items = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() });
  });
  return items;
}

export async function retrieveItem(collectionArg, id) {
  // console.log("collectionArg", collectionArg);
  // console.log("id", id);

  const docRef = doc(db, collectionArg, id);

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return { id, ...docSnap.data() }; // docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return "Error";
  }

  // return getDoc(docRef);
  // return await getDoc(docRef);
  // return (await getDoc(docRef)).data();
}

export async function newItem(collectionArg, values) {
  try {
    const docRef = await addDoc(collection(db, collectionArg), {
      ...values,
    });
    const itemId = docRef.id;
    const newItem = { ...values, id: itemId };
    return newItem;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
}

export async function updateItem(collectionArg, values, id) {
  const docRef = doc(db, collectionArg, id);

  // console.log("updateItem id", id);
  // console.log("updateItem values", values);
  await updateDoc(docRef, {
    ...values,
  });

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    console.log("No such document!");
  }
}

export async function deleteItem(collectionArg, id) {
  const docRef = doc(db, collectionArg, id);
  await deleteDoc(docRef);
}
