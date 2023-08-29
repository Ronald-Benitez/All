import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

db.transaction((tx) => {
  tx.executeSql(
    "create table if not exists budgets (id integer primary key not null, name text, amount real, quantity real, value real, group_id integer)"
  );
  // tx.executeSql("delete from budgets");
});

const getItem = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from budgets where id = ?",
        [id],
        (_, { rows: { _array } }) => {
          resolve(_array[0]);
        },
        (_, error) => reject(null)
      );
    });
  });
};

const insertItem = (name, amount, quantity, value, group_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "insert into budgets (name, amount, quantity, value, group_id) values (?, ?, ?, ?, ?)",
      [name, amount, quantity, value, group_id]
    );
  });
};

const updateItem = (id, name, amount, quantity, value, group_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "update budgets set name = ?, amount = ?, quantity = ?, value = ?, group_id = ? where id = ?",
      [name, amount, quantity, value, group_id, id]
    );
  });
};

const deleteItem = (id) => {
  db.transaction((tx) => {
    tx.executeSql("delete from budgets where id = ?", [id]);
  });
};

const getAll = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from budgets",
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        reject
      );
    });
  });
};

const getByGroup = (group_id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from budgets where group_id = ?",
        [group_id],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        reject
      );
    });
  });
};

export default {
  getItem,
  insertItem,
  updateItem,
  deleteItem,
  getAll,
  getByGroup,
};
