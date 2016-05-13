"use strict";

var co = require("co");
var Client = require("./index.js");

let config = {
    host: "127.0.0.1",
    port: 3306,
    database: "test",
    user: "root",
    password: "123456"
};

co(function*() {
    let result = yield (new Client({
        mysql: config
    })).query("select * from user where id = ?;", [1]);
    return result;
}).then(function (result) {
    let s = "";
}, function (error) {
    let b = "";
});

co(function*() {
    let client = new Client({
        mysql: config
    });
    let result;
    result = yield client.startTransaction();
    result = yield client.executeTransaction("select * from user;", []);
    result = yield client.executeTransaction("update user set age = ? where id = ?;", [2, result[5]["id"]]);
    result = yield client.stopTransaction();
    return result;
}).then(function (result) {
    let s = "";
}, function (error) {
    let b = "";
});