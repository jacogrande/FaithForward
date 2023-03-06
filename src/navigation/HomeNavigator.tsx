import { createStackNavigator } from "@react-navigation/stack";
import DevoNavigator from "@src/navigation/DevoNavigator";
import { PastDevotionals } from "@src/screens/PastDevotionals";
import colors from "@src/styles/colors";
import * as React from "react";

const Stack = createStackNavigator();

const BaseNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Devotionals"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: colors.blue,
        headerStyle: {
          backgroundColor: colors.paper,
          shadowColor: "transparent",
        },
        headerTitleStyle: {
          color: colors.black,
          fontWeight: "600",
          fontSize: 18,
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Devotionals" component={DevoNavigator} />
      <Stack.Screen name="Past Devotionals" component={PastDevotionals} />
    </Stack.Navigator>
  );
};

export default BaseNavigator;
