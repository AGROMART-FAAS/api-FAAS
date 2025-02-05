"use strict";
const TABLE_NAME = "UsuariosTable";
const dynamoDbLib = require("./dynamodb-client-config");

const getUsuarios = function (params) {
    return params.IndexName
        ? dynamoDbLib.call("query", params)
        : dynamoDbLib.call("scan", params);
};

const createUsuario = function (content) {
    return dynamoDbLib.call("put", {
        TableName: TABLE_NAME,
        Item: content,
    });
};

const deleteUsuario = function (id) {
    return dynamoDbLib.call("delete", { TableName: TABLE_NAME, Key: { id } });
};
module.exports = {
    getUsuarios,
    createUsuario,
    deleteUsuario,
};
