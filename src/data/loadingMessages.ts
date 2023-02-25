// TODO: Consolidate this with constants + utils
export const initialLoadingMessage =
  "Hang on tight. This will only take a minute";

export const loadingMessages = [
  "Herding sheep",
  "Building an ark",
  "Fighting the good fight of faith",
  "Defeating Goliath",
  "Building the Tower of Babel",
  "Searching for manna",
  "Forgiving seventy times seven",
  "Studying the Bible",
  "Finding the lost coin",
  "Praying for the sick",
  "Sowing seed in good soil",
  "Baptizing new believers",
  "Teaching the Word",
  "Washing the disciples' feet",
  "Feeding the five thousand",
  "Singing a hymn of praise to the loading bar",
  "Building a virtual temple",
  "Waiting for the burning bush to speak",
  "Blessing the internet connection",
  "Tuning harps",
  "Fighting the temptation to close the app",
  "Practicing the patience of Job",
  "Climbing the mountain of faith",
  "Walking through the valley of shadows",
  "Planting seeds of hope",
  "Nurturing the fruits of the spirit",
  "Lighting the way with the lamp of faith",
  "Striving for righteousness",
  "Sowing the seeds of love and kindness",
  "Refining gold in the furnace of affliction",
  "Rising on eagle's wings",
  "Holding on to the anchor of hope"
];

export const getRandomMessage = () => {
  const randomIndex = Math.floor(Math.random() * loadingMessages.length);
  return loadingMessages[randomIndex];
};
