import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ReaderAndStudyNavigator } from "@src/navigation/ReaderAndStudyNavigator";
import { BibleSearchScreen } from "@src/screens/BibleSearchScreen";
import ExegesisScreen from "@src/screens/ExegesisScreen";
import { PastExegeses } from "@src/screens/PastExegeses";
import colors from "@src/styles/colors";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const Stack = createStackNavigator();

const SearchHeader = () => {
  const navigation = useNavigation<any>();
  const routeName = useRoute().name;
  const isSearchScreen = routeName === "Bible Search";

  return isSearchScreen ? null : (
    <TouchableOpacity
      className="mr-5"
      onPress={() => {
        navigation.navigate("Bible Search");
      }}
    >
      <Ionicons name="search" size={24} color={colors.black} />
    </TouchableOpacity>
  );
};

const BaseNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ReaderAndStudy"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.paper,
          shadowColor: "transparent",
        },
        headerRight: () => <SearchHeader />,
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
        name="Verse Analysis"
        component={ExegesisScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="PastExegeses"
        component={PastExegeses}
        options={{ headerShown: true, headerTitle: "History" }}
      />
      <Stack.Screen
        name="Bible Search"
        component={BibleSearchScreen}
        options={{ headerShown: true, headerTitle: "Search" }}
      />
    </Stack.Navigator>
  );
};

export default BaseNavigator;
