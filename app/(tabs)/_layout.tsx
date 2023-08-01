import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

export default () => {
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
        }}
      />
      <Tabs.Screen
        name="Giveaways"
        options={{
          title: "Giveaways",
          tabBarLabel: "",
          tabBarIcon: () => <AntDesign name="gift" size={28} color="black" />,
        }}
      />
        <Tabs.Screen
         name="Days"
         options={{
           title: "Days",
           tabBarLabel: "",
           tabBarIcon: () => <Ionicons name="ios-today-outline" size={24} color="black" />,
          
         }}
       />
      <Tabs.Screen
        name="Configs"
        options={{
          title: "Configs",
          tabBarLabel: "",
          tabBarIcon: () => <Octicons name="gear" size={24} color="black" />,
         
        }}
      />
    </Tabs>
  );
};
