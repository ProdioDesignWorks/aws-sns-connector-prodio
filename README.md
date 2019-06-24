# aws-sns-connector-prodio

> Publish messages to [AWS SNS](https://aws.amazon.com/sns)


## Install

```
$ npm install --save aws-sns-connector-prodio
```

## Environment variables

AWS_REGION: process.env.AWS_REGION,
AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID

You can set environment variable if you dont want to pass the params into the API.



## Usage

```js
const AWS_SNS_Publish = require('aws-sns-connector-prodio');


AWS_SNS_Publish('SMS Message', {name: 'TestTopic', region: 'us-east-1', accountId: '111122223333'}).then(data => {
	console.log(data.messageId);
	//=> '47ff59e2-04e3-11e8-ba89-0ed5f89f718b'
});

AWS_SNS_Publish('SMS Message', {phone: '+14155552671'}).then(data => {
	console.log(data.messageId);
	//=> '6014fe16-26c1-11e7-93ae-92361f002671'
});

AWS_SNS_Publish('Hello World', {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', messageAttributes: {hello: 'world'}}).then(data => {
	console.log(data.messageId);
	//=> 'ef5835d5-8a4b-4e8b-beff-6ccc314d2f6d'
});
```


## API

### AWS_SNS_Publish(message, options)

Returns a promise for the message id of the published message.

#### message

Type: `string` `object`

Message that should be send to the topic.

#### options

##### arn

Type: `string`

Topic or target ARN you want to publish to. The type is automatically detected.

##### name

Type: `string`

Name of the topic ARN you want to publish to. If used, `region` and `accountId` are mandatory.

##### phone

Type: `string`

Phone number to which you want to deliver an SMS message. Use [E.164 format](https://en.wikipedia.org/wiki/E.164).

##### subject

Type: `string`

Subject of the message when delivered to email endpoints.

##### json

Type: `boolean`<br>
Default: `false`

Set to `true` if you want to send a different message for each protocol.

##### region

Type: `string`<br>
Default: `process.env.AWS_REGION`

Region used when constructing the topic ARN when `name` is being used.

##### accountId

Type: `string`<br>
Default: `process.env.AWS_ACCOUNT_ID`

AWS Account Id used when constructing the topic ARN when `name` is being used.

#### attributes

Type: `Object`

Key-value map defining the message attributes of the SNS message.