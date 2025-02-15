"use strict";
const TABLE_NAME = "LojasTable";
const dynamoDbLib = require("./dynamodb-client-config");

const GetLojas = function (params) {
    return dynamoDbLib.call("scan", params);
};

const CreateLoja = function (content) {
    return dynamoDbLib.call("put", { TableName: TABLE_NAME, Item: content });
};

module.exports = {
    GetLojas,
    CreateLoja,
};
