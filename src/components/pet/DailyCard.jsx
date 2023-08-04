import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import moment from "moment/moment";
import { Link } from "expo-router";

import getStyles from "@/src/styles/styles";
import db from "@/src/db/daysTable.js";
import pet from "@/src/files/pet.json";

export default function DayCard() {
  const [styles, setStyles] = useState({});
  const [today, setToday] = useState(moment().format("YYYY/MM/DD"));
  const [petData, setPetData] = useState({});
  const [source, setSource] = useState(null);

  useEffect(() => {
    setPetData(pet.default);
    getStyles().then((data) => {
      setStyles(data);
    });
    handleReload();
  }, []);

  const handleReload = () => {
    db.getItem(today).then((data) => {
      handleDay(data);
    });
  };

  const handleDay = async (day) => {
    if (!day || day.expected === "") {
      setPetData(pet.askExpected);
      return;
    }

    if (day.real === "") {
      setPetData(pet.askReal);
      return;
    }

    if (day.difference === "" || day.difference === "0") {
      setPetData(pet.askDiff);
      return;
    }

    if (day.difference === "1") {
      setPetData(pet.equalDay);
      return;
    }

    if (day.difference === "2") {
      setPetData(pet.betterDay);
      return;
    }

    if (day.difference === "3") {
      setPetData(pet.worseDay);
      return;
    }
  };

  useEffect(() => {
    if (petData.img) {
      switch (petData.img) {
        case "default":
          setSource(require(`src/images/pet/default.jpg`));
          break;
        case "askExpected":
          setSource(require(`src/images/pet/askExpected.jpg`));
          break;
        case "askReal":
          setSource(require(`src/images/pet/askReal.jpg`));
          break;
        case "askDiff":
          setSource(require(`src/images/pet/askDiff.jpg`));
          break;
        case "equalDay":
          setSource(require(`src/images/pet/equalDay.jpg`));
          break;
        case "betterDay":
          setSource(require(`src/images/pet/betterDay.jpg`));
          break;
        case "worseDay":
          setSource(require(`src/images/pet/worseDay.jpg`));
          break;
        default:
          setSource(require(`src/images/pet/default.jpg`));
          break;
      }
    }
  }, [petData]);

  const handlePetting = () => {
    const actual = source;
    setSource(require(`src/images/pet/petting.jpg`));

    setTimeout(() => {
      setSource(require(`src/images/pet/petted.jpg`));
    }, 1000);
    setTimeout(() => {
      setSource(actual);
      handleReload();
    }, 3000);
  };

  return (
    <View>
      {petData && (
        <View style={styles.container}>
          <Link
            href={petData.route || ""}
            style={[
              styles.block,
              {
                maxWidth: "90%",
              },
            ]}
          >
            <Text style={styles.petMessageText}>{petData.message}</Text>
          </Link>
          <TouchableOpacity onPress={handlePetting}>
            {source && <Image style={styles.petImage} source={source} />}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
