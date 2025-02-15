"use strict";
const TABLE_NAME = "PlanosTable";
const dynamoDbLib = require("./dynamodb-client-config");

const getPlanos = async function () {
    try {
        const result = await dynamoDbLib.call("scan", {
            TableName: TABLE_NAME,
        });
        return result.Items;
    } catch (error) {
        throw new Error("Erro ao buscar planos: " + error.message);
    }
};

const createPlano = async function (novoPlano) {
    try {
        await dynamoDbLib.call("put", {
            TableName: TABLE_NAME,
            Item: novoPlano,
        });

        return novoPlano;
    } catch (error) {
        throw new Error("Erro ao criar plano: " + error.message);
    }
};

module.exports = {
    getPlanos,
    createPlano,
};
