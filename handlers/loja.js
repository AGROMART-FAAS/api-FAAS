"use strict";

const repo = require("../repository/lojaRepository");

// Função para buscar todas as lojas
exports.getLojas = async (event) => {
    try {
        let params = {
            TableName: "LojasTable",
        };

        const result = await repo.getLojas(params);

        return {
            statusCode: 200,
            body: JSON.stringify(
                result.Items.map((loja) => ({
                    id: loja.id,
                    nome: loja.nome,
                    descricao: loja.descricao || "Descrição",
                    banner: loja.banner || null,
                    tipos_de_entrega: loja.tipos_de_entrega,
                    contato: loja.contato,
                    cnpj: loja.cnpj,
                    endereco: loja.endereco || null,
                    cestas: loja.cestas || [],
                    planos: loja.planos || [],
                    assinantes: loja.assinantes || [],
                    produto_avulsos: loja.produto_avulsos || [],
                }))
            ),
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
        tipos_de_entrega: data.tipos_de_entrega,
        contato: data.contato,
        cnpj: data.cnpj,
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
