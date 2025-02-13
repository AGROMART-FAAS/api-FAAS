"use strict";

const repo = require("../repository/usuarioRepository");

exports.login = async (event) => {
    try {
        const { nome, senha } = JSON.parse(event.body);

        if (!nome || !senha) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Nome e senha são obrigatórios.",
                }),
            };
        }

        const user = await repo.getUserByNome(nome);

        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    message: "Usuário inválido.",
                }),
            };
        }

        if (senha !== user.senha) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    message: "senha inválida.",
                }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Login realizado com sucesso.",
                user: {
                    id: user.id,
                    username: user.username,
                },
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Erro interno no servidor.",
                error: error.message,
            }),
        };
    }
};
