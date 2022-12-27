import React, { useRef, useState } from "react";
import { Keyboard, TextInput, StyleSheet } from "react-native";

const useInput = (
  placeholder: string,
  config?: { type?: string; align?: "left" | "center"; multiline?: boolean }
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
        {
          textAlign: config && config.align ? config.align : "left",
          height: config && config.multiline ? 140 : 40,
        },
      ]}
      placeholder={placeholder}
      placeholderTextColor="#888"
      onChangeText={(text) => setValue(text)}
      value={value}
      onBlur={handleBlur}
      secureTextEntry={config && config.type === "password" ? true : false}
      multiline={config && config.multiline ? true : false}
    />
  );
  return [component, value, setValue];
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    // backgroundColor: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.07)",
    // borderWidth: 1,
    // borderColor: "gray",
    borderRadius: 4,
    margin: 10,
    padding: 12,
    paddingTop: 12,
    paddingBottom: 12,
    width: "80%",
    fontSize: 16,
  },
});

export default useInput;
