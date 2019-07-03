const DBConnection = require("../db").DBConnection;

const { Db } = require("mongodb").Db;
var express = require("express");
var router = express.Router();

router.get("/", async function(req, res, next) {
  //   console.log(req);
  console.log(`Now serving dbroutes`);
  var x = "abc";
  res.send(x);
  DBConnection.connect().then(client => {
    //console.log(client);
    const db  =  client.db('test');
    const collection = db.collection('users');
    collection.insertMany([{a:1},{a:2}])
      .then(result => {
        console.log(result);
        
      });
  });
});


router.get("/find/:name/:value", async function(req, res, next){
    DBConnection.connect().then((client) => {
        const db = client.db('test');
        const coll = db.collection('users');
        const name = req.params.name;
        const val =  req.params.value;
        coll.findOne({[name]:val}).then(
            (result) => {
                console.log(result);
                res.send(result);
            });
    })

});

module.exports = router;
