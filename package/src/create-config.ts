///<reference path="../globals.d.ts"/>
import {resolve} from "path";
import {writeFileSync, existsSync} from "fs";
const FILE = resolve(__dirname, '../json');
export let base: string;
export let token: string;

if (process.env.CONFIG_FILE || process.env.JENV_FILE_NAME) {
	const JsonEnv = require("@gongt/jenv-data")();
	base = `email.${JsonEnv.baseDomain}`;
	token = JsonEnv.email.request_key;
	if (process.env.BUILDING === 'yes') {
		writeFileSync(FILE, JSON.stringify({
			base,
			token,
		}), 'utf-8');
	}
} else if (existsSync(FILE)) {
	const config = require(FILE);
	base = config.base;
	token = config.token;
} else {
	throw new Error('[@microduino-private/email-sender] NO CONFIG');
}
