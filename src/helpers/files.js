import * as FileSystem from "expo-file-system";
import configs from "../files/configs.json";
import pet from "../files/pet.json";

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
    Unasigned: configs.days.unasigned,
    Equal: configs.days.equal,
    Better: configs.days.better,
    Worse: configs.days.worse,
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

export const getPet = async () => {
  if (await fileExists("pet.json")) {
    let file = await readFile("pet.json");
    return JSON.parse(file);
  } else {
    await setPet();
    return pet;
  }
};

export const setPet = async () => {
  await writeFile("pet.json", JSON.stringify(pet));
};

export const updatePet = async (data) => {
  await writeFile("pet.json", JSON.stringify(data));
};

export const updateKeyPet = async (key, value) => {
  let file = await getPet();
  file[key] = value;
  await writeFile("pet.json", JSON.stringify(file));
  return file;
};

export const reloadKeyPet = async (key) => {
  let file = await getPet();
  file[key] = pet[key];
  await writeFile("pet.json", JSON.stringify(file));
  return file;
};

export const deletePet = async () => {
  await FileSystem.deleteAsync(FileSystem.documentDirectory + "pet.json");
};
