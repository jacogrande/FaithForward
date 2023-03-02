import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FavoritesScreen from "@src/screens/FavoritesScreen";
import ProfileScreen from "@src/screens/ProfileScreen";
import colors from "@src/styles/colors";
import * as React from "react";

const Tab = createMaterialTopTabNavigator();

export default function ProfileNavigator() {
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
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Account" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
