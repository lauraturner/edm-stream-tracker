require('dotenv').config()
let MongoClient = require('mongodb').MongoClient;
let mongoURI = process.env.MONGO_URI;

module.exports = {
    insertOne: function(collection, obj) {
        MongoClient.connect(mongoURI, function(err, db) {
            if (err) throw err;
            let dbo = db.db("edm-streams");
            dbo.collection(collection).insertOne(obj, function(err, res) {
                if (err) throw err;
                db.close();
            });
        });
    },

    deleteAll: function() {
        MongoClient.connect(mongoURI, function(err, db) {
            if (err) throw err;
            var dbo = db.db("edm-streams");
            var myquery = {};
            dbo.collection("current-streams").deleteMany(myquery, function(err, obj) {
                if (err) throw err;
                console.log(obj.result.n + " document(s) deleted");
                db.close();
            });
        });
    }
};