import * as SQLite from "expo-sqlite";
import moment from "moment/moment";

const db = SQLite.openDatabase("db.db");

db.transaction((tx) => {
  tx.executeSql(
    "create table if not exists days (date text, expected text, real text, difference text)"
  );
  // tx.executeSql("delete from days");
});

const getItem = (date) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from days where date = ?",
        [date],
        (_, { rows: { _array } }) => {
          resolve(_array[0]);
        },
        (_, error) => reject(null)
      );
    });
  });
};

const insertItem = (date, expected, real, difference) => {
  db.transaction((tx) => {
    tx.executeSql(
      "insert into days (date, expected, real, difference) values (?, ?, ?, ?)",
      [date, expected, real, difference]
    );
  });
};

const updateExpected = (date, expected) => {
  db.transaction((tx) => {
    tx.executeSql("update days set expected = ? where date = ?", [
      expected,
      date,
    ]);
  });
};

const updateReal = (date, real) => {
  db.transaction((tx) => {
    tx.executeSql("update days set real = ? where date = ?", [real, date]);
  });
};

const updateDifference = (date, difference) => {
  db.transaction((tx) => {
    tx.executeSql("update days set difference = ? where date = ?", [
      difference,
      date,
    ]);
  });
};

const getMonth = (date) => {
  const firstDay = moment(date, "YYYY/MM/DD")
    .startOf("month")
    .format("YYYY/MM/DD");
  const lastDay = moment(date, "YYYY/MM/DD")
    .endOf("month")
    .format("YYYY/MM/DD");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from days where date between ? and ?",
        [firstDay, lastDay],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => {
          reject(null);
        }
      );
    });
  });
};

const getMonthDifference = (date) => {
  const firstDay = moment(date, "YYYY/MM/DD")
    .startOf("month")
    .format("YYYY/MM/DD");
  const lastDay = moment(date, "YYYY/MM/DD")
    .endOf("month")
    .format("YYYY/MM/DD");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select date, difference from days where date between ? and ?",
        [firstDay, lastDay],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => {
          reject(null);
        }
      );
    });
  });
};

const deleteByDate = (date) => {
  db.transaction((tx) => {
    tx.executeSql(
      "delete from days where date = ?",
      [date],
      (_, { rows: { _array } }) => console.log("goodsa"),
      (_, error) => console.log(error)
    );
  });
};

const getByDateRange = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from days where date between ? and ? order by date asc",
        [startDate, endDate],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => {
          reject(null);
        }
      );
    });
  });
};

const database = {
  getItem,
  insertItem,
  updateExpected,
  updateReal,
  updateDifference,
  getMonth,
  deleteByDate,
  getMonthDifference,
  getByDateRange,
};

export default database;
