"use strict";

const repo = require("../repository/lojaRepository");
const { v4: uuidv4 } = require("uuid");
const TABLE_NAME = "LojasTable";

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
    const lojaJson = data[0]
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    const loja = {
        id: id,
        nome: lojaJson.nome,
        descricao: lojaJson.descricao || "Descrição",
        banner: lojaJson.banner || null,
        tipos_de_entrega: lojaJson.tipos_de_entrega || null,
        contato: lojaJson.contato || null,
        cnpj: lojaJson.cnpj || null,
        endereco: lojaJson.endereco || null,
        cestas: lojaJson.cestas || [],
        planos: lojaJson.planos || [],
        assinantes: lojaJson.assinantes || [],
        produto_avulsos: lojaJson.produto_avulsos || [],
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

        if (!id || Object.keys(data).length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "ID da loja é obrigatório para atualização.",
                }),
            };
        }

        const params = {
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: "set ",
            ExpressionAttributeValues: {},
            ExpressionAttributeNames: {},
            ReturnValues: "UPDATED_NEW",
        };

        let updateFields = [];

        if (data.nome) {
            updateFields.push("#nome = :nome");
            params.ExpressionAttributeValues[":nome"] = data.nome;
            params.ExpressionAttributeNames["#nome"] = "nome";
        }

        if (data.endereco) {
            updateFields.push("#endereco = :endereco");
            params.ExpressionAttributeValues[":endereco"] = data.endereco;
            params.ExpressionAttributeNames["#endereco"] = "endereco";
        }

        if (data.telefone) {
            updateFields.push("#telefone = :telefone");
            params.ExpressionAttributeValues[":telefone"] = data.telefone;
            params.ExpressionAttributeNames["#telefone"] = "telefone";
        }

        if (data.cestas) {
            updateFields.push("#cestas = :cestas");
            params.ExpressionAttributeValues[":cestas"] = data.cestas;
            params.ExpressionAttributeNames["#cestas"] = "cestas";
        }

        if (data.planos) {
            updateFields.push("#planos = :planos");
            params.ExpressionAttributeValues[":planos"] = data.planos;
            params.ExpressionAttributeNames["#planos"] = "planos";
        }

        if (data.produtos) {
            updateFields.push("#produtos = :produtos");
            params.ExpressionAttributeValues[":produtos"] = data.produtos;
            params.ExpressionAttributeNames["#produtos"] = "produtos";
        }

        // Se houver campos para atualizar, adicionamos à query
        if (updateFields.length > 0) {
            params.UpdateExpression += updateFields.join(", ");
        } else {
            throw new Error(
                "Nenhum campo válido foi enviado para atualização."
            );
        }

        const lojaAtualizada = await repo.updateLoja(params);

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
