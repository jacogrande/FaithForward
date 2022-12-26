import React, { useRef, useState } from "react";
import { Keyboard, TextInput, StyleSheet } from "react-native";
import colors from "../styles/colors";

const useInput = (
  placeholder: string,
  config?: { type?: string; align?: "left" | "center" }
): [JSX.Element, string, React.Dispatch<React.SetStateAction<string>>] => {
  const [value, setValue] = useState("");
  const inputRef = useRef<TextInput>(null);

  const handleBlur = () => {
    Keyboard.dismiss();
  };
  const component = (
    <TextInput
      ref={inputRef}
      style={[
        styles.input,
        { textAlign: config && config.align ? config.align : "left" },
      ]}
      placeholder={placeholder}
      placeholderTextColor="#bbb"
      onChangeText={(text) => setValue(text)}
      value={value}
      onBlur={handleBlur}
      secureTextEntry={config && config.type === "password" ? true : false}
    />
  );
  return [component, value, setValue];
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    backgroundColor: colors.lightPaper,
    borderRadius: 4,
    margin: 10,
    padding: 10,
    width: "80%",
  },
});

export default useInput;
