import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen";
import { onAuthStateChanged } from "firebase/auth";
import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { auth } from "./firebase";
import BaseScreen from "./src/screens/BaseScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import colors from "./src/styles/colors";

const Stack = createStackNavigator();
export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false);
  });

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Sign Up"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.paper,
          },
          header: () => null,
        }}
      >
        {user ? (
          <Stack.Screen
            name="Faith Forward"
            component={BaseScreen}
            options={{
              headerLeft: () => null,
            }}
          />
        ) : (
          <Stack.Screen
            name="Sign Up"
            component={SignUpScreen}
            options={{
              header: () => null,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
