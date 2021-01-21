/*
 * @Author: your name
 * @LastEditors: xiasong
 * @Date: 2021-01-21 15:52:43
 * @LastEditTime: 2021-01-21 17:58:58
 * @Description: description db的库
 * @FilePath: \package_all\koa\module\db.js
 */

const MongoClient = require("mongodb").MongoClient;

const Config = require("./config");

class DB {
  static getInstance() {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }

  constructor() {
    this.dbClient = ""; /* 存放 db 对象 */
    this.connect();
  }

  // 连接数据库
  connect() {
    const _this = this;
    return new Promise((resolve, reject) => {
      if (!_this.dbClient) {
        /* 解决多次连接数据库的问题 */
        MongoClient.connect(Config.dbUrl, (err, client) => {
          if (err) {
            reject(err);
          } else {
            _this.dbClient = client.db(Config.dbName);
            resolve(_this.dbClient);
          }
        });
      } else {
        resolve(_this.dbClient);
      }
    });
  }

  // 查询
  find(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        const result = db.collection(collectionName).find(json);
        result.toArray((err, docs) => {
          if (err) {
            reject(err);
            return;
          } else {
            resolve(docs);
            // console.log(docs);
          }
        });
      });
    });
  }

  // 更新
  update() {}

  // 插入
  insert(insertName, json = {}) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(insertName).insertOne(json, (err, result) => {
          if (err) {
            reject(err);
          } else {
            // console.log(result);
            resolve(result);
          }
        });
      });
    });
  }
}

module.exports = DB.getInstance();

// setTimeout(() => {
//   console.time("start");
//   const myDB = new DB();
//   myDB.find("user", {}).then((data) => {
//     console.log(data);
//     console.timeEnd("start");
//   });
// }, 1000);

// setTimeout(() => {
//   console.time("start");
//   const myDB = new DB();
//   myDB.find("user", {}).then((data) => {
//     console.log(data);
//     console.timeEnd("start");
//   });
// }, 2000);
// setTimeout(() => {
//   console.time("start");
//   const myDB = new DB();
//   myDB.find("user", {}).then((data) => {
//     console.log(data);
//     console.timeEnd("start");
//   });
// }, 3000);
