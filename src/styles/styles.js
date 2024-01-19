import { StyleSheet } from "react-native";
import { getConfigs } from "../helpers/files";

export default async function getStyles() {
  let configs = await getConfigs();

  const baseButtonStyles = {
    borderRadius: 5,
    padding: 15,
    margin: 5,
    minHeight: 48,
    minWidth: 48,
    justifyContent: "center",
    alignItems: "center",
  };

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

    subtitle: {
      fontSize: 15,
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 10,
    },

    input: {
      minHeight: 48,
      margin: 12,
      borderWidth: 1,
      borderColor: configs.colors.inputBorderColor.value || "#936997",
      padding: 10,
      backgroundColor: configs.colors.inputBackgroundColor.value || "white",
      minWidth: 200,
      color: configs.colors.inputTextColor.value || "black",
    },
    separator: {
      height: 1,
      width: "100%",
      backgroundColor: "#CED0CE",
    },
    label: {
      minWidth: 70,
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
      ...baseButtonStyles,
      backgroundColor: "white",
    },

    buttonText: {
      color: configs.colors.buttonTextColor.value || "black",
      fontWeight: "bold",
      fontSize: 15,
    },

    buttonBordered: {
      ...baseButtonStyles,
      backgroundColor: "transparent",
      borderColor: configs.colors.primaryColor.value || "black",
      borderWidth: 1,
    },

    buttonPrimary: {
      ...baseButtonStyles,
      backgroundColor: configs.colors.primaryColor.value || "white",
      borderColor: configs.colors.primaryColor.value || "black",
    },

    buttonPrimaryText: {
      color: configs.colors.primaryTextColor.value || "black",
      fontWeight: "bold",
    },

    buttonSecondary: {
      ...baseButtonStyles,
      backgroundColor: configs.colors.secondaryColor.value || "white",
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
      padding: 5,
    },

    block: {
      width: "90%",
      backgroundColor: configs.colors.backgroundColor.value || "white",
      borderRadius: 20,
      borderColor: "black",
      padding: 20,
      margin: 5,
    },

    primaryBorder: {
      borderColor: configs.colors.primaryColor.value || "black",
      borderWidth: 1,
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

    unasignedBg: {
      backgroundColor: configs.days.unasigned.value || "#D3D3D3",
    },

    equal: {
      color: configs.days.equal.value || "#4CAF50",
      borderColor: configs.days.equal.value || "#4CAF50",
    },

    equalBg: {
      backgroundColor: configs.days.equal.value || "#4CAF50",
    },

    better: {
      color: configs.days.better.value || "#2196F3",
      borderColor: configs.days.better.value || "#2196F3",
    },

    betterBg: {
      backgroundColor: configs.days.better.value || "#2196F3",
    },

    worse: {
      color: configs.days.worse.value || "#F44336",
      borderColor: configs.days.worse.value || "#F44336",
    },

    worseBg: {
      backgroundColor: configs.days.worse.value || "#F44336",
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
      maxWidth: 350,
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

    colorPreview: {
      width: 100,
      height: 47,
      margin: 2,
      marginEnd: 12,
      borderRadius: 5,
      borderLeftColor: "lightgray",
      borderRightColor: "lightgray",
      borderLeftWidth: 0.5,
      borderRightWidth: 0.5,
    },

    picker: {
      width: "90%",
      height: "50%",
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      padding: 20,
    },
    colorItem: {
      width: 50,
      height: 50,
      margin: 5,
      borderWidth: 1,
      borderColor: "black",
    },

    detailsBlock: {
      padding: 10,
      borderColor: "black",
      borderWidth: 1,
      minHeight: 50,
      minWidth: "33%",
      justifyContent: "center",
      alignItems: "center",
      margin: 5,
      borderRadius: 5,
    },

    income: {
      color: configs.finances.incomes.value || "#4CAF50",
      borderColor: configs.finances.incomes.value || "#4CAF50",
    },

    expense: {
      color: configs.finances.expenses.value || "#F44336",
      borderColor: configs.finances.expenses.value || "#F44336",
    },

    goal: {
      color: configs.finances.goal.value || "#2196F3",
      borderColor: configs.finances.goal.value || "#2196F3",
    },

    registerBlock: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "90%",
      marginVertical: 10,
      borderWidth: 0.5,
      padding: 7,
      borderRadius: 5,
    },

    verticalText: {
      transform: [{ rotate: "-90deg" }],
    },

    dateVerticalSmall: {
      transform: [{ rotate: "-90deg" }],
      fontSize: 10,
      fontWeight: "300",
    },

    petImage: {
      width: 350,
      height: 350,
      borderRadius: 175,
    },

    petMessageText: {
      fontSize: 20,
      textAlign: "center",
      fontFamily: "Roboto",
      fontWeight: "100",
    },

    cardText: {
      fontSize: 15,
      textAlign: "center",
      fontWeight: "100",
    },

    dayCircle: {
      width: 35,
      height: 35,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      margin: 5,
    },

    dayText: {
      fontSize: 15,
      fontWeight: "bold",
      textAlign: "center",
      color: "white",
    },

    daySelected: {
      backgroundColor: "#6A197D",
    },

    borderedBlock_: {
      width: "100%",
      backgroundColor: configs.colors.backgroundColor.value || "white",
      borderRadius: 20,
      borderColor: "black",
      padding: 10,
      margin: 5,
      borderWidth: 1,
      borderStyle: "dashed",
    },
  });
}
