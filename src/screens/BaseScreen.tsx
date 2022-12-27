import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { Image } from "react-native";
import colors from "../styles/colors";
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator();

// TODO: Use proper icons for Home and Profile nav links
const BaseNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.paper,
          paddingTop: 8,
          paddingBottom: 16,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: (props) => (
            <Image
              source={require("../../assets/avatar.png")}
              style={{ width: 36, height: 36 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BaseNavigator;
