import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as React from "react";
import FavoritesScreen from "./FavoritesScreen";
import ProfileScreen from "./ProfileScreen";

const Tab = createMaterialTopTabNavigator();

export default function ProfileNavigator() {
  return (
    <Tab.Navigator initialRouteName="Prompt">
      <Tab.Screen name="Account" component={ProfileScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}
