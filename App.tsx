import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, View, Platform } from "react-native";
import { auth } from "./firebase";
import AuthScreen from "./src/screens/AuthScreen";
import { BackButton } from "./src/screens/HomeNavigator";
import Navigation from "./src/screens/Navigation";
import colors from "./src/styles/colors";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const registerForPushNotificationsAsync = async () => {
  console.log("registerForPushNotificationsAsync");
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    console.log("existingStatus", existingStatus);
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    console.log("getting token...");
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "f0e47dc4-652b-438e-a726-e4db36dec0cb",
      })
    ).data;
    console.log("token:", token);
  } else {
    alert("Must use physical device for Push Notifications");
  }
  return token;
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loadingAutoSignIn, setLoadingAutoSignIn] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<any>("");
  const [notification, setNotification] = useState<any>(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  console.log("App");
  console.log("expoPushToken: ", expoPushToken);
  console.log("notification: ", notification);

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token)
      // TODO: set the token on the user document in Firestore
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      }) as any;

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      }) as any;

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current as any
      );
      Notifications.removeNotificationSubscription(
        responseListener.current as any
      );
    };
  }, []);

  onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false);
  });

  const autoSignIn = async () => {
    try {
      setLoadingAutoSignIn(true);
      const newUser = await signInAnonymously(auth);
      setUser(newUser);
      setLoadingAutoSignIn(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // logic for automatically signing in users anonymously
    if (!loading && !user) {
      autoSignIn();
    }
  }, [loading, user]);

  if (loading || loadingAutoSignIn) {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Faith Forward">
        <Stack.Screen
          name="Faith Forward"
          component={Navigation}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Sign Up"
          component={AuthScreen}
          options={{
            headerTitle: "",
            headerStyle: {
              backgroundColor: colors.paper,
              shadowColor: "transparent",
              height: 0,
            },
            headerLeft: BackButton,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
