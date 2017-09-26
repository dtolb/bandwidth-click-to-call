<div align="center">

# bandwidth-click-to-call

<img src="https://s3.amazonaws.com/bwdemos/BW_Voice.png"/>

Super simple app to create calls on request using Node and [Express](https://expressjs.com/)

</div>

## Prerequisites
- Configured Machine with Ngrok/Port Forwarding
  - [Ngrok](https://ngrok.com/)
- [Bandwidth Account](https://catapult.inetwork.com/pages/signup.jsf/?utm_medium=social&utm_source=github&utm_campaign=dtolb&utm_content=_)
- [Node v8.0+](https://nodejs.org/en/)
- [Bandwidth Phone Number](http://dev.bandwidth.com/howto/buytn.html)

## Setup Environment Variables

> [How to setup environment variables](https://www.schrodinger.com/kb/1842)

| Environment Variable     | Description                                                                                                               | Example                |
|:-------------------------|:--------------------------------------------------------------------------------------------------------------------------|:-----------------------|
| `BANDWIDTH_USER_ID`      | [Bandwidth USER Id](http://dev.bandwidth.com/security.html)                                                               | `u-123sdaf9834sd`      |
| `BANDWIDTH_API_TOKEN`    | [Bandwidth API Token](http://dev.bandwidth.com/security.html)                                                             | `t-asdg920358askdf`    |
| `BANDWIDTH_API_SECRET`   | [Bandwidth API Secret](http://dev.bandwidth.com/security.html)                                                            | `asdfkljasd2305jsdlkf` |
| `SALES_PHONE_NUBMER`     | Phone number of the sales rep in E.164 format                                                                             | `+19197771111`         |
| `BANDWIDTH_PHONE_NUMBER` | [Bandwidth Phone Number](http://dev.bandwidth.com/howto/buytn.html) to create calls to the sales rep **AND** the customer | `+17041234444`         |

👉 👉 You can also set all these in [`config.js`](https://github.com/dtolb/bandwidth-click-to-call/blob/master/config.js) 👈 👈

```js
module.exports = {
    creds: {
        userId    : process.env.BANDWIDTH_USER_ID,
        apiToken  : process.env.BANDWIDTH_API_TOKEN,
        apiSecret : process.env.BANDWIDTH_API_SECRET
    },
    salesPhoneNumber     : '' || process.env.SALES_PHONE_NUBMER,
    bandwidthPhoneNumber : '' || process.env.BANDWIDTH_PHONE_NUMBER
}
```


## Setup with ngrok

[Ngrok](https://ngrok.com) is an awesome tool that lets you open up local ports to the internet.

Once you have ngrok installed, open a new terminal tab and navigate to it's location on the file system and run:

```bash
./ngrok http 3000
```

You'll see the terminal show you information

![ngrok terminal](https://s3.amazonaws.com/bw-demo/ngrok_terminal.png)

## Run the application

Once you have all your [environment variables](#setup-environment-variables) set.

```bash
npm install
```

```bash
node index.js
```

## Create Your first call

Create a `POST` request to `http://your_ngrok.ngrok.io/createCall`

```http
POST http://8a543f5f.ngrok.io/createCall
Content-Type: application/json

{
	"customerNumber": "+18282941123"
}
```

> Responds

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
    "to": "{{SalesNumber}}",
    "from": "{{BandwidthNumber}}",
    "callbackUrl": "http://your_ngrok.ngrok.io/incoming-call-endpoint",
    "tag": "{{CustomerNubmer}}",
    "callbackHttpMethod": "GET",
    "id": "c-abc123"
}
```

The app will call the `SALES_PHONE_NUBMER` and when that number answers, will forward the call along to the `customerNumber`

### Demo Curl

```bash
curl -v -X POST http://8a543f5f.ngrok.io/createCall \
	-H "Content-type: application/json" \
	-d \
	'
	{
		"customerNumber": "+18282941123"
	}'
```
