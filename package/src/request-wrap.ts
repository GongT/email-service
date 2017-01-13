/// <reference types="request" />
import {base, token} from "create-config";
const request = require("request");

const pkgVersion = require('../package.json').version;
const agent = `nodejs:v${process.version} email-client:v${pkgVersion}`;

function requestJson(method: string, api: string, params: any, body?: any) {
	if (params) {
		params = Object.assign({}, params);
	}
	if (body) {
		body = Object.assign({}, body);
	}
	const opt = {
		baseUrl: base,
		formData: params, // Object
		json: true,
		method: method,
		headers: {
			'x-request-key': token,
			'User-Agent': agent,
		},
		body: body,
		maxRedirects: 5,
		encoding: 'utf-8',
		timeout: 10000,
	};
	return request(api, opt);
}
function requestRaw(method: string, api: string, params: any, body?: any) {
	if (params) {
		body = Object.assign({}, params);
	}
	if (body) {
		body = Object.assign({}, body);
	}
	const opt = {
		baseUrl: base,
		formData: params, // Object
		json: true,
		method: method,
		headers: {
			'x-request-key': token,
			'User-Agent': agent,
		},
		body: body,
		maxRedirects: 5,
		encoding: 'utf-8',
		timeout: 10000,
	};
	return request(api, opt);
}
