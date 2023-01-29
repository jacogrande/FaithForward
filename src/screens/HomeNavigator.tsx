import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import colors from "../styles/colors";
import BibleReaderScreen from "./BibleReaderScreen";
import HomeScreen from "./HomeScreen";
import VerseAnalysisScreen from "./VerseAnalysisScreen";

const Stack = createStackNavigator();

export const BackButton = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        marginLeft: "10%",
        height: 88,
        width: "100%",
        justifyContent: "flex-end",
        paddingBottom: 8,
      }}
    >
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.blue} />
        <Text
          style={{
            fontWeight: "500",
            color: colors.blue,
            marginLeft: 4,
            fontSize: 16,
          }}
        >
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const BaseNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Prompt">
      <Stack.Screen
        name="Prompt"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Analysis"
        component={VerseAnalysisScreen}
        options={{
          headerTitle: "",
          headerStyle: {
            height: 80,
            backgroundColor: colors.paper,
            shadowColor: "transparent",
          },
          headerLeft: BackButton,
        }}
      />
      <Stack.Screen
        name="Reader"
        component={BibleReaderScreen}
        options={{
          headerTitle: "",
          headerStyle: {
            height: 80,
            backgroundColor: colors.paper,
            shadowColor: "transparent",
          },
          headerLeft: BackButton,
        }}
      />
    </Stack.Navigator>
  );
};

export default BaseNavigator;
