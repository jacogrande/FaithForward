import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { PersonalizedDevotional } from "@src/components/PersonalizedDevotional";
import { TraditionalDevotionals } from "@src/components/TraditionalDevotionals";
import colors from "@src/styles/colors";
import * as React from "react";

const Tab = createMaterialTopTabNavigator();

export default function DevoNavigator() {
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
      <Tab.Screen name="Daily" component={TraditionalDevotionals} />
      <Tab.Screen name="For You" component={PersonalizedDevotional} />
    </Tab.Navigator>
  );
}
