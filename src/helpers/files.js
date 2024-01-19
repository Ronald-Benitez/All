import * as FileSystem from "expo-file-system";
import { Storage } from "expo-storage";

import configs from "../files/configs.json";
import pet from "../files/pet.json";
import petEs from "../files/petEs.json";

export const getConfigs = async () => {
  if (await fileExists("configs.json")) {
    let file = await readFile("configs.json");
    return JSON.parse(file);
  } else {
    await writeFile("configs.json", JSON.stringify(configs));
    return configs;
  }
};

export const resetConfigs = async (key) => {
  let file = await getConfigs();
  file[key] = configs[key];
  await setConfigs(file);
  return file;
};

export const getDaysColors = async () => {
  let configs = await getConfigs();
  let daysColors = {
    0: configs.days.unasigned,
    1: configs.days.equal,
    2: configs.days.better,
    3: configs.days.worse,
  };

  return daysColors;
};

export const deleteConfigs = async () => {
  await FileSystem.deleteAsync(FileSystem.documentDirectory + "configs.json");
};

export const setConfigs = async (configs) => {
  await writeFile("configs.json", JSON.stringify(configs));
};

export const fileExists = async (path) => {
  let fileUri = FileSystem.documentDirectory + path;
  let file = await FileSystem.getInfoAsync(fileUri);
  return file.exists;
};

export const readFile = async (path) => {
  let fileUri = FileSystem.documentDirectory + path;

  let file = await FileSystem.readAsStringAsync(fileUri);

  return file;
};

export const writeFile = async (path, content) => {
  let fileUri = FileSystem.documentDirectory + path;

  await FileSystem.writeAsStringAsync(fileUri, content);
};

const getPetFileName = async () => {
  const res = await Storage.getItem({ key: "language" })
  if (res === "es") {
    return "petEs.json";
  }
  return "pet.json";
};

export const getPet = async () => {
  const fileName = await getPetFileName();
  if (await fileExists(fileName)) {
    let file = await readFile(fileName);
    return JSON.parse(file);
  } else {
    await setPet();
    return pet;
  }
};

export const setPet = async () => {
  const fileName = await getPetFileName();
  if (fileName === "petEs.json") {
    await writeFile(fileName, JSON.stringify(petEs));
    return;
  }
  await writeFile(fileName, JSON.stringify(pet));
};

export const updatePet = async (data) => {
  const fileName = await getPetFileName();
  await writeFile(fileName, JSON.stringify(data));
};

export const updateKeyPet = async (key, value) => {
  const fileName = await getPetFileName();
  let file = await getPet();
  file[key] = value;
  await writeFile(fileName, JSON.stringify(file));
  return file;
};

export const reloadKeyPet = async (key) => {
  const fileName = await getPetFileName();
  let file = await getPet();
  file[key] = pet[key];
  await writeFile(fileName, JSON.stringify(file));
  return file;
};

export const deletePet = async () => {
  const fileName = await getPetFileName();
  await FileSystem.deleteAsync(FileSystem.documentDirectory + fileName);
};
