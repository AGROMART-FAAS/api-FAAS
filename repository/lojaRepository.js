"use strict";
const TABLE_NAME = "LojasTable";
const dynamoDbLib = require("./dynamodb-client-config");

const getAllLojas = async function () {
    let params = {
        TableName: TABLE_NAME,
    };
    const result = await dynamoDbLib.call("scan", params);
    return result.Items ? result : [];
};

const getLojasComRelacionamentos = async function () {
    try {
        const result = await getAllLojas();
        const lojas = result.Items;
        let idsCestas = new Set();
        let idsPlanos = new Set();
        let idsProdutos = new Set();

        // Coletando IDs únicos de cestas, planos e produtos
        lojas.forEach((loja) => {
            (loja.cestas || []).forEach((id) => idsCestas.add(id));
            (loja.planos || []).forEach((id) => idsPlanos.add(id));
            (loja.produto_avulsos || []).forEach((id) => idsProdutos.add(id));
        });

        // Buscando todas as entidades relacionadas de uma só vez
        const [cestas, planos, produtos] = await Promise.all([
            dynamoDbLib.batchGet("CestasTable", Array.from(idsCestas)),
            dynamoDbLib.batchGet("PlanosTable", Array.from(idsPlanos)),
            dynamoDbLib.batchGet(
                "ProdutosAvulsosTable",
                Array.from(idsProdutos)
            ),
        ]);

        // Criando um mapa de ID → Objeto para facilitar associação
        const cestasMap = Object.fromEntries(cestas.map((c) => [c.id, c]));
        const planosMap = Object.fromEntries(planos.map((p) => [p.id, p]));
        const produtosMap = Object.fromEntries(produtos.map((p) => [p.id, p]));

        // Preenchendo os relacionamentos dentro de cada loja
        lojas.forEach((loja) => {
            loja.cestas = (loja.cestas || []).map(
                (id) => cestasMap[id] || null
            );
            loja.planos = (loja.planos || []).map(
                (id) => planosMap[id] || null
            );
            loja.produto_avulsos = (loja.produto_avulsos || []).map(
                (id) => produtosMap[id] || null
            );
        });

        return lojas;
    } catch (error) {
        throw new Error(
            "Erro ao buscar lojas com relacionamentos: " + error.message
        );
    }
};

const createLoja = async function (content) {
    return dynamoDbLib.call("put", { TableName: TABLE_NAME, Item: content });
};

const updateLoja = async function (params) {
    try {
        const result = await dynamoDbLib.call("update", params);
        return result.Attributes;
    } catch (error) {
        throw new Error("Erro ao atualizar a loja: " + error.message);
    }
};

module.exports = {
    updateLoja,
    getLojasComRelacionamentos,
    createLoja,
};
