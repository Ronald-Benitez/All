import { Text } from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";
import getStyles from "@/src/styles/styles";

const Cards = ({ title, route, icon, prop }) => {
  const [styles, setStyles] = useState({});
  useEffect(() => {
    getStyles().then((data) => {
      setStyles(data);
    });
  }, []);

  return (
    <Link
      style={[styles.buttonBordered]}
      href={{
        pathname: route,
        params: prop,
      }}
    >
      {icon()}
      <Text style={[styles.cardText]}>{"   " + title}</Text>
    </Link>
  );
};

export default Cards;
