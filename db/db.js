const MongoClient = require('mongodb').MongoClient;
const assert = require('assert')

//connection url
const url = 'mongodb://localhost:27017';

//Database Name
const dbName = 'mongodb-init';

MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    insertUser(db,function(res){
        console.log(res)
    })

    client.close();
});

const insertDocuments = function(db, callback) {
    // Get the documents collection
    let collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
        {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
};

const insertUser = function(db, callback){
    let collection = db.collection('users');
    collection.insertMany([{
        uname: 'gaojun',
        upwd: 'gaojun123',
        age: 35
    }], function(err, result){
        assert.equal(err, null);
        console.log('Inserted user of Gaojun message into the collection');
        callback(result)
    })
};

