'use strict';

/*
 global err
*/

require('dotenv').config();

const express = require('express');
const aws = require('aws-sdk');


const app = express();

const PORT = process.env.PORT;
const secretAccessKey = process.env.SECRETACCESSKEY;
const accessKeyId = process.env.ACCESSKEYID;


let options = {
  secretAccessKey: secretAccessKey,
  accessKeyId: accessKeyId,
};

const ses = new aws.SES(options);

app.get('/', (req, res) => {
    res.send('Home');
});


let server;

function runServer(port = PORT) {
    return new Promise(function(resolve, reject) {

        server = app.listen(port, () => {
            console.log('Listening on ' + port);
            resolve();

        }).on('error', (err) => {
            reject(err);
        });

    });
}

function closeServer(){
    return new Promise(function(resolve, reject) {
        server.close((err) => {
            if(err) {
                return reject(err);
            }
            resolve();
        });
    });
}

if (require.main === module){
    runServer().catch(err => console.error(err));
}

module.exports = { runServer, closeServer, app };
