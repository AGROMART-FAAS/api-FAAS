"use strict";
const TABLE_NAME = "AssinantesTable";
const dynamoDbLib = require("./dynamodb-client-config");

const getAssinantes = function (params) {
    console.log("Repository");
    return params.IndexName
        ? dynamoDbLib.call("query", params)
        : dynamoDbLib.call("scan", params);
};

const createAssinante = function (content) {
    return dynamoDbLib.call("put", {
        TableName: TABLE_NAME,
        Item: content,
    });
};

module.exports = {
    getAssinantes,
    createAssinante,
};
