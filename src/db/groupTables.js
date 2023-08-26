import * as SQLite from "expo-sqlite";

class TableHandler {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = SQLite.openDatabase("db.db");

    this.db.transaction((tx) => {
      tx.executeSql(
        // "drop table " + tableName
        `create table if not exists ${tableName} (id integer primary key not null, name text, month text, year text, expenses real, incomes real, goal real)`
      );
    });
  }

  executeSql(sql, params, successCallback, errorCallback) {
    this.db.transaction((tx) => {
      tx.executeSql(sql, params, successCallback, (_, error) => {
        errorCallback(error);
      });
    });
  }

  getItem(id) {
    return new Promise((resolve, reject) => {
      const query = `select * from ${this.tableName} where id = ?`;
      this.executeSql(
        query,
        [id],
        (_, { rows: { _array } }) => {
          resolve(_array[0]);
        },
        reject
      );
    });
  }

  insertItem(name, month, year, expenses, incomes, goal) {
    this.executeSql(
      `insert into ${this.tableName} (name, month, year, expenses, incomes, goal) values (?, ?, ?, ?, ?, ?)`,
      [name, month, year, expenses, incomes, goal]
    );
  }

  getAll() {
    return new Promise((resolve, reject) => {
      const query = `select * from ${this.tableName}`;
      this.executeSql(
        query,
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        reject
      );
    });
  }

  getLast() {
    return new Promise((resolve, reject) => {
      const query = `select * from ${this.tableName} order by id desc limit 1`;
      this.executeSql(
        query,
        [],
        (_, { rows: { _array } }) => {
          resolve(_array[0]);
        },
        reject
      );
    });
  }

  getByYear(year) {
    return new Promise((resolve, reject) => {
      const query = `select * from ${this.tableName} where year = ? order by month asc`;
      this.executeSql(
        query,
        [year],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        reject
      );
    });
  }

  updateItem(id, name, month, year, expenses, incomes, goal) {
    const query = `update ${this.tableName} set name = ?, month = ?, year = ?, expenses = ?, incomes = ?, goal = ? where id = ?`;
    this.executeSql(query, [name, month, year, expenses, incomes, goal, id]);
  }

  updateExpenses(id, expenses) {
    const query = `update ${this.tableName} set expenses = ? where id = ?`;
    this.executeSql(query, [expenses, id]);
  }

  updateIncomes(id, incomes) {
    const query = `update ${this.tableName} set incomes = ? where id = ?`;
    this.executeSql(query, [incomes, id]);
  }

  updateGoal(id, goal) {
    const query = `update ${this.tableName} set goal = ? where id = ?`;
    this.executeSql(query, [goal, id]);
  }

  updateName(id, name) {
    const query = `update ${this.tableName} set name = ? where id = ?`;
    this.executeSql(query, [name, id]);
  }

  updateMonth(id, month) {
    const query = `update ${this.tableName} set month = ? where id = ?`;
    this.executeSql(query, [month, id]);
  }

  updateYear(id, year) {
    const query = `update ${this.tableName} set year = ? where id = ?`;
    this.executeSql(query, [year, id]);
  }

  updateBaseData(id, name, goal) {
    const query = `update ${this.tableName} set name = ?, goal = ? where id = ?`;
    this.executeSql(query, [name, goal, id]);
  }

  deleteItem(id) {
    const query = `delete from ${this.tableName} where id = ?`;
    this.executeSql(query, [id]);
  }
}

export default TableHandler;
