const mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://mongodb", { useUnifiedTopology: true })
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
    //const editedValues = {}
    console.log('update:: id: ' + id + ' record: ');
    console.log(sensor_record);
    return global.conn.collection("sensorslog").updateOne({ _id: new ObjectId(id) }, { $set: sensor_record });
}

function deleteOne(id) {
    return global.conn.collection("sensorslog").deleteOne({ _id: new ObjectId(id) });
}
 
module.exports = { findAll, insert, findOne, update, deleteOne }