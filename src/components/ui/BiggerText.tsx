import React from "react";
import { Text, TextProps } from "react-native";

type BiggerTextProps = TextProps & {
  children: React.ReactNode;
};

const BiggerText: React.FC<BiggerTextProps> = ({ children, ...rest }) => {
  return (
    <Text className="text-ffBlack font-bold text-[28px]" {...rest}>
      {children}
    </Text>
  );
};

export default BiggerText;
