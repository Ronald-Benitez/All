import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

db.transaction((tx) => {
  tx.executeSql(
    "create table if not exists earnings (id integer primary key not null, date text, name text, amount text, group_id integer)"
  );
  // tx.executeSql("delete from earnings");
});

const getItem = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from earnings where id = ?",
        [id],
        (_, { rows: { _array } }) => {
          resolve(_array[0]);
        },
        (_, error) => reject(null)
      );
    });
  });
};

const insertItem = (date, name, amount, group_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "insert into earnings (date, name, amount, group_id) values (?, ?, ?, ?)",
      [date, name, amount, group_id]
    );
  });
};

const updateItem = (id, date, name, amount, group_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "update earnings set date = ?, name = ?, amount = ?, group_id = ? where id = ?",
      [date, name, amount, group_id, id]
    );
  });
};

const deleteItem = (id) => {
  db.transaction((tx) => {
    tx.executeSql("delete from earnings where id = ?", [id]);
  });
};

const getAll = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from earnings",
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
        "select * from earnings where group_id = ? order by date asc",
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
