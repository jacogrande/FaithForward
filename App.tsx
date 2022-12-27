import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import colors from "./src/styles/colors";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Faith Forward"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.paper,
          },
          header: () => null,
        }}
      >
        <Stack.Screen
          name="Faith Forward"
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
