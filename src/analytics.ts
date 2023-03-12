import { createClient } from "@segment/analytics-react-native";

const analytics = createClient({
  writeKey: "Pu7wg6OGDGP2qeFdEglRDtdxkbnzRvvK",
  trackAppLifecycleEvents: true,
  //additional config options
});

const createLogger = <T>(method: T) => {
  if (process.env.NODE_ENV === "production") return method;
  else return (...args: any) => {};
};

export const logScreenView = createLogger((screenName: string) => {
  try {
    analytics.screen(screenName);
  } catch (err) {
    console.error(err);
  }
});

export const logViewDevotional = createLogger(
  (devotionalID: string, devotionalName: string) => {
    try {
      analytics.track("View Devotional", {
        devotionalID,
        devotionalName,
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export const logCreateDevotional = createLogger(
  (promptID: string, prompt: string, requestTime: number) => {
    try {
      analytics.track("Create Devotional", {
        prompt,
        requestTime,
        promptID,
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export const logShareDevotional = createLogger(
  (
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
  }
);

export const logShareVerse = createLogger(
  (
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
  }
);

export const logLogin = createLogger((loginMethod: "email") => {
  try {
    analytics.track("Login", {
      loginMethod,
    });
  } catch (err) {
    console.error(err);
  }
});

export const logSignup = createLogger((signUpMethod: "email") => {
  try {
    analytics.track("Signup", {
      signUpMethod,
    });
  } catch (err) {
    console.error(err);
  }
});

export const logFavoriteDevotional = createLogger(
  (devotionalID: string, devotionalName: string) => {
    try {
      analytics.track("Favorite Devotional", {
        devotionalID,
        devotionalName,
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export const logUnfavoriteDevotional = createLogger(
  (devotionalID: string, devotionalName: string) => {
    try {
      analytics.track("Unfavorite Devotional", {
        devotionalID,
        devotionalName,
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export const logUnfavoriteExegesis = createLogger(
  (exegesisId: string, book: string, chapter: number, verseNumber: number) => {
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
);

export const logFavoriteSermon = createLogger(
  (sermonID: string, sermonName: string) => {
    try {
      analytics.track("Favorite Sermon", {
        sermonID,
        sermonName,
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export const logFavoriteVerse = createLogger(
  (book: string, chapter: number, verseNumber: number) => {
    try {
      analytics.track("Favorite Verse", {
        book,
        chapter,
        verseNumber,
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export const logUnfavoriteVerse = createLogger(
  (book: string, chapter: number, verseNumber: number) => {
    try {
      analytics.track("Unfavorite Verse", {
        book,
        chapter,
        verseNumber,
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export const logUnfavoriteSermon = createLogger(
  (sermonID: string, sermonName: string) => {
    try {
      analytics.track("Unfavorite Sermon", {
        sermonID,
        sermonName,
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export const logSermonPlay = createLogger(
  (sermonID: string, sermonName: string) => {
    try {
      analytics.track("Play Sermon", {
        sermonID,
        sermonName,
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export const logSermonPause = createLogger(() => {
  try {
    analytics.track("Pause Sermon");
  } catch (err) {
    console.error(err);
  }
});

export const logViewBibleChapter = createLogger(
  (book: string, chapter: number) => {
    try {
      analytics.track("View Bible Chapter", {
        book,
        chapter,
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export const logGoToChapter = createLogger((chapter: string | null) => {
  try {
    analytics.track("Go To Chapter", {
      chapter,
    });
  } catch (err) {
    console.error(err);
  }
});

export const logGetExegesis = createLogger(
  (book: string, chapter: number, verseNumber: number, type: string) => {
    try {
      analytics.track("Get Exegesis", {
        book,
        chapter,
        verseNumber,
        type,
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export const logShareExegesis = createLogger(
  (
    exegesisId: string,
    book: string,
    chapter: number,
    verseNumber: number,
    type: string,
    shareAction: "sharedAction" | "dismissedAction"
  ) => {
    try {
      analytics.track("Share Exegesis", {
        exegesisId,
        book,
        chapter,
        verseNumber,
        type,
        dismissed: shareAction === "dismissedAction",
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export default analytics;
