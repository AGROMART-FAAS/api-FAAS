"use strict";

const repo = require("../repository/usuarioRepository");

exports.login = async (event) => {
    try {
        const { email, senha } = JSON.parse(event.body);

        if (!email || !senha) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Email e senha são obrigatórios.",
                }),
            };
        }

        const user = await repo.getUserByemail(email);

        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    message: "Email ou senha inválidos.",
                }),
            };
        }

        if (senha !== user.senha) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    message: "Email ou senha inválidos.",
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
