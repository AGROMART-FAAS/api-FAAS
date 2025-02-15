const { v4: uuidv4 } = require("uuid");
const repo = require("../repository/cestaRepository");

exports.createCesta = async (event) => {
    try {
        const body = JSON.parse(event.body);

        const cesta = {
            id: uuidv4(),
            valor: body.valor,
            quantidade: body.quantidade,
            descricao: body.descricao,
            imagem: body.imagem || [],
            cesta: body.cesta,
            createdAt: new Date().toISOString(),
        };

        return repo
            .createCesta(cesta)
            .then((data) => {
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        Mensagem: "Cesta criada com sucesso",
                        data: data,
                    }),
                };
            })
            .catch((err) => {
                console.error("erro DB ", err);
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        Mensagem: "Erro ao salvar",
                        Erro: err,
                    }),
                };
            });
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                Mensagem: "Erro ao criar a cesta.",
                Erro: error,
            }),
        };
    }
};

exports.getCestas = async (event) => {
    try {
        let params = {
            TableName: "CestasTable",
        };

        const result = await repo.getCestas(params);

        return {
            statusCode: 200,
            body: JSON.stringify(
                result.Items.map((cesta) => ({
                    id: cesta.id,
                    valor: cesta.valor,
                    quantidade: cesta.quantidade,
                    descricao: cesta.descricao || "Descrição",
                    tipos_de_entrega: cesta.tipos_de_entrega,
                    imagem: cesta.imagem || null,
                    lojas: cesta.lojas || [],
                }))
            ),
        };
    } catch (error) {
        console.error("Erro ao buscar cestas:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
