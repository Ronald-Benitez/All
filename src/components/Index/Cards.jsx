import { Text } from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";
import useStyle from "@/src/zustand/useStyle";
import getStyles from "@/src/styles/styles";

const Cards = ({ title, route, icon, prop }) => {
  const [styles, setStyles] = useState({});
  const storedStyle = useStyle((state) => state.style);

  useEffect(() => {
    if (storedStyle !== null && storedStyle !== undefined) {
      setStyles(storedStyle);
    } else {
      getStyles().then((data) => {
        setStyles(data);
      });
    }
  }, [storedStyle]);

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
