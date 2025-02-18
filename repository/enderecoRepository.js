"use strict";
const TABLE_NAME = "EnderecosTable";
const dynamoDbLib = require("./dynamodb-client-config");

const getEnderecoByUser = function (userId) {
    const params = {
        TableName: TABLE_NAME,
        IndexName: "UserIndex",
        KeyConditionExpression: "userId = :userId",
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

const updateEndereco = function (updateEndereco) {
    return dynamoDbLib.call("update", updateEndereco);
};

module.exports = {
    getEnderecoByUser,
    createEndereco,
    updateEndereco,
};
