import { createStackNavigator } from "@react-navigation/stack";
import BibleScreen from "@src/screens/BibleScreen";
import ExegesisScreen from "@src/screens/ExegesisScreen";
import * as React from "react";

const Stack = createStackNavigator();

// TODO: How to properly navigate all of this?
//       - Reader
//       - Table of contents
//       - Exegeses
// Probably have to change the Reader topnav
// Could still have page title be the same
// But need to change prev/next page buttons to ... screen sides?
const BaseNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Reader">
      <Stack.Screen
        name="Reader"
        component={BibleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Exegesis"
        component={ExegesisScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default BaseNavigator;
