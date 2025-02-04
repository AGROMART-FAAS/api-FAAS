const AWS = require("aws-sdk");

let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: "localhost",
        endpoint: "http://localhost:8000", // ALTERADO PARA PORTA 8000
        accessKeyId: "localkey123",
        secretAccessKey: "localsecret123",
    };
}

AWS.config.update({ region: "us-east-1" });

AWS.config.update({
    maxRetries: 2,
    httpOptions: {
        timeout: 30000,
        connectTimeout: 5000,
    },
});

const call = function (action, params) {
    const dynamoDb = new AWS.DynamoDB.DocumentClient(options);
    return dynamoDb[action](params).promise();
};

module.exports = { call };
