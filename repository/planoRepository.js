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

const createPlano = async function (data) {
    const novoPlano = {
        id: Date.now().toString(),
        nome: data.nome,
        descricao: data.descricao,
        valor: data.valor,
        quantidade_de_cestas: data.quantidade_de_cestas,
        quantidade: data.quantidade || 0,
        imagem: data.imagem || "",
        assinantes: data.assinantes || [],
        lojas: data.lojas || [],
    };

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
