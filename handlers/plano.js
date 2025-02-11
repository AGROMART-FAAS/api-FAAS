"use strict";

const repo = require("../repository/planoRepository");

exports.getPlanos = async (event, context) => {
    try {
        const planos = await repo.getPlanos();

        if (planos.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify(planos),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ mensagem: "Nenhum plano encontrado" }),
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

exports.createPlano = async (event, context) => {
    try {
        const data = JSON.parse(event.body);
        const plano = await repo.createPlano(data);

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Plano criado com sucesso",
                plano,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Erro ao criar o plano",
                error: error.message,
            }),
        };
    }
};
