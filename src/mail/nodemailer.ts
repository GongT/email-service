import {createLogger} from "@gongt/ts-stl-library/log/debug";
import {LOG_LEVEL} from "@gongt/ts-stl-library/log/levels";
/// <reference path="../globals.d.ts"/>
import {createTransport} from "nodemailer";

const debug = createLogger(LOG_LEVEL.DEBUG, 'mail');

export const senderAddress = JsonEnv.email.senderAddress || JsonEnv.email.mailService.auth.user;
export const senderName = JsonEnv.email.senderName;
export const transporter = createTransport(JsonEnv.email.mailService);
debug('connect mail server with config: %j', JsonEnv.email);

export function checkMailServer(): PromiseLike<any> {
	return new Promise((resolve, reject) => {
		if (JsonEnv.isDebug) {
			return resolve();
		}
		transporter.verify(function (error, success) {
			if (error) {
				debug(transporter);
				debug('failed test mail server: %s', error.message);
				reject(new Error(`mail server configure failed: ${error.message}`));
			} else {
				debug('mail server configure success.');
				resolve();
			}
		});
	});
}
