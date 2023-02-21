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
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { TSermon } from "./types";

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

export const favoriteSermon = async (sermon: TSermon) => {
  if (!auth.currentUser) {
    throw new Error("Not logged in");
  }

  const userRef = doc(db, "users", auth.currentUser.uid);
  const sermonRef = doc(db, "sermons", sermon.id);

  // Handle the users/favorites subcollection
  // If the user has already favorited the sermon, do nothing
  const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
  const favoritesQuery = query(
    collection(userDoc.ref, "favorites"),
    where("type", "==", "sermon"),
    where("docId", "==", sermon.id)
  );
  const favoritesQuerySnapshot = await getDocs(favoritesQuery);
  if (favoritesQuerySnapshot.docs.length > 0) {
    console.warn("User has already favorited this sermon");
  } else {
    await addDoc(collection(userRef, "favorites"), {
      type: "sermon",
      docId: sermonRef.id,
      docData: sermon,
      createdAt: new Date(),
    });
  }

  // Handle the sermons.favoritedBy field
  // If the sermon has already been favorited by the user, do nothing
  const sermonDoc = await getDoc(doc(db, "sermons", sermon.id));
  const sermonFavoritedBy = sermonDoc.data()?.favoritedBy;
  if (
    sermonFavoritedBy?.some((user: any) => user.id === auth.currentUser?.uid)
  ) {
    console.warn("Sermon has already been favorited by user");
  } else {
    // Add user to sermon's favoritedBy
    await updateDoc(sermonRef, {
      favoritedBy: arrayUnion(auth.currentUser.uid),
    });
  }
};

export const unfavoriteSermon = async (sermon: TSermon) => {
  if (!auth.currentUser) {
    throw new Error("Not logged in");
  }

  const userRef = doc(db, "users", auth.currentUser.uid);
  const sermonRef = doc(db, "sermons", sermon.id);

  // Handle users/favorites subcollection
  // If the user has not favorited the sermon, do nothing
  const favoritesQuery = query(
    collection(userRef, "favorites"),
    where("type", "==", "sermon"),
    where("docId", "==", sermon.id)
  );
  const favoritesQuerySnapshot = await getDocs(favoritesQuery);
  // Get document ID of favorite
  if (favoritesQuerySnapshot.docs.length === 0) {
    console.warn("User has not favorited this sermon");
  } else {
    const favoriteDocId = favoritesQuerySnapshot.docs[0].id;
    const favoriteRef = await getDoc(doc(userRef, "favorites", favoriteDocId));
    await deleteDoc(favoriteRef.ref);
  }

  // Handle sermon.favoritedBy field
  // If the sermon has not been favorited by the user, do nothing
  const sermonDoc = await getDoc(doc(db, "sermons", sermon.id));
  const sermonFavoritedBy = sermonDoc.data()?.favoritedBy;
  if (
    !sermonFavoritedBy?.some(
      (userId: string) => userId === auth.currentUser?.uid
    )
  ) {
    console.warn("Sermon has not been favorited by user");
  } else {
    // Remove user from sermon's favoritedBy
    await updateDoc(sermonRef, {
      favoritedBy: arrayRemove(auth.currentUser.uid),
    });
  }
};
