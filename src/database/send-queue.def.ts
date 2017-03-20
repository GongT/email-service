import {SchemaDefinition} from "mongoose";
import {MyDocument} from "typescript-common-library/server/database/mongodb";

export const SendQueueSchema: SchemaDefinition = {
	_id: String,
	email: Object,
	callback: String,
	sent: {
		type: Boolean,
		default: false,
	},
	success: {
		type: Boolean,
		default: false,
	},
};

export interface ISendQueueDoc extends MyDocument {
	_id: string;
	email: EmailStruct;
	callback: string,
	sent: boolean,
	success: boolean,
}