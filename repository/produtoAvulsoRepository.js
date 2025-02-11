"use strict";

const TABLE_NAME = "ProdutosAvulsosTable";
const dynamoDbLib = require("./dynamodb-client-config");

const getProdutosAvulsos = async function () {
    try {
        const result = await dynamoDbLib.call("scan", {
            TableName: TABLE_NAME,
        });
        return result.Items;
    } catch (error) {
        throw new Error("Erro ao buscar produtos avulsos: " + error.message);
    }
};

const createProdutoAvulso = async function (data) {
    const novoProduto = {
        id: Date.now().toString(),
        nome: data.nome,
        unidade_medida: data.unidade_medida || "",
        descricao: data.descricao || "",
        valor: data.valor || 0,
        quantidade: data.quantidade || 0,
        imagem: data.imagem || "",
        loja_id: data.loja_id || "",
    };

    try {
        await dynamoDbLib.call("put", {
            TableName: TABLE_NAME,
            Item: novoProduto,
        });

        return novoProduto;
    } catch (error) {
        throw new Error("Erro ao criar produto avulso: " + error.message);
    }
};

module.exports = {
    getProdutosAvulsos,
    createProdutoAvulso,
};
