'use strict';

/*
 global err
*/

require('dotenv').config();

const express = require('express');
const aws = require('aws-sdk');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(morgan('common'));

const PORT = process.env.PORT;
const secretAccessKey = process.env.SECRETACCESSKEY;
const accessKeyId = process.env.ACCESSKEYID;

const emails = process.env.emails.split(' ');
const sender = process.env.sender;

let options = {
    secretAccessKey: secretAccessKey,
    accessKeyId: accessKeyId,
    region: 'us-east-1'
};

const ses = new aws.SES(options);


app.get('/', (req, res) => {
    res.send('Homee');
});

app.get('/sendEmail', (req, res) => {

    var emailParams = {
        Destination: {
            ToAddresses: emails
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: 'This message body contains HTML formatting. It can, for example, contain links like this one: <a class="ulink" href="http://docs.aws.amazon.com/ses/latest/DeveloperGuide" target="_blank">Amazon SES Developer Guide</a>.'
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: 'This is the message body in text format. I rly dont know what this does. Now I do <3'
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'AWS-Service-Email'
            }
        },
        Source: sender
    };

    ses.sendEmail(emailParams, (err, data) => {
        if(err) {
            console.log('error!');
            console.log(err);
            res.send(err);
        }

        else {
            console.log('success?');
            console.log(data);
            res.send(data);
        }
    });

    // res.send('Home');
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
