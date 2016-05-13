"use strict";

let mysql = require("mysql");

class Client {
    constructor(options) {
        this._options = options;
        this._connection = null;
        this._transacting = null;
    }

    getConnection() {
        if (!this._connection)
            this._connection = mysql.createConnection(this._options.mysql);
        return this._connection;
    }

    query(sql, params) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            let connection = _this.getConnection();
            connection.connect();
            connection.query(sql, params, function (error, rows, fields) {
                if (error) {
                    return reject(error);
                }

                return resolve(rows);
            });
            connection.end();
        });
    }

    startTransaction() {
        this._transacting = true;
        let _this = this;
        return new Promise(function (resolve, reject) {
            let connection = _this.getConnection();
            connection.beginTransaction(function (error) {
                if (error) {
                    return reject(error);
                }

                return resolve();
            });
        });
    }

    executeTransaction(sql, params) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            let connection = _this.getConnection();
            connection.query(sql, params, function (error, rows, fields) {
                if (error) {
                    return connection.rollback(function(){
                        reject(error);
                    });
                }

                return resolve(rows);
            });
        });
    }

    stopTransaction() {
        this._transacting = false;
        let _this = this;
        return new Promise(function (resolve, reject) {
            let connection = _this.getConnection();
            connection.commit(function (error) {
                if (error) {
                    return connection.rollback(function () {
                        reject(error);
                    });
                }

                return resolve();
            });
        });
    }
}

module.exports = Client;