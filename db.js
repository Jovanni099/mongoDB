const { MongoClient } = require('mongodb');


const URL = 'mongodb+srv://jovanni099tmb:AZzLsJGPaeOS59Ck@jovannimongodatabase.dqesfcv.mongodb.net/moviebox'

let dbConnection;

module.exports = {
    connectToDb: (cb) => {
        MongoClient
            .connect(URL)
            .then((client) => {
                console.log('Connected to MongoDB');
                dbConnection = client.db();
                return cb();
            })
            .catch((err) => {
                return cb(err);
            })

    },
    getDb: () => dbConnection,

}



// const client = new MongoClient('mongodb://localhost:27017', { monitorCommands: true });

// client.on('commandStarted', started => console.log(started));
// client.db().collection('pets');
// await client.insertOne({ name: 'spot', kind: 'dog' });