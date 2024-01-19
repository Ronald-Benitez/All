import React, { useState, useEffect } from "react";
import { View, TouchableOpacity} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import moment from "moment/moment";

import AddRegister from "@/src/components/finances/AddRegister";
import AddRegisterList from "@/src/components/finances/AddRegisterList";
import RegisterCard from "@/src/components/finances/RegisterCard";
import RegistersList from "@/src/components/finances/RegistersList";
import Filter from "@/src/components/ui/Filter";
import useStyle from "@/src/zustand/useStyle";
import GroupSelector from "@/src/components/finances/GroupSelector";

export default function Finances({ savingsFlag = false }) {
  const [register, setRegister] = useState(null);
  const [reload, setReload] = useState(false);
  const [year, setYear] = useState(moment().format("YYYY"));
  const [isCard, setIsCard] = useState(true);
  const [isList, setIsList] = useState(true);
  const [filter, setFilter] = useState([]);
  const styles = useStyle((state) => state.style);

  return (
    <>
      <View style={styles.container}>
        <GroupSelector
          setGroup={setRegister}
          savingsFlag={savingsFlag}
          year={year}
          setYear={setYear}
          reload={reload}
        />
        <View style={styles.row}>
          <AddRegister
            reload={() => setReload(!reload)}
            savingsFlag={savingsFlag}
            baseYear={year}
          >
            <AntDesign name="addfolder" size={20} color="black" />
          </AddRegister>
          {register && (
            <AddRegisterList
              group={register}
              setRegister={setRegister}
              style={styles.button}
              savingsFlag={savingsFlag}
            >
              <AntDesign name="addfile" size={20} color="black" />
            </AddRegisterList>
          )}
          <Filter setFilters={setFilter} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setReload(!reload);
            }}
          >
            <MaterialIcons name="loop" size={18} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <RegisterCard
            reload={() => setReload(!reload)}
            register={register}
            handleReload={() => setReload(!reload)}
            isDown={isCard}
            setIsDown={setIsCard}
            setRegister={setRegister}
            savingsFlag={savingsFlag}
            year={year}
          />
        </View>

        <View style={isCard ? { maxHeight: "35%" } : { maxHeight: "65%" }}>
          <RegistersList
            reload={reload}
            setReload={setReload}
            group={register}
            setGroup={setRegister}
            handleReload={() => setReload(!reload)}
            isDown={isList}
            setIsDown={setIsList}
            filter={filter}
            savingsFlag={savingsFlag}
          />
        </View>
      </View>
    </>
  );
}
