import { useState, useEffect } from "react";
import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {
  getConfigs,
} from "@/src/helpers/files";

interface Configs {
  headers: {
    index: { value: string };
    days: { value: string };
    finances: { value: string };
    configs: { value: string };
  };
}

export default () => {
  const [configs, setConfigs] = useState<Configs | null>(null);

  useEffect(() => {
    getConfigs().then((data) => {
      setConfigs(data);
    });
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "white",
          borderRadius: 20,
        },
        headerStyle: {
          backgroundColor: "#f3e7e7",
        },

      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "",
          tabBarIcon: () => <AntDesign name="home" size={28} color="black" />,
          headerStyle: {
            backgroundColor: configs?.headers.index.value || "#f3e7e7",
          },  
        }}

      />
        <Tabs.Screen
         name="Days"
         options={{
           title: "Days",
           tabBarLabel: "",
           tabBarIcon: () => <Ionicons name="ios-today-outline" size={24} color="black" />,
           headerStyle: {
            backgroundColor: configs?.headers.days.value || "#f3e7e7",
          },  
          }}
       />
       <Tabs.Screen
        name="Finances"
        options={{
          title: "Finances",
          tabBarLabel: "",
          tabBarIcon: () => <Ionicons name="wallet-outline" size={24} color="black" />,
          headerStyle: {
            backgroundColor: configs?.headers.finances.value || "#f3e7e7",
          },  
        }}
        
      />
      <Tabs.Screen
        name="Configs"
        options={{
          title: "Configs",
          tabBarLabel: "",
          tabBarIcon: () => <Octicons name="gear" size={24} color="black" />,
          headerStyle: {
            backgroundColor: configs?.headers.configs.value || "#f3e7e7",
          },  
        }}
      
      />
    </Tabs>
    
  );
};
