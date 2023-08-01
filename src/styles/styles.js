import { StyleSheet } from "react-native";
import { getConfigs } from "../helpers/files";

export default async function getStyles() {
  let configs = await getConfigs();
  return StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      padding: 5,
    },

    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 10,
    },

    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      borderColor: configs.colors.inputBorderColor.value || "#936997",
      padding: 10,
      backgroundColor: configs.colors.inputBackgroundColor.value || "white",
      minWidth: 200,
      color: configs.colors.inputTextColor.value || "black",
    },

    inputLabel: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },

    sideLabel: {
      fontSize: 15,
      fontWeight: "300",
      textAlign: "center",
    },

    button: {
      backgroundColor: "white",
      borderRadius: 5,
      padding: 15,
      margin: 5,
      justifyContent: "center",
      alignItems: "center",
    },

    buttonText: {
      color: configs.colors.buttonTextColor.value || "black",
      fontWeight: "bold",
      fontSize: 15,
    },

    buttonPrimary: {
      backgroundColor: configs.colors.primaryColor.value || "white",
      borderRadius: 5,
      padding: 15,
      margin: 5,
      justifyContent: "center",
      alignItems: "center",
    },

    buttonSecondary: {
      backgroundColor: configs.colors.secondaryColor.value || "white",
      borderRadius: 5,
      padding: 15,
      margin: 5,
      justifyContent: "center",
      alignItems: "center",
    },

    buttonSecondaryText: {
      color: configs.colors.secondaryTextColor.value || "black",
      fontWeight: "bold",
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },

    column: {
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
    },

    block: {
      width: "90%",
      backgroundColor: configs.colors.backgroundColor.value || "white",
      borderRadius: 20,
      borderColor: "black",
      padding: 20,
      margin: 5,
    },

    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      width: "100%",
    },

    modalView: {
      margin: 20,
      backgroundColor: configs.colors.backgroundColor.value || "white",
      borderRadius: 20,
      padding: 35,
      width: "80%",
      alignItems: "center",
      shadowColor: "#000",
      borderCurve: "circular",
      borderColor: "#BE9FE1",
      borderWidth: 1,
    },
    card: {
      backgroundColor: configs.colors.backgroundColor.value || "white",
      borderRadius: 20,
      borderColor: "black",
      padding: 20,
      margin: 5,
      flex: 1,
    },
    day: {
      fontSize: 20,
      fontFamily: "Roboto",
      color: "burlywood",
      fontStyle: "italic",
      fontWeight: "bold",
      borderColor: "burlywood",
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
    },

    unasigned: {
      color: configs.days.unasigned.value || "#D3D3D3",
      borderColor: configs.days.unasigned.value || "#D3D3D3",
    },

    equal: {
      color: configs.days.equal.value || "#4CAF50",
      borderColor: configs.days.equal.value || "#4CAF50",
    },

    better: {
      color: configs.days.better.value || "#2196F3",
      borderColor: configs.days.better.value || "#2196F3",
    },

    worse: {
      color: configs.days.worse.value || "#F44336",
      borderColor: configs.days.worse.value || "#F44336",
    },

    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: 8,
      padding: 16,
      minWidth: 200,
    },
    optionText: {
      fontSize: 16,
      paddingVertical: 8,
      width: "100%",
      textAlign: "center",
    },

    datePickerOptions: {
      backgroundColor: "#fff",
      textHeaderColor: "#50577A",
      textDefaultColor: "#50577A",
      selectedTextColor: "#fff",
      mainColor: "#6A197D",
      textSecondaryColor: "#50577A",
      borderColor: "rgba(122, 146, 165, 0.1)",
    },

    datePickerStyle: {
      marginTop: 20,
      width: 300,
      height: 300,
    },

    datePreview: {
      fontSize: 15,
      fontWeight: "bold",
      textAlign: "center",
    },

    dayDetailsBlock: {
      backgroundColor: configs.colors.backgroundColor.value || "white",
      borderRadius: 20,
      borderColor: "black",
      borderWidth: 1,
      height: 225,
      width: "90%",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 10,
    },

    dayDetailsText: {
      fontSize: 15,
      textAlign: "center",
    },

    dayDetailsTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 10,
    },
  });
}

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#936997",
    padding: 10,
    minWidth: 200,
  },

  inputLabel: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  sideLabel: {
    fontSize: 15,
    fontWeight: "300",
    textAlign: "center",
  },

  button: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 15,
    margin: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  block: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    margin: 5,
  },
});
