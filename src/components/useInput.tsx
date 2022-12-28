import React, { useRef, useState } from "react";
import { Keyboard, TextInput, StyleSheet } from "react-native";

const useInput = (
  placeholder: string,
  config?: {
    type?: string;
    align?: "left" | "center";
    multiline?: boolean;
    setLinkedValue?: (e: string) => void;
  }
): [JSX.Element, string, React.Dispatch<React.SetStateAction<string>>] => {
  const [value, setValue] = useState("");
  const inputRef = useRef<TextInput>(null);

  React.useEffect(() => {
    if (config && config.setLinkedValue) {
      config.setLinkedValue(value);
    }
  }, [config?.setLinkedValue, value]);

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
    backgroundColor: "rgba(0, 0, 0, 0.07)",
    borderRadius: 4,
    margin: 10,
    padding: 12,
    paddingTop: 12,
    paddingBottom: 12,
    width: "80%",
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
});

export default useInput;
