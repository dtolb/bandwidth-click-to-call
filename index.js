/* Requirements */
const Bandwidth  = require('node-bandwidth');
const express    = require('express');
const bodyParser = require('body-parser');
let app          = express();
const http       = require('http').Server(app);
const {creds, salesPhoneNumber, bandwidthPhoneNumber} = require('./config.js');

/* Paths */
const INCOMING_CALL = '/incoming-call-endpoint';
const IVR_CHOICE    = '/ivr-choice-endpoint';
const CREATE_CALL = '/createCall';

const bw = new Bandwidth(creds);

const handleCreateCall = async (req, res) => {
    const baseUrl = `http://${req.hostname}`;
    const callbackUrl = baseUrl + INCOMING_CALL;
    const callParameters = {
        to: salesPhoneNumber,
        from: bandwidthPhoneNumber,
        callbackUrl: callbackUrl,
        tag: req.body.customerNumber,
        callbackHttpMethod: 'GET'
    }
    const call = await bw.Call.create(callParameters);
    res.status(201).send(call);
}


/* Event Handlers */
const handleIncomingCall = (req, res) => {
    const sentence = 'Hello, we are transferring your call to the customer';
    const bxml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <SpeakSentence voice="paul" gender="male" locale="en_US">${sentence}</SpeakSentence>
    <Transfer transferTo="${req.query.tag}">
   </Transfer>
</Response>`
    res.send(bxml);
};


/* Express Setup */
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));

app.get('/', (req, res) => {res.send("Hello World")})
app.post(CREATE_CALL, handleCreateCall);
app.get(INCOMING_CALL, handleIncomingCall);

/* Launch the Server */
http.listen(app.get('port'), function(){
    console.log('listening on *:' + app.get('port'));
});