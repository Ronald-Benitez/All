import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

const tables = [
  "registerGroup",
  "savingsGroup",
  "registerList",
  "savingsList",
  "earnings",
  "budgets",
  "days",
];

const schemas = {
  registerGroup: `create table if not exists registerGroup (id integer primary key not null, name text, month text, year text, expenses real, incomes real, goal real)`,
  savingsGroup: `create table if not exists savingsGroup (id integer primary key not null, name text, month text, year text, expenses real, incomes real, goal real)`,
  budgets:
    "create table if not exists budgets (id integer primary key not null, name text, amount real, quantity real, value real, group_id integer)",
  days: "create table if not exists days (date text, expected text, real text, difference text)",
  earnings:
    "create table if not exists earnings (id integer primary key not null, date text, name text, amount text, group_id integer)",
  registerList: `create table if not exists registerList (id integer primary key not null, name text, date text, value real, type text, group_id integer)`,
  savingsList: `create table if not exists savingsList (id integer primary key not null, name text, date text, value real, type text, group_id integer)`,
};

const createTablesFromSchema = () => {
  for (let table of tables) {
    db.transaction((tx) => {
      tx.executeSql(schemas[table]);
    });
  }
};

const getTable = (table) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from ${table}`,
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        reject
      );
    });
  });
};

const resetTable = async (table) => {
  db.transaction((tx) => {
    tx.executeSql(`delete from ${table}`);
  });
};

const insertToTable = (table, values) => {
  let columns = Object.keys(values).join(", ");
  let valuesArray = Object.values(values);
  let questionMarks = valuesArray.map(() => "?").join(", ");

  if (table !== "days") {
    columns = Object.keys(values).slice(1).join(", ");
    valuesArray = Object.values(values).slice(1);
    questionMarks = valuesArray.map(() => "?").join(", ");
  }

  db.transaction((tx) => {
    tx.executeSql(
      `insert into ${table} (${columns}) values (${questionMarks})`,
      valuesArray
    );
  });
};

export const exportDB = async () => {
  const json = {};
  for (let table of tables) {
    json[table] = await getTable(table);
  }

  return json;
};

export const importDB = async (json) => {
  createTablesFromSchema(json);
  for (let table of tables) {
    resetTable(table);
    json[table].forEach((row) => {
      insertToTable(table, row);
    });
  }
};
