"use strict";
const TABLE_NAME = "CestasTable";
const dynamoDbLib = require("./dynamodb-client-config");

const getCestas = function (params) {
    return dynamoDbLib.call("scan", params);
};

const createCesta = function (content) {
    return dynamoDbLib.call("put", {
        TableName: TABLE_NAME,
        Item: content,
    });
};

module.exports = {
    getCestas,
    createCesta,
};
