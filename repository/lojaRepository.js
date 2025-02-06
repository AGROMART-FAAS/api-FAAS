"use strict";
const TABLE_NAME = "lojaTable";
const dynamoDbLib = require("./dynamodb-client-config");

const getLojas = function (params) {
    return dynamoDbLib.call("scan", params);
};

const createLoja = function (content) {
    return dynamoDbLib.call("put", { TableName: TABLE_NAME, Item: content });
};

module.exports = {
    getLojas,
    createLoja,
};
