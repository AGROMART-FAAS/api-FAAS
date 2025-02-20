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

const getEnderecoById = function (id) {
    const params = {
        TableName: TABLE_NAME,
        IndexName: "UserIndex",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id,
        },
    };
    return dynamoDbLib.call("query", params);
};

const createEndereco = async function (endereco) {
    const params = {
        TableName: TABLE_NAME,
        Item: endereco,
    };

    try {
        await dynamoDbLib.call("put",params)
        console.log("Item salvo com sucesso!");
        return { params };
    } catch (error) {
        console.error("Erro ao salvar item:", error);
        return { success: false, error };
    }
};

const updateEndereco = async function (updateEndereco, endereco) {
    const params = {
        TableName: TABLE_NAME,
        Item: endereco,
    };

    try {
        await dynamoDbLib.call("update", updateEndereco);
        console.log("Item alterado com sucesso!");
        return { params };
    } catch (error) {
        console.error("Erro ao aterar item:", error);
        return { success: false, error };
    }
};

module.exports = {
    getEnderecoByUser,
    createEndereco,
    updateEndereco,
    getEnderecoById
};
