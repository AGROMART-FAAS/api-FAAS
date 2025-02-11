"use strict";

const repo = require("../repository/notificacaoRepository");

exports.getNotificacoes = async (event, context) => {
    try {
        const notificacoes = await repo.getNotificacoes();

        if (notificacoes.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify(notificacoes),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    mensagem: "Não foi encontrada nenhuma notificação",
                }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message:
                    "Ops! Tivemos um problema ao processar sua requisição.",
                error: error.message,
            }),
        };
    }
};
