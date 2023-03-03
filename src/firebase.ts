import { TExegesis, TPersonalDevo, TSermon, TTradDevo } from "@src/types";
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
  if (!auth.currentUser || auth.currentUser.isAnonymous) {
    throw new Error("You must be logged in to do that.");
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
  if (!auth.currentUser || auth.currentUser.isAnonymous) {
    throw new Error("You must be logged in to do that.");
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

export const favoriteTradDevo = async (devo: TTradDevo) => {
  if (!auth.currentUser || auth.currentUser.isAnonymous) {
    throw new Error("You must be logged in to do that.");
  }

  const userRef = doc(db, "users", auth.currentUser.uid);
  const devoRef = doc(db, "devotionals", devo.id);

  // Handle the users/favorites subcollection
  // If the user has already favorited the devo, do nothing
  const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
  const favoritesQuery = query(
    collection(userDoc.ref, "favorites"),
    where("type", "==", "tradDevo"),
    where("docId", "==", devo.id)
  );
  const favoritesQuerySnapshot = await getDocs(favoritesQuery);
  if (favoritesQuerySnapshot.docs.length > 0) {
    console.warn("User has already favorited this trad devo");
  } else {
    await addDoc(collection(userRef, "favorites"), {
      type: "tradDevo",
      docId: devoRef.id,
      docData: devo,
      createdAt: new Date(),
    });
  }

  // Handle the devotionals.favoritedBy field
  // If the devo has already been favorited by the user, do nothing
  const devoDoc = await getDoc(doc(db, "devotionals", devo.id));
  const devoFavoritedBy = devoDoc.data()?.favoritedBy;
  if (devoFavoritedBy?.some((user: any) => user.id === auth.currentUser?.uid)) {
    console.warn("Devo has already been favorited by user");
  } else {
    // Add user to devo's favoritedBy
    await updateDoc(devoRef, {
      favoritedBy: arrayUnion(auth.currentUser.uid),
    });
  }
};

export const unfavoriteTradDevo = async (devo: TTradDevo) => {
  if (!auth.currentUser || auth.currentUser.isAnonymous) {
    throw new Error("You must be logged in to do that.");
  }

  const userRef = doc(db, "users", auth.currentUser.uid);
  const devoRef = doc(db, "devotionals", devo.id);

  // Handle users/favorites subcollection
  // If the user has not favorited the devo, do nothing
  const favoritesQuery = query(
    collection(userRef, "favorites"),
    where("type", "==", "tradDevo"),
    where("docId", "==", devo.id)
  );
  const favoritesQuerySnapshot = await getDocs(favoritesQuery);
  // Get document ID of favorite
  if (favoritesQuerySnapshot.docs.length === 0) {
    console.warn("User has not favorited this devo");
  } else {
    const favoriteDocId = favoritesQuerySnapshot.docs[0].id;
    const favoriteRef = await getDoc(doc(userRef, "favorites", favoriteDocId));
    await deleteDoc(favoriteRef.ref);
  }

  // Handle devotional.favoritedBy field
  // If the devo has not been favorited by the user, do nothing
  const devoDoc = await getDoc(doc(db, "devotionals", devo.id));
  const devoFavoritedBy = devoDoc.data()?.favoritedBy;
  if (
    !devoFavoritedBy?.some((userId: string) => userId === auth.currentUser?.uid)
  ) {
    console.warn("Devo has not been favorited by user");
  } else {
    // Remove user from devo's favoritedBy
    await updateDoc(devoRef, {
      favoritedBy: arrayRemove(auth.currentUser.uid),
    });
  }
};

export const favoritePersonalDevo = async (
  devo: TPersonalDevo
): Promise<void> => {
  if (!auth.currentUser || auth.currentUser.isAnonymous) {
    throw new Error("You must be logged in to do that.");
  }

  const userRef = doc(db, "users", auth.currentUser.uid);
  const devoRef = doc(userRef, "prompts", devo.id);

  // Handle the users/favorites subcollection
  // If the user has already favorited the devo, do nothing
  const favoritesQuery = query(
    collection(userRef, "favorites"),
    where("type", "==", "personalDevo"),
    where("docId", "==", devo.id)
  );
  const favoritesQuerySnapshot = await getDocs(favoritesQuery);
  if (favoritesQuerySnapshot.docs.length > 0) {
    console.warn("User has already favorited this personal devo");
  } else {
    await addDoc(collection(userRef, "favorites"), {
      type: "personalDevo",
      docId: devoRef.id,
      docData: devo,
      createdAt: new Date(),
    });
  }

  // Handle the prompts.favorited field
  // If the devo has already been favorited by the user, do nothing
  const devoDoc = await getDoc(devoRef);
  const devoFavorited = devoDoc.data()?.favorited;
  if (devoFavorited) {
    console.warn("Devo has already been favorited by user");
  } else {
    // Update favorited to true
    await updateDoc(devoRef, {
      favorited: true,
    });
  }
};

export const unfavoritePersonalDevo = async (devo: TPersonalDevo) => {
  if (!auth.currentUser || auth.currentUser.isAnonymous) {
    throw new Error("You must be logged in to do that.");
  }

  const userRef = doc(db, "users", auth.currentUser.uid);
  const devoRef = doc(userRef, "prompts", devo.id);

  // Handle users/favorites subcollection
  // If the user has not favorited the devo, do nothing
  const favoritesQuery = query(
    collection(userRef, "favorites"),
    where("type", "==", "personalDevo"),
    where("docId", "==", devo.id)
  );
  const favoritesQuerySnapshot = await getDocs(favoritesQuery);
  // Get document ID of favorite
  if (favoritesQuerySnapshot.docs.length === 0) {
    console.warn("User has not favorited this devo");
  } else {
    const favoriteDocId = favoritesQuerySnapshot.docs[0].id;
    const favoriteRef = await getDoc(doc(userRef, "favorites", favoriteDocId));
    await deleteDoc(favoriteRef.ref);
  }

  // Handle prompts.favorited field
  // If the devo has not been favorited by the user, do nothing
  const devoDoc = await getDoc(devoRef);
  const devoFavorited = devoDoc.data()?.favorited;
  if (!devoFavorited) {
    console.warn("Devo has not been favorited by user");
  } else {
    // Remove user from devo's favoritedBy
    await updateDoc(devoRef, {
      favorited: false,
    });
  }
};

export const favoriteVerse = async (
  bible: string,
  book: string,
  chapter: number,
  verseNumber: number,
  verse: string
): Promise<void> => {
  if (!auth.currentUser || auth.currentUser.isAnonymous) {
    throw new Error("You must be logged in to do that.");
  }

  const userRef = doc(db, "users", auth.currentUser.uid);

  // Handle the users/favorites subcollection
  // If the user has already favorited the verse, do nothing
  const favoritesQuery = query(
    collection(userRef, "favorites"),
    where("type", "==", "verse"),
    where("docData.bible", "==", bible),
    where("docData.book", "==", book),
    where("docData.chapter", "==", chapter),
    where("docData.verseNumber", "==", verseNumber)
  );
  const favoritesQuerySnapshot = await getDocs(favoritesQuery);
  if (favoritesQuerySnapshot.docs.length > 0) {
    console.warn("User has already favorited this verse");
  } else {
    await addDoc(collection(userRef, "favorites"), {
      type: "verse",
      docData: {
        bible,
        book,
        chapter,
        verseNumber,
        verse,
      },
      createdAt: new Date(),
    });
  }
};

export const unfavoriteVerse = async (
  bible: string,
  book: string,
  chapter: number,
  verseNumber: number
): Promise<void> => {
  if (!auth.currentUser || auth.currentUser.isAnonymous) {
    throw new Error("You must be logged in to do that.");
  }

  const userRef = doc(db, "users", auth.currentUser.uid);

  // Handle users/favorites subcollection
  // If the user has not favorited the verse, do nothing
  const favoritesQuery = query(
    collection(userRef, "favorites"),
    where("type", "==", "verse"),
    where("docData.bible", "==", bible),
    where("docData.book", "==", book),
    where("docData.chapter", "==", chapter),
    where("docData.verseNumber", "==", verseNumber)
  );
  const favoritesQuerySnapshot = await getDocs(favoritesQuery);
  // Get document ID of favorite
  if (favoritesQuerySnapshot.docs.length === 0) {
    console.warn("User has not favorited this verse");
  } else {
    const favoriteDocId = favoritesQuerySnapshot.docs[0].id;
    const favoriteRef = await getDoc(doc(userRef, "favorites", favoriteDocId));
    await deleteDoc(favoriteRef.ref);
  }
};

export const favoriteExegesis = async (exegesis: TExegesis): Promise<void> => {
  if (!auth.currentUser || auth.currentUser.isAnonymous) {
    throw new Error("You must be logged in to do that.");
  }

  const userRef = doc(db, "users", auth.currentUser.uid);
  const exegesisRef = doc(userRef, "exegeses", exegesis.id);

  // Handle the users/favorites subcollection
  // If the user has already favorited the exegesis, do nothing
  const favoritesQuery = query(
    collection(userRef, "favorites"),
    where("type", "==", "exegesis"),
    where("docId", "==", exegesis.id)
  );
  const favoritesQuerySnapshot = await getDocs(favoritesQuery);
  if (favoritesQuerySnapshot.docs.length > 0) {
    console.warn("User has already favorited this exegesis");
  } else {
    await addDoc(collection(userRef, "favorites"), {
      type: "exegesis",
      docId: exegesisRef.id,
      docData: exegesis,
      createdAt: new Date(),
    });
  }

  // Handle the exegesis.favorited field
  // If the exegesis has already been favorited by the user, do nothing
  const exegesisDoc = await getDoc(exegesisRef);
  const exegesisFavorited = exegesisDoc.data()?.favorited;
  if (exegesisFavorited) {
    console.warn("Exegesis has already been favorited by user");
  } else {
    // Update favorited to true
    await updateDoc(exegesisRef, {
      favorited: true,
    });
  }
};

export const unfavoriteExegesis = async (exegesis: TExegesis) => {
  if (!auth.currentUser || auth.currentUser.isAnonymous) {
    throw new Error("You must be logged in to do that.");
  }

  const userRef = doc(db, "users", auth.currentUser.uid);
  const exegesisRef = doc(userRef, "exegeses", exegesis.id);

  // Handle users/favorites subcollection
  // If the user has not favorited the exegesis, do nothing
  const favoritesQuery = query(
    collection(userRef, "favorites"),
    where("type", "==", "exegesis"),
    where("docId", "==", exegesis.id)
  );
  const favoritesQuerySnapshot = await getDocs(favoritesQuery);
  // Get document ID of favorite
  if (favoritesQuerySnapshot.docs.length === 0) {
    console.warn("User has not favorited this exegesis");
  } else {
    const favoriteDocId = favoritesQuerySnapshot.docs[0].id;
    const favoriteRef = await getDoc(doc(userRef, "favorites", favoriteDocId));
    await deleteDoc(favoriteRef.ref);
  }

  // Handle prompts.favorited field
  // If the exegesis has not been favorited by the user, do nothing
  const exegesisDoc = await getDoc(exegesisRef);
  const exegesisFavorited = exegesisDoc.data()?.favorited;
  if (!exegesisFavorited) {
    console.warn("Devo has not been favorited by user");
  } else {
    // Remove user from exegesis's favoritedBy
    await updateDoc(exegesisRef, {
      favorited: false,
    });
  }
};
