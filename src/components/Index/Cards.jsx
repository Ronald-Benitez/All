import { Text } from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";
import getStyles from "@/src/styles/styles";

const Cards = ({ title, route }) => {
  const [styles, setStyles] = useState({});
  useEffect(() => {
    getStyles().then((data) => {
      setStyles(data);
    });
  }, []);

  return (
    <Link style={[styles.card]} href={route}>
      <Text style={styles.title}>{title}</Text>
    </Link>
  );
};

export default Cards;
