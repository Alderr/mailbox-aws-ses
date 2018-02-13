const aws = require('aws-sdk');

const secretAccessKey = process.env.SECRETACCESSKEY;
const accessKeyId = process.env.ACCESSKEYID;

const options = {
    secretAccessKey: secretAccessKey,
    accessKeyId: accessKeyId,
    region: 'us-east-1'
};

const ses = new aws.SES(options);

const sendEmail = (req) => {
    //check if stuff in body exists

    //take it out
    const { email_content, contacts, campaign_event_data_id } = req.body;

    //create an arr of promises
    const arrOfPromises = [];

    for (let contact in contacts) {

        console.log('CONTACTS[CONTACT]', JSON.stringify(contacts[contact], null, 2));

        const { email_address } = contacts[contact]['email'];

        arrOfPromises.push(create_aws_sendEmail_command(email_content, email_address, campaign_event_data_id ));
    }

    //call them --> (arr.map(promises)...) === ([send_email_command_promise(), send_email_command_promise()])
    Promise.all(arrOfPromises.map(aFunction => aFunction()))
        .then(data => {
            console.log('Successful?');
            console.log(data);
        }).catch(err => {
            console.log('Oh god no. lol.');
            console.log(err);
        });

    //log output
};


function create_aws_sendEmail_command (emailContent, customerEmail, campaignEventDataId) {

    console.log(customerEmail, campaignEventDataId);

    var emailParams = {
        Destination: {
            ToAddresses: [customerEmail]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: emailContent.body
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: emailContent.subject
            }
        },
        Source: emailContent.sender,
        ConfigurationSetName: 'mailbox_events',
        Tags: [
            {
                Name: 'campaign-id',
                Value: campaignEventDataId
            }
        ]
    };
    //return a function THAT WONT RUN yet. I havent executed it.
    return () => {
        return new Promise((resolve, reject) => {
            return ses.sendEmail(emailParams, (err, data) => {
                if(err) {
                    console.log('error!');
                    console.log(err);
                    reject(err);
                }

                else {
                    console.log('success?');
                    console.log(data);
                    resolve(data);
                }
            });
        });

    };

}


module.exports = { sendEmail };
