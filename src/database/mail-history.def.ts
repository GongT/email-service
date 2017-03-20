import {SchemaDefinition} from "mongoose";
import {MyDocument} from "typescript-common-library/server/database/mongodb";
import {SendMailOptions} from "nodemailer";

export const EmailHistorySchema: SchemaDefinition = {
	_id: String,
	email: Object,
};

export interface IEmailHistoryDoc extends MyDocument {
	_id: string;
	email: SendMailOptions;
}
