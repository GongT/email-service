/// <reference path="./globals.d.ts"/>

import {requestJson} from "./request-wrap";
export interface IEmailSenderOptions {
	projectName: string;
}

export class EmailSender {
	private projectName: string;
	
	constructor(options:IEmailSenderOptions) {
		if(!options){
			throw new Error('no arguments.');
		}
		if(!options.projectName){
			throw new Error('no projectName.');
		}
		this.projectName = options.projectName;
	}
	
	createMail(): Email {
		return new Email(this);
	}
	
	send(email: Email): Promise<void> {
		return requestJson('post', 'api/send/raw', {}, email.toJSON());
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
	
	toJSON() {
		if (!this.to) {
			throw new Error('do not know send to whom');
		}
		
		if (!this.content) {
			throw new Error('must have content');
		}
		if (!this.subject) {
			throw new Error('must have subject');
		}
		
		if(!this.text){
			this.text= 'your email client is not support HTML, please use another client.';
		}
		return {
			to: this.to,
			subject: this.subject,
			html: this.content,
			text: this.text,
		}
	}
}
