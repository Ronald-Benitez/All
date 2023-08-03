import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

db.transaction((tx) => {
  tx.executeSql(
    // "drop table registerList"
    "create table if not exists registerList (id integer primary key not null, name text, date text, value real, type text, group_id integer)"
  );
});

const getItem = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from registerList where id = ?",
        [id],
        (_, { rows: { _array } }) => {
          resolve(_array[0]);
        },
        (_, error) => reject(null)
      );
    });
  });
};

const insertItem = (name, date, value, type, group_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "insert into registerList (name, date, value, type, group_id) values (?, ?, ?, ?, ?)",
      [name, date, value, type, group_id]
    );
  });
};

const getAll = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from registerList",
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => reject(null)
      );
    });
  });
};

const getByGroup = (group_id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from registerList where group_id = ? order by date asc",
        [group_id],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => reject(null)
      );
    });
  });
};

const getByGroupAndType = (group_id, type) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from registerList where group_id = ? and type = ?",
        [group_id, type],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => reject(null)
      );
    });
  });
};

const getByDateRangeAndGroup = (group_id, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from registerList where group_id = ? and date between ? and ?",
        [group_id, startDate, endDate],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => reject(null)
      );
    });
  });
};

const updateItem = (id, name, date, value, type) => {
  db.transaction((tx) => {
    tx.executeSql(
      "update registerList set name = ?, date = ?, value = ?, type = ? where id = ?",
      [name, date, value, type, id]
    );
  });
};

const deleteItem = (id) => {
  db.transaction((tx) => {
    tx.executeSql("delete from registerList where id = ?", [id]);
  });
};

const deleteByGroup = (group_id) => {
  db.transaction((tx) => {
    tx.executeSql("delete from registerList where group_id = ?", [group_id]);
  });
};

export default {
  getItem,
  insertItem,
  getAll,
  getByGroup,
  getByGroupAndType,
  getByDateRangeAndGroup,
  updateItem,
  deleteItem,
  deleteByGroup,
};
