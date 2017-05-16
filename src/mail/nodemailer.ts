/// <reference path="../globals.d.ts"/>
import {createTransport} from "nodemailer";
import {createDebug} from "@gongt/ts-stl-server/debug";
const debug = createDebug('mail');

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
