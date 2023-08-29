import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useStyle from "@/src/zustand/useStyle";

const Giveaways = () => {
  const [participants, setParticipants] = useState([]);
  const [awards, setAwards] = useState(1);
  const [participant, setParticipant] = useState("");
  const styles = useStyle((state) => state.style);

  const handleAddParticipant = () => {
    if (participant === "") return;

    if (participants.find((p) => p.name === participant)) {
      Alert.alert("Participant already added");
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

  const handleRemoveParticipant = () => {
    if (participant === "") return;
    setParticipants(participants.filter((p) => p.name !== participant));
  };

  const handlePickWinner = () => {
    if (participants.length === 0) return;
    const waitTime = 2000 / participants.length;

    participants.forEach((participant, index) => {
      setTimeout(() => {
        //get previous participants and set their color to white
        resetWhite();
        participant.bg = "#5c045c";
        participant.color = "white";

        setParticipants([...participants]);
      }, (index + 1) * waitTime); // Delay the color change for each participant
    });

    setTimeout(() => {
      resetWhite();
      const randomWinners = [];
      const participantPool = [...participants];
      for (let i = 0; i < awards; i++) {
        const winner =
          participantPool[Math.floor(Math.random() * participantPool.length)];
        participantPool.splice(participantPool.indexOf(winner), 1);
        randomWinners.push(winner);
      }
      setColorWinners(randomWinners);
    }, 2500); // Delay the picking of winners
  };

  const handleClear = () => {
    setParticipants([]);
    setAwards(1);
    setParticipant("");
  };

  const resetWhite = () => {
    setParticipants(
      participants.map((p) => {
        if (p.bg === "#5c045c") {
          p.color = "black";
          p.bg = "white";
        }
        return p;
      })
    );
  };

  const setColorWinners = (winners) => {
    setParticipants(
      participants.map((p) => {
        if (winners.includes(p)) {
          p.color = "black";
          p.bg = "#f3e7e7";
        }
        return p;
      })
    );
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            onChangeText={setParticipant}
            value={participant}
            placeholder="Participant"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAddParticipant()}
          >
            <MaterialCommunityIcons
              name="playlist-plus"
              size={18}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleRemoveParticipant()}
          >
            <MaterialCommunityIcons
              name="playlist-remove"
              size={18}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Text style={styles.sideLabel}>Awards</Text>
          <TextInput
            style={styles.input}
            onChangeText={setAwards}
            value={String(awards)}
            placeholder="Awards"
            keyboardType="numeric"
          />
        </View>
        <ScrollView style={{ height: "70%", width:"100%" }}>
          <View style={styles.container}>
            {participants?.map((participant, index) => (
              <Text
                style={[
                  styles.block,
                  { backgroundColor: participant.bg, color: participant.color, textAlign:"center" },
                ]}
                key={"p" + index}
              >
                {participant.name}
              </Text>
            ))}
          </View>
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
