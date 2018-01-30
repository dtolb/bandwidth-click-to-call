/* Requirements */
const Bandwidth  = require('node-bandwidth');
const express    = require('express');
const bodyParser = require('body-parser');
let app          = express();
const http       = require('http').Server(app);

/* Config variables */
const {creds, salesPhoneNumber, bandwidthPhoneNumber} = require('./config.js');

/* new SDK */
const bw = new Bandwidth(creds);

/* Paths */
const OUTBOUND_CALL_EVENTS = '/outbound-call-events';
const CREATE_CALL   = '/createCall';

/* Event Handlers */
const handleCreateCall = async (req, res) => {
    const baseUrl = `http://${req.hostname}`;
    const callbackUrl = baseUrl + OUTBOUND_CALL_EVENTS;
    const callParameters = {
        to                 : salesPhoneNumber,
        from               : bandwidthPhoneNumber,
        callbackUrl        : callbackUrl,
        tag                : req.body.customerNumber,
        callbackHttpMethod : 'GET'
    }
    /* create the call to bandwidth */
    const call = await bw.Call.create(callParameters);
    res.status(201).send(call);
}

const handleIncomingCall = (req, res) => {
    // We only care about answer events
    if (req.query.eventType !== 'answer') {
        res.sendStatus(200);
        return;
    }
    const sentence = 'Hello, we are transferring your call to the customer';
    const bxml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <SpeakSentence voice="paul" gender="male" locale="en_US">${sentence}</SpeakSentence>
    <Transfer transferTo="${req.query.tag}">
   </Transfer>
</Response>`
    res.send(bxml);
};


const handleIncomingCallUsingSDK = (req, res) => {
    // We only care about answer events
    if (req.query.eventType !== 'answer') {
        res.sendStatus(200);
        return;
    }
    const sentence = 'Hello, we are transferring your call to the customer';
    let bxml = new Bandwidth.BXMLResponse();
    bxml.speakSentence(sentence)
        .transfer({
            transferTo: req.query.tag
        });

    res.send(bxml.toString());
};


/* Express Setup */
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));

app.get('/', (req, res) => {res.send("Hello World")})
app.post(CREATE_CALL, handleCreateCall);
app.get(OUTBOUND_CALL_EVENTS, handleIncomingCall);
//app.get(OUTBOUND_CALL_EVENTS, handleIncomingCallUsingSDK);

/* Launch the Server */
http.listen(app.get('port'), function(){
    console.log('listening on *:' + app.get('port'));
});