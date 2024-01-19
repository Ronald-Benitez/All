import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import useStyle from "@/src/zustand/useStyle";
import DataBlock from "@/src/components/giveaways/DataBlock";
import ManageDataBlock from "../../src/components/giveaways/ManageDataBlock";

const Giveaways = () => {
  const [participants, setParticipants] = useState([]);
  const [awards, setAwards] = useState([]);
  const [participant, setParticipant] = useState("");
  const [award, setAward] = useState("");
  const [winners, setWinners] = useState([]);
  const styles = useStyle((state) => state.style);
  const { t } = useTranslation();

  const handleAddParticipant = () => {
    if (participant === "") return;

    if (participants.find((p) => p.name === participant)) {
      Alert.alert(t("giveaways-feature.p-already"));
      return;
    }

    setParticipants([
      ...participants,
      {
        name: participant,
        color: "black",
        bg: "white",
      },
    ]);
    setParticipant("");
  };

  const handleAddAward = () => {
    if (award === "") return;
    if (awards.find((a) => a.name === award)) {
      Alert.alert(t("giveaways-feature.a-already"));
      return;
    }
    setAwards([
      ...awards,
      {
        name: award,
        color: "black",
        bg: "white",
      },
    ]);
    setAward("");
  };

  const handleRemoveParticipant = () => {
    if (participant === "") return;
    setParticipants(participants.filter((p) => p.name !== participant));
  };

  const handleRemoveAward = () => {
    if (award === "") return;
    setAwards(awards.filter((p) => p.name !== award));
  };

  const handlePickWinner = () => {
    if (participants.length <= 0) return;
    const p = [...participants];
    const a = [...awards];
    const winnersQuantity = awards.length > participants.length ? participants.length : awards.length > 0 ? awards.length : 1;
    const winnersWithAwards = [];

    for (let i = 0; i < winnersQuantity; i++) {
      const winner = p[Math.floor(Math.random() * p.length)];
      const award = a[Math.floor(Math.random() * a.length)];
      winnersWithAwards.push({
        winner: winner.name,
        award: award?.name || "",
      });
      p.splice(p.indexOf(winner), 1);
      a.splice(a.indexOf(award), 1);
    }

    setWinners(winnersWithAwards);
  }

  const handleClear = () => {
    setParticipants([]);
    setAwards([]);
    setParticipant("");
    setAward("");
    setWinners([]);
  };


  return (
    <View>
      <View style={[styles.container, {
        marginTop: 10,
      }]}>
        <ManageDataBlock
          value={participant}
          onChange={setParticipant}
          handleDelete={handleRemoveParticipant}
          handleAdd={handleAddParticipant}
          label={t("giveaways-feature.participant")}
        />
        <ManageDataBlock
          value={award}
          onChange={setAward}
          handleDelete={handleRemoveAward}
          handleAdd={handleAddAward}
          label={t("giveaways-feature.award")}
        />

        <ScrollView style={{ height: "65%", width: "100%" }}>
          <DataBlock data={participants} label={t("giveaways-feature.participants")} >
            {(item) => <Text style={styles.sideLabel} onPress={() => setParticipant(item.name)} >{item.name}</Text>}
          </DataBlock>

          <DataBlock data={awards} label={t("giveaways-feature.awards")} >
            {(item) => <Text style={styles.sideLabel} onPress={() => setAward(item.name)} >{item.name}</Text>}
          </DataBlock>

          <DataBlock data={winners} label={t("giveaways-feature.winners")} >
            {(item) => (
              <View style={styles.row}>
                <Text style={styles.sideLabel}>{item.winner}</Text>
                {
                  item.award !== "" && <Text style={styles.sideLabel}>{item.award}</Text>
                }
              </View>
            )}
          </DataBlock>
        </ScrollView>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePickWinner()}
          >
            <MaterialCommunityIcons
              name="play-outline"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleClear()}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Giveaways;
