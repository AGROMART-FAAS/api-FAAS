"use strict";

const repo = require("../repository/lojaRepository");
const { v4: uuidv4 } = require("uuid");

// Função para buscar todas as lojas
exports.getLojas = async (event) => {
    try {
        const lojas = await repo.getLojasComRelacionamentos();

        return {
            statusCode: 200,
            body: JSON.stringify(lojas),
        };
    } catch (error) {
        console.error("Erro ao buscar lojas:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

exports.createLoja = async (event) => {
    const data = JSON.parse(event.body);
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    const loja = {
        id,
        nome: data.nome,
        descricao: data.descricao || "Descrição",
        banner: data.banner || null,
        tipos_de_entrega: data.tipos_de_entrega || null,
        contato: data.contato || null,
        cnpj: data.cnpj || null,
        endereco: data.endereco || null,
        cestas: data.cestas || [],
        planos: data.planos || [],
        assinantes: data.assinantes || [],
        produto_avulsos: data.produto_avulsos || [],
        created_at: timestamp,
    };

    return repo
        .createLoja(loja)
        .then(() => ({
            statusCode: 200,
            body: JSON.stringify({ message: "Loja criada com sucesso" }),
        }))
        .catch((err) => ({
            statusCode: 500,
            body: JSON.stringify({
                message: "Erro ao salvar",
                error: err.message,
            }),
        }));
};

exports.updateLoja = async (event) => {
    try {
        const id = event.pathParameters?.id;
        const data = JSON.parse(event.body);

        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "ID da loja é obrigatório para atualização.",
                }),
            };
        }

        const lojaAtualizada = await repo.updateLoja(id, data);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Loja atualizada com sucesso.",
                loja: lojaAtualizada,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Erro ao atualizar a loja.",
                error: error.message,
            }),
        };
    }
};
