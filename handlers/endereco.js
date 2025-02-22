const repo = require("../repository/enderecoRepository");
const { v4: uuidv4 } = require("uuid");
const TABLE_NAME = "EnderecosTable";

exports.createEndereco = async (event) => {
    try {
        const data = JSON.parse(event.body);
        const id = uuidv4();

        if (
            !data.cidade ||
            !data.numero ||
            !data.cep ||
            !data.rua ||
            !data.bairro
        ) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    mensagem: "Campos obrigatórios ausentes!",
                }),
            };
        }

        const endereco = {
            id: id,
            cidade: data.cidade,
            numero: data.numero,
            complemento: data.complemento,
            cep: data.cep,
            rua: data.rua,
            bairro: data.bairro,
            userId: data.userId,
        };

        const result = await repo.createEndereco(endereco);

        const retorno = {
            statusCode: 201,
            body: JSON.stringify({
                mensagem: "Endereço criado com sucesso!",
                data: await result.params?.Item,
            }),
        };

        return retorno;
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
        const { userId } = event.pathParameters;
        const endereco = await repo.getEnderecoByUser(userId);

        if (endereco.Count > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    mensagem: "Endereço encontrado!",
                    endereco,
                }),
            };
        }

        return {
            statusCode: 404,
            body: JSON.stringify({ mensagem: "Endereço não encontrado!" }),
        };
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

exports.getEnderecoById = async (event) => {
    try {
        const { id } = event.pathParameters;
        const endereco = await repo.getEnderecoById(id);

        if (endereco.Count > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    mensagem: "Endereço encontrado!",
                    endereco,
                }),
            };
        }

        return {
            statusCode: 404,
            body: JSON.stringify({ mensagem: "Endereço não encontrado!" }),
        };
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

exports.updateEndereco = async (event) => {
    const endereco = JSON.parse(event.body);
    const { id } = event.pathParameters;

    const params = {
        TableName: TABLE_NAME,
        Key: { id: id },
        UpdateExpression:
            "set cidade = :c, numero = :n, complemento = :co, cep = :ce, rua=:r, bairro = :b, userId = :u",
        ExpressionAttributeValues: {
            ":c": endereco.cidade,
            ":n": endereco.numero,
            ":co": endereco.complemento,
            ":ce": endereco.cep,
            ":r": endereco.rua,
            ":b": endereco.bairro,
            ":u": endereco.userId,
        },
        ReturnValues: "UPDATED_NEW",
    };
    const result = await repo.updateEndereco(params, endereco);

    return {
        statusCode: 200,
        body: JSON.stringify({
            mensagem: "Endereço criado com sucesso!",
            data: await result.params?.Item,
        }),
    };
};
