import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as React from "react";
import colors from "../styles/colors";
import { PersonalizedDevotional } from "../components/PersonalizedDevotional";
import { TraditionalDevotionals } from "../components/TraditionalDevotionals";

const Tab = createMaterialTopTabNavigator();

export default function DevoNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: colors.blue,
        },
      }}
    >
      <Tab.Screen name="Traditional" component={TraditionalDevotionals} />
      <Tab.Screen name="Personalized" component={PersonalizedDevotional} />
    </Tab.Navigator>
  );
}
