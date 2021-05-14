const mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://localhost", { useUnifiedTopology: true })
            .then(conn => global.conn = conn.db("sistca-node-db"))
            .catch(err => console.log(err))

function findAll() {
    return global.conn.collection("sensorslog").find().toArray();
}

function insert(sensor_record) {
    return global.conn.collection("sensorslog").insertOne(sensor_record);
}

const ObjectId = require("mongodb").ObjectId;
function findOne(id) {
    return global.conn.collection("sensorslog").findOne(new ObjectId(id));
}

function update(id, sensor_record) {
    return global.conn.collection("sensorslog").updateOne({ _id: new ObjectId(id) }, { $set: sensor_record });
}

function deleteOne(id) {
    return global.conn.collection("sensorslog").deleteOne({ _id: new ObjectId(id) });
}

function findByTypeValue(value) {
    return global.conn.collection("sensorslog").find( { type: { $eq: value } } ).toArray();
}

module.exports = { findAll, insert, findOne, update, deleteOne, findByTypeValue }