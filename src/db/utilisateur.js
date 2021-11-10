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

const COLLECTION_UTILISATEUR = "utilisateur";

export async function retrieveUserInDB() {
  const querySnapshot = await getDocs(collection(db, COLLECTION_UTILISATEUR));
  const users = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
}

export async function newUserInDB(values) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_UTILISATEUR), {
      ...values,
    });
    const newId = docRef.id;
    const newUser = { ...values, id: newId };
    return newUser;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
}

export async function updateUserInDB(values, id) {
  const docRef = doc(db, COLLECTION_UTILISATEUR, id);

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

export async function deleteUserInDB(id) {
  const docRef = doc(db, COLLECTION_UTILISATEUR, id);
  await deleteDoc(docRef);
}
