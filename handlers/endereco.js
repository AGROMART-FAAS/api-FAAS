const repo = require("../repository/enderecoRepository");

exports.createEndereco = async (event) => {
    try {
        const body = JSON.parse(event.body);

        if (
            !body.cidade ||
            !body.numero ||
            !body.cep ||
            !body.rua ||
            !body.bairro
        ) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    mensagem: "Campos obrigatórios ausentes!",
                }),
            };
        }

        const endereco = await repo.createEndereco(body);

        return {
            statusCode: 201,
            body: JSON.stringify({
                mensagem: "Endereço criado com sucesso!",
                endereco,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                mensagem: "Erro ao criar endereço",
                error: error.message,
            }),
        };
    }
};

exports.getEnderecoByUser = async (event) => {
    try {
        const { user_id } = event.pathParameters;
        const endereco = await repo.getEnderecoByUser(user_id);

        if (endereco) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    mensagem: "Endereço encontrado!",
                    endereco,
                }),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ mensagem: "Endereço não encontrado!" }),
            };
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                mensagem: "Erro ao buscar endereço",
                error: error.message,
            }),
        };
    }
};
