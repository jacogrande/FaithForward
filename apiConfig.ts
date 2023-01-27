const prodUrl = "https://us-central1-robo-jesus.cloudfunctions.net";
const stagingUrl =
  "https://us-central1-faith-forward-staging.cloudfunctions.net";

const apiUrl = process.env.NODE_ENV === "production" ? prodUrl : stagingUrl;

export default { apiUrl };
