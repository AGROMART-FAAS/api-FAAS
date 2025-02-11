"use strict";

const repo = require("../repository/produtoAvulsoRepository");

exports.getProdutosAvulsos = async (event, context) => {
    try {
        const produtos = await repo.getProdutosAvulsos();

        if (produtos.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify(produtos),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    mensagem: "Nenhum produto avulso encontrado",
                }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Erro ao processar a requisição",
                error: error.message,
            }),
        };
    }
};

exports.createProdutoAvulso = async (event, context) => {
    try {
        const data = JSON.parse(event.body);
        const produto = await repo.createProdutoAvulso(data);

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Produto avulso criado com sucesso",
                produto,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Erro ao criar o produto avulso",
                error: error.message,
            }),
        };
    }
};
