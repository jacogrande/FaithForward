import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TextProps } from "react-native";

type QuoteProps = TextProps & {
  children: React.ReactNode;
};

const Quote: React.FC<QuoteProps> = ({ children, ...rest }) => {
  return (
    <Text
      style={{
        backgroundColor: "#fff3a8",
        fontWeight: "600",
        fontFamily: "Baskerville",
      }}
      className="text-ffBlack"
      {...rest}
    >
      {children}
    </Text>
  );
};

export default Quote;
