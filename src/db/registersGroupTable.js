import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

db.transaction((tx) => {
  tx.executeSql(
    // "drop table registerGroup"
    "create table if not exists registerGroup (id integer primary key not null, name text, month text, year text, expenses real, incomes real, goal real)"
  );
});

const getItem = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from registerGroup where id = ?",
        [id],
        (_, { rows: { _array } }) => {
          resolve(_array[0]);
        },
        (_, error) => reject(null)
      );
    });
  });
};

const insertItem = (name, month, year, expenses, incomes, goal) => {
  db.transaction((tx) => {
    tx.executeSql(
      "insert into registerGroup (name, month, year, expenses, incomes, goal) values (?, ?, ?, ?, ?, ?)",
      [name, month, year, expenses, incomes, goal]
    );
  });
};

const getAll = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from registerGroup",
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => reject(null)
      );
    });
  });
};

const getByYear = (year) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from registerGroup where year = ? order by month asc",
        [year],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => reject(null)
      );
    });
  });
};

const updateItem = (id, name, month, year, expenses, incomes, goal) => {
  db.transaction((tx) => {
    tx.executeSql(
      "update registerGroup set name = ?, month = ?, year = ?, expenses = ?, incomes = ?, goal = ? where id = ?",
      [name, month, year, expenses, incomes, goal, id]
    );
  });
};

const updateExpenses = (id, expenses) => {
  db.transaction((tx) => {
    tx.executeSql("update registerGroup set expenses = ? where id = ?", [
      expenses,
      id,
    ]);
  });
};

const updateIncomes = (id, incomes) => {
  db.transaction((tx) => {
    tx.executeSql("update registerGroup set incomes = ? where id = ?", [
      incomes,
      id,
    ]);
  });
};

const updateGoal = (id, goal) => {
  db.transaction((tx) => {
    tx.executeSql("update registerGroup set goal = ? where id = ?", [goal, id]);
  });
};

const updateName = (id, name) => {
  db.transaction((tx) => {
    tx.executeSql("update registerGroup set name = ? where id = ?", [name, id]);
  });
};

const updateMonth = (id, month) => {
  db.transaction((tx) => {
    tx.executeSql("update registerGroup set month = ? where id = ?", [
      month,
      id,
    ]);
  });
};

const updateYear = (id, year) => {
  db.transaction((tx) => {
    tx.executeSql("update registerGroup set year = ? where id = ?", [year, id]);
  });
};

const updateBaseData = (id, name, goal) => {
  db.transaction((tx) => {
    tx.executeSql("update registerGroup set name = ?, goal = ? where id = ?", [
      name,
      goal,
      id,
    ]);
  });
};

const deleteItem = (id) => {
  db.transaction((tx) => {
    tx.executeSql("delete from registerGroup where id = ?", [id]);
  });
};

export default {
  getItem,
  insertItem,
  getAll,
  getByYear,
  updateExpenses,
  updateIncomes,
  updateGoal,
  updateName,
  updateMonth,
  updateYear,
  deleteItem,
  updateItem,
  updateBaseData
};
