import {Model, Document, SchemaDefinition} from "mongoose";
import {EmailHistorySchema, IEmailHistoryDoc} from "./mail-history.def";
import {DataModel} from "typescript-common-library/server/database/mongodb";
import {SendMailOptions} from "nodemailer";

export type EmailHistoryModel = IEmailHistoryDoc & Document;
export class EmailHistory extends DataModel<IEmailHistoryDoc> {
	protected createSchema() {
		return EmailHistorySchema;
	}
	
	public createHistory(email: SendMailOptions) {
		return this.create().set('email', email).save();
	}
}

export const instance = new EmailHistory;
