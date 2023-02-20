import * as StoreReview from "expo-store-review";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { ensureDate } from "../utils";

type Signature = {
  requestReview: () => void;
};

export const useRequestReview = (): Signature => {
  const requestReview = async () => {
    if (await StoreReview.hasAction()) {
      if (!auth.currentUser) {
        console.warn("No user is signed in.");
        return;
      }

      // Get current user's user doc
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        console.warn("User doc does not exist.");
        return;
      }
      const user = userDoc.data();
      if (!user) {
        console.warn("User doc is empty.");
        return;
      }

      // Check lastReviewRequestCheck in user doc
      const lastReviewRequestCheck = user.lastReviewRequestCheck;
      if (lastReviewRequestCheck) {
        const lastReviewRequestCheckDate = ensureDate(lastReviewRequestCheck);
        const now = new Date();
        const diff = now.getTime() - lastReviewRequestCheckDate.getTime();
        const diffDays = Math.floor(diff / (1000 * 3600 * 24));
        if (diffDays < 1) {
          console.log(
            "User has already been checked for review request today."
          );
          return;
        }
      }

      // Increment reviewRequestCheckCount in user doc and update lastReviewRequestCheck
      const reviewRequestCheckCount = user.reviewRequestCheckCount || 0;
      await setDoc(
        userRef,
        {
          lastReviewRequestCheck: new Date(),
          reviewRequestCheckCount: reviewRequestCheckCount + 1,
        },
        { merge: true }
      );

      // Check if this is at least the third time the user has triggered a review request check
      if (reviewRequestCheckCount < 2) {
        console.log(
          "This is not at least the third time the user has triggered a review request check."
        );
        return;
      }

      // Check if user has already been asked to review in the last 30 days
      if (await hasBeenRequestedInLast30Days(user)) {
        return;
      }

      StoreReview.requestReview();

      // Update lastReviewRequest in user doc
      await setDoc(userRef, { lastReviewRequest: new Date() }, { merge: true });
    }
  };

  return { requestReview };
};

const hasBeenRequestedInLast30Days = async (user: any): Promise<boolean> => {
  // Check if user has already been asked to review in the last 30 days
  const lastReviewRequest = user.lastReviewRequest;
  if (lastReviewRequest) {
    const lastReviewRequestDate = ensureDate(lastReviewRequest);
    const now = new Date();
    const diff = now.getTime() - lastReviewRequestDate.getTime();
    const diffDays = Math.floor(diff / (1000 * 3600 * 24));
    if (diffDays < 30) {
      console.log("User has already been asked to review in the last 30 days.");
      return true;
    }
  }
  return false;
};
