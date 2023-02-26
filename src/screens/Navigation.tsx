import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeNavigator from "@src/screens/HomeNavigator";
import ProfileNavigator from "@src/screens/ProfileNavigator";
import SermonsScreen from "@src/screens/SermonsScreen";
import colors from "@src/styles/colors";
import * as React from "react";

const Tab = createBottomTabNavigator();

const BaseNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.paper,
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
        name="Devos"
        component={HomeNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-sunny" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Sermons"
        component={SermonsScreen}
        options={{
          headerTitleStyle: {
            color: colors.black,
            fontWeight: "600",
            fontSize: 18,
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="book-reader" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
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
