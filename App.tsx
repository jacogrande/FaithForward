import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BaseScreen from "./src/screens/BaseScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import colors from "./src/styles/colors";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Zeal"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.paper,
          },
        }}
      >
        <Stack.Screen
          name="Zeal"
          component={HomeScreen}
          options={{
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Sign Up"
          options={{
            header: () => null,
          }}
        >
          {(props) => <SignUpScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
