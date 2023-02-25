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
      initialRouteName="Prompt"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: colors.blue,
        headerStyle: {
          backgroundColor: colors.paper,
          shadowColor: "transparent",
          height: 70,
        },
        headerTitleStyle: {
          color: colors.black,
          fontWeight: "bold",
          fontSize: 18,
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Prompt"
        component={DevoNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Past Devotionals" component={PastDevotionals} />
      <Stack.Screen name="Exegesis" component={VerseAnalysisScreen} />
      <Stack.Screen name="Reader" component={BibleReaderScreen} />
    </Stack.Navigator>
  );
};

export default BaseNavigator;
