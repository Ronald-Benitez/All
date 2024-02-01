import { Text } from "react-native";
import { Link } from "expo-router";
import { useSelector } from "react-redux";

const Cards = ({ title, route, icon, prop }) => {
  const styles = useSelector((state) => state.styles.styles);

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
