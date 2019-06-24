'use strict';

var AWS = require('aws-sdk');
var pify = require('pify');
var isTopicArn = require('is-sns-topic-arn');
var isObject = require('is-obj');
var isPhoneNumber = require('is-e164-phone-number');
var isAwsAccountId = require('is-aws-account-id');

var sns = new AWS.SNS();
var AWS_SNS_Publish = pify(sns.publish.bind(sns));

var isValidTopicName = function isValidTopicName(input) {
	return (/^[\w-]{1,255}$/.test(input)
	);
};

var convertObjectToMessageAttributes = function convertObjectToMessageAttributes(input) {
	var result = {};

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Object.keys(input)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var key = _step.value;

			var value = input[key];
			var parsedValue = '' + value;
			var dataType = 'String';

			if (Array.isArray(value)) {
				dataType = 'String.Array';
				parsedValue = JSON.stringify(value);
			} else if (typeof value === 'number') {
				dataType = 'Number';
			}

			result[key] = {
				DataType: dataType,
				StringValue: parsedValue
			};
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return result;
};

module.exports = function (message, opts) {
	opts = Object.assign({
		region: process.env.AWS_REGION,
		accountId: process.env.AWS_ACCOUNT_ID
	}, opts);

	if (!message) {
		return Promise.reject(new TypeError('Please provide a message'));
	}

	if (!opts.arn && !opts.name && !opts.phone) {
		return Promise.reject(new Error('Please provide an `arn`, `name` or `phone` number'));
	}

	if (opts.phone && !isPhoneNumber(opts.phone)) {
		return Promise.reject(new Error('Provided number `' + opts.phone + '` is not a valid E. 164 phone number'));
	}

	if (!opts.arn && opts.name && !isValidTopicName(opts.name)) {
		return Promise.reject(new Error('Provided topic name `' + opts.name + '` is not valid'));
	}

	if (opts.name && !isAwsAccountId(opts.accountId)) {
		return Promise.reject(new Error('Provide a valid AWS account ID'));
	}

	if (opts.name && !opts.region) {
		return Promise.reject(new Error('Provide a `region`'));
	}

	var params = {
		Message: opts.json !== true && isObject(message) ? JSON.stringify(message) : message
	};

	if (opts.arn) {
		var arnType = isTopicArn(opts.arn) ? 'TopicArn' : 'TargetArn';
		params[arnType] = opts.arn;
	} else if (opts.name) {
		params.TopicArn = 'arn:aws:sns:' + opts.region + ':' + opts.accountId + ':' + opts.name;
	}

	if (opts.phone) {
		params.PhoneNumber = opts.phone;
	}

	if (opts.subject) {
		params.Subject = opts.subject;
	}

	if (opts.attributes) {
		params.MessageAttributes = convertObjectToMessageAttributes(opts.attributes);
	}

	return AWS_SNS_Publish(params).then(function (data) {
		return data;
	});
};