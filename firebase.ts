import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgj0UDgTub38VuhVjUFIe9Sc5U_ODJK1c",
  authDomain: "robo-jesus.firebaseapp.com",
  projectId: "robo-jesus",
  storageBucket: "robo-jesus.appspot.com",
  messagingSenderId: "758499978476",
  appId: "1:758499978476:web:b0a923bdce3247a90b09c9",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export interface PromptPayload {
  userInput: string;
  response: string;
}

export const createPrompt = async (newPrompt: PromptPayload) => {
  if (!auth.currentUser) {
    throw new Error("Not logged in");
  }

  const userRef = doc(db, "users", auth.currentUser.uid);
  const promptRef = await addDoc(collection(userRef, "prompts"), {
    ...newPrompt,
    createdAt: new Date(),
  });
  return promptRef;
};
