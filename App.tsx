import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from "./firebase";
import AuthScreen from "./src/screens/AuthScreen";
import Navigation from "./src/screens/Navigation";
import colors from "./src/styles/colors";

const Stack = createStackNavigator();
export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loadingAutoSignIn, setLoadingAutoSignIn] = useState(false);

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

  React.useEffect(() => {
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
      <Stack.Navigator
        initialRouteName="Faith Forward"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.paper,
          },
          header: () => null,
        }}
      >
        <Stack.Screen
          name="Faith Forward"
          component={Navigation}
          options={{
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Sign Up"
          component={AuthScreen}
          options={{
            header: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
