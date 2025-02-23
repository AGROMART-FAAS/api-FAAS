const tables = [
    "AssinantesTable",
    "CestasTable",
    "EnderecosTable",
    "ItensTable",
    "LojasTable",
    "UsuariosTable",
    "NotificacoesTable",
    "PlanosTable",
    "ProdutosAvulsosTable",
];

const resources = {};

tables.forEach((table) => {
    resources[`${table}ScalingRead`] = {
        Type: "AWS::ApplicationAutoScaling::ScalableTarget",
        Properties: {
            MaxCapacity: 3,
            MinCapacity: 1,
            ResourceId: `table/${table}`,
            RoleARN:
                "arn:aws:iam::${aws:accountId}:role/DynamoDBAutoScalingRole",
            ScalableDimension: "dynamodb:table:ReadCapacityUnits",
            ServiceNamespace: "dynamodb",
        },
    };

    resources[`${table}ScalingWrite`] = {
        Type: "AWS::ApplicationAutoScaling::ScalableTarget",
        Properties: {
            MaxCapacity: 3,
            MinCapacity: 1,
            ResourceId: `table/${table}`,
            RoleARN:
                "arn:aws:iam::${aws:accountId}:role/DynamoDBAutoScalingRole",
            ScalableDimension: "dynamodb:table:WriteCapacityUnits",
            ServiceNamespace: "dynamodb",
        },
    };
});

module.exports = resources;
