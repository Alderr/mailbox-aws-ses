'use strict';

/*
 global err
*/

require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const sendRouter = require('./routes/sendRouter');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(morgan('common'));
app.use('/api/v1', sendRouter);

const PORT = process.env.PORT;

const emails = process.env.emails.split(' ');
const sender = process.env.sender;

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
                    Data: 'This is important! <a href="https://google.com"> See if it tracks! </a> This message body contains HTML! It can, for example, contain links like this one: <a class="ulink" href="http://docs.aws.amazon.com/ses/latest/DeveloperGuide" target="_blank">Amazon SES Developer Guide</a>.'
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Vernon, test this API.'
            }
        },
        Source: sender,
        ConfigurationSetName: 'mailbox_events',
        Tags: [
            {
                Name: 'user',
                Value: 'vernonmensah'
            }
        ]
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
