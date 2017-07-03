import {RequestApiWrap, requestWrap} from "./request-wrap";
export interface IEmailSenderOptions {
	projectName: string;
	requestToken?: string;
	serverUrl?: string;
}

export interface EmailStruct { // Must equals to /sed/raw api params
	to: string;
	subject: string;
	html: string;
	text?: string;
}

function tryGuessServer(options: IEmailSenderOptions) {
	try {
		const {JsonEnv} = require('@gongt/jenv-data');
		if (!options.requestToken) {
			options.requestToken = JsonEnv.serverRequestKey;
		}
		if (!options.serverUrl) {
			options.serverUrl = JsonEnv.email['apiEndPoint'] || 'http://email.' + JsonEnv.baseDomainName;
		}
	} catch (e) {
	}
}

export class EmailSender {
	private projectName: string;
	
	private api: RequestApiWrap;
	
	constructor(options: IEmailSenderOptions) {
		if (!options) {
			throw new Error('no arguments.');
		}
		if (!options.projectName) {
			throw new Error('no projectName.');
		}
		
		if (!options.requestToken || !options.serverUrl) {
			tryGuessServer(options);
		}
		if (!options.requestToken) {
			throw new Error('email-sender: no requestToken provided.');
		}
		if (!options.serverUrl) {
			throw new Error('email-sender: can not find serverUrl.');
		}
		
		this.api = requestWrap(options.serverUrl, options.requestToken);
		this.projectName = options.projectName;
	}
	
	createMail(): Email {
		return new Email(this);
	}
	
	send(email: Email): Promise<void> {
		if (!(email instanceof Email)) {
			throw new TypeError('email-service:send require an email object, not others.')
		}
		return this.api('post', 'api/send/raw', {}, email.toJSON());
	}
}
export class Email {
	public to: string;
	
	public subject: string;
	public content: string;
	
	// optional
	public text?: string;
	
	private build: EmailSender;
	
	constructor(build: EmailSender) {
		this.build = build;
	}
	
	send() {
		return this.build.send(this);
	}
	
	toJSON(): EmailStruct {
		if (!this.to) {
			throw new Error('do not know send to whom');
		}
		
		if (!this.content) {
			throw new Error('must have content');
		}
		if (!this.subject) {
			throw new Error('must have subject');
		}
		
		if (!this.text) {
			this.text = 'your email client is not support HTML, please use another client.';
		}
		return {
			to: this.to,
			subject: this.subject,
			html: this.content,
			text: this.text,
		};
	}
}
