import React from "react";
import { Text, TextProps } from "react-native";

type BigTextProps = TextProps & {
  children: React.ReactNode;
};

const BigText: React.FC<BigTextProps> = ({ children, ...rest }) => {
  return (
    <Text className="text-lg text-ffBlack font-bold leading-tight" {...rest}>
      {children}
    </Text>
  );
};

export default BigText;
