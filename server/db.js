const MongoClient = require('mongodb').MongoClient;
const {DB_URL} = require("./config.js");

class DBConnection {

    static connect(){
        if(this.client){
            console.log('client is already established');
            // console.log(this.client);
            return Promise.resolve(this.client);
        }
        return  MongoClient.connect(this.url,this.options).then(
          
            client => {
                this.client = client;
                // console.log(this.client);
                console.log('Initiating client');
                }
        )
    }
}

DBConnection.client = null;
DBConnection.options = {useNewUrlParser:true};
DBConnection.url = DB_URL;
// let dbClient;

// dbClient =  MongoClient.connect(DB_URL,{ useNewUrlParser: true});



//module.exports.DBConnect = DBConnect;
module.exports.DBConnection = DBConnection;
