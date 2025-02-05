"use strict";

const repo = require("../repository/assinanteRepository");
const { v4: uuidv4 } = require("uuid");

// Função para pegar assinantes
exports.getAssinantes = async (event, context) => {
    try {
        const { usuario: id } = event.queryStringParameters || {};

        let params = {
            TableName: "AssinantesTable",
        };

        if (id) {
            params.IndexName = "GSI1"; // Buscar por usuário_id
            params.KeyConditionExpression = "usuario_id = :id";
            params.ExpressionAttributeValues = { ":id": id };
        }

        const result = await repo.getAssinantes(params);

        return {
            statusCode: 200,
            body: JSON.stringify(
                result.Items.map((assinante) => ({
                    nome: assinante.nome,
                    id: assinante.id,
                    cestas_disponiveis: assinante.cestas_disponiveis,
                    pular_cesta: assinante.pular_cesta,
                    planos: assinante.planos,
                    lojas: assinante.lojas,
                    // planos: Array.isArray(assinante.planos)
                    //     ? assinante.planos.map((plano) => ({
                    //           quantidade_de_cestas: plano.quantidade_de_cestas,
                    //           imagem: plano.imagem,
                    //           valor: plano.valor,
                    //           nome: plano.nome,
                    //           descricao: plano.descricao,
                    //           loja: plano.loja,
                    //       }))
                    //     : [],
                    created_at: assinante.created_at,
                    usuario_id: assinante.usuario_id,
                }))
            ),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

// Função para criar um assinante
exports.createAssinante = async (event, context) => {
    const data =
        typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    const id = uuidv4();
    const timestamp = new Date().toISOString();

    var assinante = {
        id,
        nome: data.nome,
        cestas_disponiveis: data.cestas_disponiveis || 0,
        pular_cesta: data.pular_cesta || false,
        usuario_id: data.usuario_id,
        planos: JSON.stringify(data.planos),
        lojas: JSON.stringify(data.lojas),
        created_at: timestamp,
    };

    return repo
        .createAssinante(assinante)
        .then((data) => {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "cadastrado com sucesso",
                    data: data,
                }),
            };
        })
        .catch((err) => {
            console.error("erro DB ", err);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "Erro ao salvar",
                }),
            };
        });
};

// // Função para atualizar um assinante
// exports.updateAssinante = async (event, context) => {
//     try {
//         const id = event.pathParameters.id;
//         const data = JSON.parse(event.body);
//         const timestamp = new Date().toISOString();

//         const params = {
//             TableName: "Assinantes",
//             Key: {
//                 id,
//                 usuario_id: data.usuario_id,
//             },
//             UpdateExpression:
//                 "set nome = :nome, cestas_disponiveis = :cestas_disponiveis, pular_cesta = :pular_cesta, planos = :planos, lojas = :lojas, updated_at = :updated_at",
//             ExpressionAttributeValues: {
//                 ":nome": data.nome,
//                 ":cestas_disponiveis": data.cestas_disponiveis,
//                 ":pular_cesta": data.pular_cesta,
//                 ":planos": data.planos,
//                 ":lojas": data.lojas,
//                 ":updated_at": timestamp,
//             },
//             ReturnValues: "UPDATED_NEW",
//         };

//         await dynamoDB.update(params).promise();

//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 message: "Assinante atualizado com sucesso",
//             }),
//         };
//     } catch (error) {
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ error: error.message }),
//         };
//     }
// };

// // Função para excluir um assinante
// exports.deleteAssinante = async (event) => {
//     try {
//         const id = event.pathParameters.id;

//         const params = {
//             TableName: "Assinantes",
//             Key: { id },
//         };

//         const result = await dynamoDB.get(params).promise();

//         if (!result.Item) {
//             return {
//                 statusCode: 404,
//                 body: JSON.stringify({ error: "Assinante não encontrado" }),
//             };
//         }

//         await dynamoDB.delete(params).promise();

//         return {
//             statusCode: 200,
//             body: JSON.stringify({ message: "Assinante excluído com sucesso" }),
//         };
//     } catch (error) {
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ error: error.message }),
//         };
//     }
// };
