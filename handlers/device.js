const deviceService = require("../services/deviceService");

exports.updateDevice = async (event) => {
    try {
        const body = JSON.parse(event.body);

        const updatedUser = await deviceService.updateDevice(body);

        return {
            statusCode: 200,
            body: JSON.stringify(updatedUser),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Erro ao atualizar dispositivo",
                error: error.message,
            }),
        };
    }
};

exports.findUserExpoPushToken = async (event) => {
    try {
        const { user_id } = event.pathParameters;
        const data = await deviceService.findUserExpoPushToken(user_id);

        if (data && data.expoPushToken) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    mensagem: "Device encontrado!",
                    device_id: data.expoPushToken,
                    status: 200,
                }),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    mensagem: "Device não encontrado!",
                    status: 404,
                }),
            };
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Erro ao buscar token",
                error: error.message,
            }),
        };
    }
};
