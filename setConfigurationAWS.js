const configurationParams = {
    ConfigurationSet: {
        Name: 'mailbox_events'
    }
};

const eventParams = {
    ConfigurationSetName: 'mailbox_events',
    EventDestination: {
        MatchingEventTypes: ['send','reject','bounce','complaint','delivery','open','click','renderingFailure'],
        Name: 'allEvents',
        Enabled: true,
        SNSDestination: {
            TopicARN: ''
        }
    }
};

const listParams = {
    MaxItems: 0
};

const describeParams = {
    ConfigurationSetName: 'mailbox_events', /* required */
    ConfigurationSetAttributeNames: [
        'eventDestinations','trackingOptions', 'reputationOptions'
    ]
};

ses.createConfigurationSet(configurationParams, (err, data) => {

    console.log('createConfigurationSet');

    if(err) {
        console.log('error!');
        console.log(err.message);
    }

    else {
        console.log('success?');
        console.log(data);
    }

    console.log('-------------------------');
});

ses.createConfigurationSetEventDestination(eventParams, (err, data) => {

    console.log('createConfigurationSetEventDestination');

    if(err) {
        console.log('error!');
        console.log(err.message);
    }

    else {
        console.log('success?');
        console.log(data);
    }

    console.log('-------------------------');
});

ses.listConfigurationSets(listParams, function(err, data) {

    console.log('listConfigurationSets');

    if (err) {

        console.log(err, err.stack);
    }
    else {
        console.log(data);
    }

    console.log('-------------------------');
});

ses.describeConfigurationSet(describeParams, function(err, data) {

    console.log('describeConfigurationSets');

    if (err) {
        console.log(err, err.stack);
    }
    else {
        console.log(data['EventDestinations']);
    }

    console.log('-------------------------');
});
