import { createStackNavigator } from "@react-navigation/stack";
import BibleReaderScreen from "@src/screens/BibleReaderScreen";
import DevoNavigator from "@src/screens/DevoNavigator";
import { PastDevotionals } from "@src/screens/PastDevotionals";
import VerseAnalysisScreen from "@src/screens/VerseAnalysisScreen";
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
          shadowColor: "#d0d0d0",
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
      <Stack.Screen name="Exegesis" component={VerseAnalysisScreen} />
      <Stack.Screen name="Reader" component={BibleReaderScreen} />
    </Stack.Navigator>
  );
};

export default BaseNavigator;
