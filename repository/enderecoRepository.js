"use strict";
const TABLE_NAME = "EnderecosTable";
const dynamoDbLib = require("./dynamodb-client-config");

const getEnderecos = function () {
    return dynamoDbLib.call("scan", { TableName: TABLE_NAME });
};

const getEnderecoByUser = function (userId) {
    const params = {
        TableName: TABLE_NAME,
        IndexName: "UserIndex",
        KeyConditionExpression: "users = :userId",
        ExpressionAttributeValues: {
            ":userId": userId,
        },
    };
    return dynamoDbLib.call("query", params);
};

const createEndereco = function (endereco) {
    return dynamoDbLib.call("put", {
        TableName: TABLE_NAME,
        Item: endereco,
    });
};

module.exports = {
    getEnderecoByUser,
    createEndereco,
};
