import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { Dimensions } from "react-native";
import colors from "../styles/colors";
import HomeNavigator from "./HomeNavigator";
import ProfileScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator();

const BaseNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.paper,
          height: Dimensions.get("window").height * 0.09,
          paddingBottom: 24,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontWeight: "600",
        },
        tabBarActiveTintColor: colors.blue,
      }}
    >
      <Tab.Screen
        name="Devotionals"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-sunny" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BaseNavigator;
