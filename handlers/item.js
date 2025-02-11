const { v4: uuidv4 } = require("uuid");
const repo = require("../repository/itemRepository");
TABLE_NAME = "ItensTable";

module.exports.createItem = async (event) => {
    const data = JSON.parse(event.body);
    const item = {
        id: uuidv4(),
        quantidade: data.quantidade,
        valor: data.valor,
        produto_avulso: data.produto_avulso,
        plano: data.plano,
    };
    await repo.createItem(item);
    return { statusCode: 201, body: JSON.stringify(params.Item) };
};

module.exports.getItem = async (event) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: event.pathParameters.id },
    };
    const result = repo.getItem(params);
    return result.Item
        ? { statusCode: 200, body: JSON.stringify(result.Item) }
        : {
              statusCode: 404,
              body: JSON.stringify({ error: "Nenhum item encontrado" }),
          };
};

module.exports.listItems = async () => {
    const params = { TableName: TABLE_NAME };
    const result = await repo.getItem(params);
    return { statusCode: 200, body: JSON.stringify(result.Items) };
};

module.exports.updateItem = async (event) => {
    const data = JSON.parse(event.body);
    const params = {
        TableName: TABLE_NAME,
        Key: { id: event.pathParameters.id },
        UpdateExpression:
            "set quantidade = :q, valor = :v, produto_avulso = :pa, plano = :p",
        ExpressionAttributeValues: {
            ":q": data.quantidade,
            ":v": data.valor,
            ":pa": data.produto_avulso,
            ":p": data.plano,
        },
        ReturnValues: "UPDATED_NEW",
    };
    const result = await repo.updateItem(params);
    return { statusCode: 200, body: JSON.stringify(result.Attributes) };
};

module.exports.deleteItem = async (event) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: event.pathParameters.id },
    };
    await Repo.deleteItem(params);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Item deleted" }),
    };
};
