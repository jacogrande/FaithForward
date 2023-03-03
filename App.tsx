import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import analytics from "@src/analytics";
import { Loading } from "@src/components/Loading";
import { PROJECT_ID } from "@src/constants";
import { auth, syncPushToken } from "@src/firebase";
import { useFavorites } from "@src/hooks/useFavorites";
import { useSermons } from "@src/hooks/useSermons";
import { useTradDevos } from "@src/hooks/useTradDevos";
import AuthScreen from "@src/screens/AuthScreen";
import Navigation from "@src/screens/Navigation";
import useStore from "@src/store";
import colors from "@src/styles/colors";
import * as Device from "expo-device";
import * as Localization from "expo-localization";
import * as Notifications from "expo-notifications";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const registerForPushNotificationsAsync = async () => {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: PROJECT_ID,
      })
    ).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }
  return token;
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loadingAutoSignIn, setLoadingAutoSignIn] = useState(false);
  const [notification, setNotification] = useState<any>(false);
  const [currentRoute, setCurrentRoute] = useState<string>("Unknown");
  const { pushToken, setPushToken } = useStore();
  const notificationListener = useRef();
  const responseListener = useRef();
  const { setQuietlyRefreshing: setQuietlyRefreshingFaves } = useFavorites();
  const { setQuietlyRefreshing: setQuietlyRefreshingTradDevos } =
    useTradDevos();
  const { setQuietlyRefreshing: setQuietlyRefreshingSermons } = useSermons();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setPushToken(token || null)
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

  // Call addPushToken when we have both a user and an pushToken
  useEffect(() => {
    if (user && pushToken) {
      syncPushToken(pushToken, Localization.getCalendars()[0].timeZone);
    }
  }, [user, pushToken]);

  // TODO: Clean this up, not sure why identify analytics runs like a million times per auth change
  onAuthStateChanged(auth, (u) => {
    setUser(u);
    if (u && analytics.userInfo.get().userId !== u.uid) {
      analytics.identify(u.uid);
    }
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
    return <Loading />;
  }

  // Recursively find the current screen name
  const getRouteName = (state: any): string => {
    if (!state || typeof state.index !== "number") {
      return "Unknown";
    }
    const route = state.routes[state.index];
    if (route.state) {
      return getRouteName(route.state);
    }

    return route.name;
  };

  const handleNavigationStateChange = (state: any) => {
    const newRoute = getRouteName(state);
    if (currentRoute !== newRoute) {
      analytics.screen(newRoute);
      setCurrentRoute(newRoute);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer onStateChange={handleNavigationStateChange}>
        <Stack.Navigator
          initialRouteName="Faith Forward"
          screenOptions={{
            headerBackTitleVisible: false,
            headerTintColor: colors.blue,
            headerStyle: {
              backgroundColor: colors.paper,
              shadowColor: "transparent",
              height: 70,
            },
            headerTitleStyle: {
              color: colors.black,
              fontWeight: "bold",
              fontSize: 18,
            },
            headerTitleAlign: "center",
            headerLeftContainerStyle: {
              paddingLeft: 24,
            },
          }}
        >
          <Stack.Screen
            name="Faith Forward"
            component={Navigation}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Sign Up"
            component={AuthScreen}
            options={{ headerTitle: "" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
