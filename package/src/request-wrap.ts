import {token, CONFIG_BASE_DOMAIN_SERVER} from "./cfg";
const request = require("request");

const pkgVersion = require('../package.json').version;
const agent = `nodejs:v${process.version} email-client:v${pkgVersion}`;

export interface RequestApiWrap {
	(method: string, api: string, params: any, body?: any): Promise<void>;
}

export function requestWrap(requestKey: string = token): RequestApiWrap {
	return function requestJson(method: string, api: string, params: any, body?: any): Promise<void> {
		if (params) {
			params = Object.assign({}, params);
		}
		if (body) {
			body = Object.assign({}, body);
		}
		const opt = {
			baseUrl: CONFIG_BASE_DOMAIN_SERVER,
			qs: params, // Object
			json: true,
			method: method,
			headers: {
				'X-Server-Key': requestKey,
				'X-Requested-With': 'XMLHttpRequest',
				'User-Agent': agent,
			},
			body: body,
			maxRedirects: 5,
			encoding: 'utf-8',
			timeout: 10000,
		};
		return new Promise<void>((resolve, reject) => {
			request.post(api, opt, (err, res, body) => {
				return err? reject(err) : resolve(body);
			});
		}).then((s: any) => {
			// console.log('request resolve');
			if (s.status !== 0) {
				return Promise.reject(s);
			}
			return undefined;
		}, (e) => {
			console.error('email-service: fail request: %s', e.message);
			throw e;
		});
	};
}
