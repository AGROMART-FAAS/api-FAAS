"use strict";
const TABLE_NAME = "UsuariosTable";
const dynamoDbLib = require("./dynamodb-client-config");

const getUserByemail = async function (email) {
    const params = {
        TableName: TABLE_NAME,
        IndexName: "EmailIndex",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": email,
        },
    };

    try {
        const result = await dynamoDbLib.call("query", params);
        return result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
        throw new Error("Erro ao buscar usuário: " + error.message);
    }
};

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

const updateUsuario = function (params) {
    return dynamoDbLib.call("update", params);
};

module.exports = {
    getUsuarios,
    createUsuario,
    deleteUsuario,
    updateUsuario,
    getUserByemail,
};
