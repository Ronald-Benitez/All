import { Text } from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";
import getStyles from "@/src/styles/styles";
import { View } from "@/components/Themed";

const Cards = ({ title, route, icon }) => {
  const [styles, setStyles] = useState({});
  useEffect(() => {
    getStyles().then((data) => {
      setStyles(data);
    });
  }, []);

  return (
    <Link style={[styles.buttonBordered]} href={route}>
      {icon()}
      <View
        style={[
          styles.row,
          {
            backgroundColor: "transparent",
          },
        ]}
      >
        <Text style={[styles.cardText]}>{title}</Text>
      </View>
    </Link>
  );
};

export default Cards;
