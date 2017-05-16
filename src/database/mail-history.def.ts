import {SchemaDefinition} from "mongoose";
import {MyDocument} from "@gongt/ts-stl-server/database/mongodb";
import {SendMailOptions} from "nodemailer";

export const EmailHistorySchema: SchemaDefinition = {
	_id: String,
	email: Object,
};

export interface IEmailHistoryDoc extends MyDocument {
	_id: string;
	email: SendMailOptions;
}
