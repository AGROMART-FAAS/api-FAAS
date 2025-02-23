"use strict";

const repo = require("../repository/usuarioRepository");
const { v4: uuidv4 } = require("uuid");
const TABLE_NAME = "UsuariosTable";

// Função para obter usuários
exports.getUsuarios = async (event) => {
    try {
        const { usuario: id } = event.queryStringParameters || {};

        let params = { TableName: "UsuariosTable" };
        if (id) {
            params.KeyConditionExpression = "id = :id";
            params.ExpressionAttributeValues = { ":id": id };
        }

        const result = await repo.getUsuarios(params);

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

// Função para criar um usuário
exports.createUsuario = async (event) => {
    const data = JSON.parse(event.body);
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    const usuario = {
        id,
        nome: data.nome,
        senha: data.senha,
        email: data.email,
        created_at: timestamp,
    };

    try {
        const result = await repo.createUsuario(usuario);
        console.log("result criar usuario: " + JSON.stringify(result.Attributes))

        return {
            statusCode: 200,
            body: JSON.stringify({
                Mensagem: "Usuário criado com sucesso",
                user: {
                    id: data.id,
                    username: data.nome,
                    email: data.email
                }
            }),
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Função para excluir um usuário
exports.deleteUsuario = async (event) => {
    try {
        const id = event.pathParameters.id;

        if (!id) {
            return {
                statusCode: 400,
                Mensagem: "Insira o id do usuário que será deletado",
            };
        }

        await repo.deleteUsuario(id);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Usuário excluído com sucesso" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

exports.updateUsuario = async (event) => {
    try {
        const data = JSON.parse(event.body);
        const { id } = event.pathParameters;
        const params = {
            TableName: TABLE_NAME,
            Key: { id: id },
            UpdateExpression:
                "set nome = :nome, email = :email",
            ExpressionAttributeValues: {
                ":nome": data.username,
                ":email": data.email,
            },
            ReturnValues: "UPDATED_NEW",
        };

        const result = await repo.updateUsuario(params);
        console.log("result atualziar usuario: " + JSON.stringify(result.Attributes))

        return {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        };
    } catch (error) {
        throw new Error(error.message);
    }
};
