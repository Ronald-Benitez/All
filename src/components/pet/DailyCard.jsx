import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import moment from "moment/moment";
import { Link } from "expo-router";

import db from "@/src/db/daysTable.js";
import { getPet } from "@/src/helpers/files";
import useStyle from "@/src/zustand/useStyle";
import getStyles from "@/src/styles/styles";

export default function DayCard() {
  const today = moment().format("YYYY/MM/DD");
  const [petData, setPetData] = useState({});
  const [source, setSource] = useState(null);
  const [pet, setPet] = useState({});

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


  useEffect(() => {
    handleReload();
  }, []);

  const handleReload = () => {
    getPet().then((data) => {
      setPet(data);
      setPetData(data.askExpected);
      db.getItem(today)
        .then((dayData) => {
          handleDay(dayData, data);
        })
        .catch((err) => {
          handleDay({ expected: "", real: "", difference: "" }, data);
        });
    });
  };

  const handleDay = async (day, data) => {
    if (day?.expected === "") {
      setPetData(data.askExpected);
      return;
    }

    if (day?.real === "") {
      setPetData(data.askReal);
      return;
    }

    if (
      day?.difference === "" ||
      day?.difference === "0" ||
      day?.difference === "0.0"
    ) {
      setPetData(data.askDiff);
      return;
    }

    if (day?.difference === "1") {
      setPetData(data.equalDay);
      return;
    }

    if (day?.difference === "2") {
      setPetData(data.betterDay);
      return;
    }

    if (day?.difference === "3") {
      setPetData(data.worseDay);
      return;
    }
  };

  useEffect(() => {
    if (!petData) return;
    if (petData.img) {
      switch (petData.img) {
        case "default":
          setSource((prevSource) => require(`src/images/pet/default.jpg`));
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
    setPetData(pet.petted);

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
      {!petData ? (
        <View style={styles.container}>
          <Text style={styles.petMessageText}>Loading...</Text>
        </View>
      ) : (
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
            <Text style={styles.petMessageText}>
              {petData.message &&
                petData.message[
                  Math.floor(Math.random() * petData.message.length)
                ]}
            </Text>
          </Link>
          <TouchableOpacity onPress={handlePetting}>
            {source && <Image style={styles.petImage} source={source} />}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
