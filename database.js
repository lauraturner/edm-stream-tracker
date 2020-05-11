require('dotenv').config()
let MongoClient = require('mongodb').MongoClient;

let mongoURI = process.env.MONGO_URI;

MongoClient.connect(mongoURI, function(err, db) {
    if (err) throw err;
    let dbo = db.db("Streams");
    dbo.collection("other").insertMany(myobj, function(err, res) {
        if (err) throw err;
        console.log(res);
        db.close();
    });
});