import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BibleScreen from "@src/screens/BibleScreen";
import { PastExegeses } from "@src/screens/PastExegeses";
import colors from "@src/styles/colors";
import * as React from "react";

const Tab = createMaterialTopTabNavigator();

export function ReaderAndStudyNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: colors.blue,
        },
        tabBarStyle: {
          backgroundColor: colors.paper,
        },
        tabBarLabelStyle: {
          fontWeight: "500",
        },
        tabBarActiveTintColor: colors.black,
      }}
    >
      <Tab.Screen name="Reader" component={BibleScreen} />
      <Tab.Screen name="Exegeses" component={PastExegeses} />
    </Tab.Navigator>
  );
}
