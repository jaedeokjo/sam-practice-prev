const AWS = require("aws-sdk")
AWS.config.update({ region: 'ap-northeast-2' })
let response;

const db = new AWS.DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME
console.log(TableName)

exports.create = async (event, context) => {
    let newData = null
    const body = JSON.parse(event.body)
    try {
        try {
            newData = {
                ID: body.ID,
                data: body.data
            }
        } catch (_) {
            newData = {
                ID: "test",
                data: "please call with post method and approprate data format"
            }
        }
        console.log(newData)
        await db.put({
            TableName,
            Item: newData,
        })
            .promise()

    } catch (err) {
        console.log(err);
        return err;
    }
    response = { statusCode: 200, body: JSON.stringify(newData) }

    return response
};

exports.list = async (event, context) => {
    let datas = null
    try {
        datas = await db
            .scan({
                TableName,
            })
            .promise()

    } catch (err) {
        console.log(err);
        return err;
    }

    try {
        response = { statusCode: 200, body: JSON.stringify(datas) }
    } catch (_) {
        response = { statusCode: 200, body: "there is no data in dynamoDB" }
    }

    return response
};

