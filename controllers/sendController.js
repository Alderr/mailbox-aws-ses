const aws = require('aws-sdk');

const secretAccessKey = process.env.SECRETACCESSKEY;
const accessKeyId = process.env.ACCESSKEYID;
const topicARN = process.env.TOPICARN;

const options = {
    secretAccessKey: secretAccessKey,
    accessKeyId: accessKeyId,
    region: 'us-east-1'
};

const ses = new aws.SES(options);

const sendEmail = (req) => {
    //check if stuff in body exists

    //take it out
    const { email_content, list_info, user_email_address, campaign_event_data_id } = req.body;

    //create an arr of promises
    const arrOfPromises = [];

    for (let contact in list_info) {

        const { email_address } = list_info[contact];

        arrOfPromises.push(create_aws_sendEmail_command(email_content, email_address, user_email_address, campaign_event_data_id ));
    }
    //call them

    //log output
};


function create_aws_sendEmail_command (emailContent, customerEmail, senderEmail, campaignEventDataId) {

    console.log(customerEmail, senderEmail, campaignEventDataId);

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
        Source: senderEmail,
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
        new Promise((resolve, reject) => {
            ses.sendEmail(emailParams, (err, data) => {
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
