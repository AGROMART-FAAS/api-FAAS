"use strict";
const { v4: uuidv4 } = require("uuid");
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
        const novoProduto = {
            id: uuidv4(),
            nome: data.nome,
            unidade_medida: data.unidade_medida || "",
            descricao: data.descricao || "",
            valor: data.valor || 0,
            quantidade: data.quantidade || 0,
            imagem: data.imagem || "",
            loja_id: data.loja_id || "",
        };
        const produto = await repo.createProdutoAvulso(novoProduto);

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Produto avulso criado com sucesso",
                data: produto,
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
