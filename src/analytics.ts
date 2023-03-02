import { createClient } from "@segment/analytics-react-native";

const analytics = createClient({
  writeKey: "Pu7wg6OGDGP2qeFdEglRDtdxkbnzRvvK",
  trackAppLifecycleEvents: true,
  //additional config options
});

export const logViewDevotional = (
  devotionalID: string,
  devotionalName: string
) => {
  try {
    analytics.track("View Devotional", {
      devotionalID,
      devotionalName,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logCreateDevotional = (
  promptID: string,
  prompt: string,
  requestTime: number
) => {
  try {
    analytics.track("Create Devotional", {
      prompt,
      requestTime,
      promptID,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logShareDevotional = (
  devotionalID: string,
  devotionalName: string,
  shareAction: "sharedAction" | "dismissedAction"
) => {
  try {
    console.log(devotionalID, devotionalName, shareAction);
    analytics.track("Share Devotional", {
      devotionalID,
      devotionalName,
      dismissed: shareAction === "dismissedAction",
    });
  } catch (err) {
    console.error(err);
  }
};

export const logShareVerse = (
  book: string,
  chapter: number,
  verseNumber: number,
  shareAction: "sharedAction" | "dismissedAction"
) => {
  try {
    analytics.track("Share Verse", {
      book,
      chapter,
      verseNumber,
      dismissed: shareAction === "dismissedAction",
    });
  } catch (err) {
    console.error(err);
  }
};

export const logLogin = (loginMethod: "email") => {
  try {
    analytics.track("Login", {
      loginMethod,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logSignup = (signUpMethod: "email") => {
  try {
    analytics.track("Signup", {
      signUpMethod,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logFavoriteDevotional = (
  devotionalID: string,
  devotionalName: string
) => {
  try {
    analytics.track("Favorite Devotional", {
      devotionalID,
      devotionalName,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logUnfavoriteDevotional = (
  devotionalID: string,
  devotionalName: string
) => {
  try {
    analytics.track("Unfavorite Devotional", {
      devotionalID,
      devotionalName,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logUnfavoriteExegesis = (
  exegesisId: string,
  book: string,
  chapter: number,
  verseNumber: number
) => {
  try {
    analytics.track("Unfavorite Exegesis", {
      exegesisId,
      book,
      chapter,
      verseNumber,
    });
  } catch (err) {
    console.error(err);
  }
}

export const logFavoriteSermon = (sermonID: string, sermonName: string) => {
  try {
    analytics.track("Favorite Sermon", {
      sermonID,
      sermonName,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logFavoriteVerse = (
  book: string,
  chapter: number,
  verseNumber: number
) => {
  try {
    analytics.track("Favorite Verse", {
      book,
      chapter,
      verseNumber,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logUnfavoriteVerse = (
  book: string,
  chapter: number,
  verseNumber: number
) => {
  try {
    analytics.track("Unfavorite Verse", {
      book,
      chapter,
      verseNumber,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logUnfavoriteSermon = (sermonID: string, sermonName: string) => {
  try {
    analytics.track("Unfavorite Sermon", {
      sermonID,
      sermonName,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logSermonPlay = (sermonID: string, sermonName: string) => {
  try {
    analytics.track("Play Sermon", {
      sermonID,
      sermonName,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logSermonPause = () => {
  try {
    analytics.track("Pause Sermon");
  } catch (err) {
    console.error(err);
  }
};

export const logViewBibleChapter = (book: string, chapter: number) => {
  try {
    analytics.track("View Bible Chapter", {
      book,
      chapter,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logGoToChapter = (chapter: string | null) => {
  try {
    analytics.track("Go To Chapter", {
      chapter,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logGetExegesis = (
  book: string,
  chapter: number,
  verseNumber: number
) => {
  try {
    analytics.track("Get Exegesis", {
      book,
      chapter,
      verseNumber,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logShareExegesis = (
  exegesisId: string,
  book: string,
  chapter: number,
  verseNumber: number,
  shareAction: "sharedAction" | "dismissedAction"
) => {
  try {
    analytics.track("Share Exegesis", {
      exegesisId,
      book,
      chapter,
      verseNumber,
      dismissed: shareAction === "dismissedAction",
    });
  } catch (err) {
    console.error(err);
  }
}

export default analytics;
