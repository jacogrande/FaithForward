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
import { getStorage } from "firebase/storage";

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
export const storage = getStorage(app);

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
  if (!auth.currentUser) {
    throw new Error("Not logged in");
  }

  // Sync push token in pushTokens collection
  let pushTokenData: any = {
    token: pushToken,
    userId: auth.currentUser.uid,
  };

  const nineAM = new Date();
  nineAM.setHours(9);
  nineAM.setMinutes(0);
  nineAM.setSeconds(0);
  nineAM.setMilliseconds(0);

  // If document doesn't exist, add createdAt to the data
  const pushTokenDoc = doc(db, "pushTokens", pushToken);
  const pushTokenDocSnapshot = await getDoc(pushTokenDoc);
  if (!pushTokenDocSnapshot.exists()) {
    const aYearAgo = new Date();
    aYearAgo.setFullYear(aYearAgo.getFullYear() - 1);

    pushTokenData = {
      ...pushTokenData,
      timeZone,
      nextNotificationTime: nineAM.toISOString(),
      lastNotificationTime: aYearAgo.toISOString(),
      createdAt: new Date(),
    };
  } else {
    // If document exists, only update timeZone and nextNotification time if timeZone is different
    const pushTokenDataFromDb = pushTokenDocSnapshot.data();
    if (pushTokenDataFromDb?.timeZone !== timeZone) {
      pushTokenData = {
        ...pushTokenData,
        timeZone,
        nextNotificationTime: nineAM.toISOString(),
      };
    }
  }

  await setDoc(doc(db, "pushTokens", pushToken), pushTokenData, {
    merge: true,
  });

  // Add push token to user document
  const userRef = doc(db, "users", auth.currentUser.uid);
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
