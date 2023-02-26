import { createClient } from "@segment/analytics-react-native";

const analytics = createClient({
  writeKey: process.env.SEGMENT_WRITE_KEY || "",
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
  devotionalName: string,
  isFavorite: boolean = true
) => {
  try {
    if (isFavorite) {
      analytics.track("Favorite Devotional", {
        devotionalID,
        devotionalName,
      });
    } else {
      analytics.track("Unfavorite Devotional", {
        devotionalID,
        devotionalName,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export const logFavoriteSermon = (
  sermonID: string,
  sermonName: string,
  isFavorite: boolean = true
) => {
  try {
    if (isFavorite) {
      analytics.track("Favorite Sermon", {
        sermonID,
        sermonName,
      });
    } else {
      analytics.track("Unfavorite Sermon", {
        sermonID,
        sermonName,
      });
    }
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

export const logGoToChapter = (chapter: string | null) => {
  try {
    analytics.track("Go To Chapter", {
      chapter,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logGetExegesis = (chapter: string | null, promptID: string) => {
  try {
    analytics.track("Get Exegesis", {
      chapter,
      promptID,
    });
  } catch (err) {
    console.error(err);
  }
};

export default analytics;
