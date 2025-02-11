"use strict";
const TABLE_NAME = "ItensTable";
const dynamoDbLib = require("./dynamodb-client-config");

const getItem = function (params) {
    return params.Key
        ? dynamoDbLib.call("query", params)
        : dynamoDbLib.call("scan", params);
};

const createItem = function (content) {
    return dynamoDbLib.call("put", {
        TableName: TABLE_NAME,
        Item: content,
    });
};

const updateItem = function (params) {
    return dynamoDbLib.call("update", params);
};

const deleteItem = function (params) {
    return dynamoDbLib.call("delete", params);
};

module.exports = {
    getItem,
    createItem,
    updateItem,
    deleteItem,
};
