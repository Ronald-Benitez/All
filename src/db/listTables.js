import * as SQLite from "expo-sqlite";

class TableHandler {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = SQLite.openDatabase("db.db");

    this.db.transaction((tx) => {
      tx.executeSql(
        // "drop table " + tableName
        `create table if not exists ${tableName} (id integer primary key not null, name text, date text, value real, type text, group_id integer)`
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
      this.executeSql(query, [id], (_, { rows: { _array } }) => {
        resolve(_array[0]);
      }, reject);
    });
  }

  insertItem(name, date, value, type, group_id) {
    const query = `insert into ${this.tableName} (name, date, value, type, group_id) values (?, ?, ?, ?, ?)`;
    this.executeSql(query, [name, date, value, type, group_id]);
  }

  getAll() {
    return new Promise((resolve, reject) => {
      const query = `select * from ${this.tableName}`;
      this.executeSql(query, [], (_, { rows: { _array } }) => {
        resolve(_array);
      }, reject);
    });
  }

  getByGroup(group_id) {
    return new Promise((resolve, reject) => {
      const query = `select * from ${this.tableName} where group_id = ? order by date asc`;
      this.executeSql(query, [group_id], (_, { rows: { _array } }) => {
        resolve(_array);
      }, reject);
    });
  }

  getByGroupAndType(group_id, type) {
    return new Promise((resolve, reject) => {
      const query = `select * from ${this.tableName} where group_id = ? and type = ?`;
      this.executeSql(query, [group_id, type], (_, { rows: { _array } }) => {
        resolve(_array);
      }, reject);
    });
  }

  getByDateRangeAndGroup(group_id, startDate, endDate) {
    return new Promise((resolve, reject) => {
      const query = `select * from ${this.tableName} where group_id = ? and date between ? and ?`;
      this.executeSql(query, [group_id, startDate, endDate], (_, { rows: { _array } }) => {
        resolve(_array);
      }, reject);
    });
  }

  updateItem(id, name, date, value, type) {
    const query = `update ${this.tableName} set name = ?, date = ?, value = ?, type = ? where id = ?`;
    this.executeSql(query, [name, date, value, type, id]);
  }

  deleteItem(id) {
    const query = `delete from ${this.tableName} where id = ?`;
    this.executeSql(query, [id]);
  }

  deleteByGroup(group_id) {
    const query = `delete from ${this.tableName} where group_id = ?`;
    this.executeSql(query, [group_id]);
  }
}

export default TableHandler;
