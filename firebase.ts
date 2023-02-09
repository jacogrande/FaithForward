import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseProdConfig = {
  apiKey: "AIzaSyDgj0UDgTub38VuhVjUFIe9Sc5U_ODJK1c",
  authDomain: "robo-jesus.firebaseapp.com",
  projectId: "robo-jesus",
  storageBucket: "robo-jesus.appspot.com",
  messagingSenderId: "758499978476",
  appId: "1:758499978476:web:b0a923bdce3247a90b09c9",
};

const firebaseTestConfig = {
  apiKey: "AIzaSyDXo560wC9I_wNGTtdEkxXQwyQEQ7b_1wQ",
  authDomain: "faith-forward-staging.firebaseapp.com",
  projectId: "faith-forward-staging",
  storageBucket: "faith-forward-staging.appspot.com",
  messagingSenderId: "258551589120",
  appId: "1:258551589120:web:a885ce057ee015ce86abe5",
};

const firebaseConfig =
  process.env.NODE_ENV === "production"
    ? firebaseProdConfig
    : firebaseTestConfig;

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

export const syncPushToken = async (
  pushToken: string,
  timeZone: string | null
) => {
  console.log("Syncing push token:", pushToken);
  if (!auth.currentUser) {
    throw new Error("Not logged in");
  }

  // Sync push token in pushTokens collection
  console.log("Syncing push token...");

  let pushTokenData: any = {
    token: pushToken,
    userId: auth.currentUser.uid,
    createdAt: new Date(),
  };

  // If the push token has a timezone but the current device isn't supplying one
  // Don't overwrite what we have with null
  // TODO: Figure out a heuristic for handling push notifications for null timezones
  if (timeZone) {
    pushTokenData = {
      ...pushTokenData,
      timeZone,
    };
  }

  await setDoc(doc(db, "pushTokens", pushToken), pushTokenData, {
    merge: true,
  });

  // Add push token to user document
  const userRef = doc(db, "users", auth.currentUser.uid);
  console.log("Adding push token to user document...");
  await updateDoc(userRef, {
    pushTokens: arrayUnion(pushToken),
  });
};

// Delete a push token
export const deletePushToken = async (pushToken: string) => {
  if (!auth.currentUser) {
    throw new Error("Not logged in");
  }

  // Remove push token reference from user document
  const userRef = doc(db, "users", auth.currentUser.uid);
  await updateDoc(userRef, {
    pushTokens: arrayRemove(pushToken),
  });

  // Remove push token from pushTokens collection
  const pushTokenRef = doc(db, "pushTokens", pushToken);
  await deleteDoc(pushTokenRef);
};
