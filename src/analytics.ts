import { createClient } from "@segment/analytics-react-native";

const analytics = createClient({
  writeKey: "Pu7wg6OGDGP2qeFdEglRDtdxkbnzRvvK",
  trackAppLifecycleEvents: true,
  //additional config options
});

const useLogger = <T>(method: T) => {
  if (process.env.NODE_ENV === "production") return method;
  else return (...args: any) => {};
};

export const logScreenView = useLogger((screenName: string) => {
  try {
    analytics.screen(screenName);
  } catch (err) {
    console.error(err);
  }
});

export const logViewDevotional = useLogger(
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

export const logCreateDevotional = useLogger(
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

export const logShareDevotional = useLogger(
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

export const logShareVerse = useLogger(
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

export const logLogin = useLogger((loginMethod: "email") => {
  try {
    analytics.track("Login", {
      loginMethod,
    });
  } catch (err) {
    console.error(err);
  }
});

export const logSignup = useLogger((signUpMethod: "email") => {
  try {
    analytics.track("Signup", {
      signUpMethod,
    });
  } catch (err) {
    console.error(err);
  }
});

export const logFavoriteDevotional = useLogger(
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

export const logUnfavoriteDevotional = useLogger(
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

export const logUnfavoriteExegesis = useLogger(
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

export const logFavoriteSermon = useLogger(
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

export const logFavoriteVerse = useLogger(
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

export const logUnfavoriteVerse = useLogger(
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

export const logUnfavoriteSermon = useLogger(
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

export const logSermonPlay = useLogger(
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

export const logSermonPause = useLogger(() => {
  try {
    analytics.track("Pause Sermon");
  } catch (err) {
    console.error(err);
  }
});

export const logViewBibleChapter = useLogger(
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

export const logGoToChapter = useLogger((chapter: string | null) => {
  try {
    analytics.track("Go To Chapter", {
      chapter,
    });
  } catch (err) {
    console.error(err);
  }
});

export const logGetExegesis = useLogger(
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

export const logShareExegesis = useLogger(
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
