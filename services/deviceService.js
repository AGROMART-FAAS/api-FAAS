const repo = require("../repository/usuarioRepository");

const TABLE_NAME = "UsersTable";

const updateDevice = async (body) => {
    try {
        if (!body.user_id || !body.expo_push_token) {
            throw new Error("user_id e expo_push_token são obrigatórios");
        }

        const params = {
            TableName: TABLE_NAME,
            Key: { id: body.user_id },
            UpdateExpression: "set expoPushToken = :token",
            ExpressionAttributeValues: {
                ":token": body.expo_push_token,
            },
            ReturnValues: "ALL_NEW",
        };

        const result = await repo.updateUsuario(params);
        return result.Attributes;
    } catch (error) {
        throw new Error(error.message);
    }
};

const findUserExpoPushToken = async (user_id) => {
    try {
        const params = {
            TableName: TABLE_NAME,
            Key: { id: user_id },
            ProjectionExpression: "expoPushToken",
        };

        const result = await repo.getUsuarios(params);
        return result.Item ? result.Item : null;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    updateDevice,
    findUserExpoPushToken,
};
