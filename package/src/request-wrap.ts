import {base, token} from "./config";
const request = require("request");

const pkgVersion = require('../package.json').version;
const agent = `nodejs:v${process.version} email-client:v${pkgVersion}`;

export function requestJson(method: string, api: string, params: any, body?: any): Promise<void> {
	if (params) {
		params = Object.assign({}, params);
	}
	if (body) {
		body = Object.assign({}, body);
	}
	const opt = {
		baseUrl: base,
		qs: params, // Object
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
	return new Promise<void>((resolve, reject) => {
		const wrappedCallback = (err, data) => err? reject(err) : resolve(data);
		console.log(api, opt);
		request.post(api, opt, wrappedCallback)
	}).then((s: any) => {
		console.log('request resolve');
		if (s.status !== 0) {
			return Promise.reject(s);
		}
		return undefined;
	}, (e) => {
		console.error('email-service: send mail fail [in prefix request]: %s', e.message);
		throw e;
	});
}
