import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
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

  onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false);
  });

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size="large" />
      </View>
    );
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
            component={Navigation}
            options={{
              headerLeft: () => null,
            }}
          />
        ) : (
          <Stack.Screen
            name="Sign Up"
            component={AuthScreen}
            options={{
              header: () => null,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
