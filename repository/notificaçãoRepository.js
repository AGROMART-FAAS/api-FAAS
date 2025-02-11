"use strict";

const TABLE_NAME = "NotificacoesTable";
const dynamoDbLib = require("./dynamodb-client-config");

const getNotificacoes = async function () {
    try {
        const result = await dynamoDbLib.call("scan", {
            TableName: TABLE_NAME,
        });

        return result.Items.map((notification) => ({
            index: notification.id,
            title: notification.title,
            body_text: notification.subtitle,
        }));
    } catch (error) {
        throw new Error("Erro ao buscar notificações: " + error.message);
    }
};

module.exports = {
    getNotificacoes,
};
