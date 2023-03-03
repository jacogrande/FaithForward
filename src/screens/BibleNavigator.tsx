import { createStackNavigator } from "@react-navigation/stack";
import ExegesisScreen from "@src/screens/ExegesisScreen";
import { ReaderAndStudyNavigator } from "@src/screens/ReaderAndStudyNavigator";
import colors from "@src/styles/colors";
import * as React from "react";

const Stack = createStackNavigator();

const BaseNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Reader"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.paper,
          shadowColor: "transparent",
        },
      }}
    >
      <Stack.Screen
        name="ReaderAndStudy"
        component={ReaderAndStudyNavigator}
        options={{
          headerTitle: "Bible",
        }}
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
