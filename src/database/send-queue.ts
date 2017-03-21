import {Model, Document, SchemaDefinition} from "mongoose";
import {SendQueueSchema, ISendQueueDoc} from "./send-queue.def";
import {DataModel} from "typescript-common-library/server/database/mongodb";

export type SendQueueModel = ISendQueueDoc & Document;
export class SendQueue extends DataModel<ISendQueueDoc> {
	protected createSchema() {
		return SendQueueSchema;
	}
	
	public appendQueue(email: EmailStruct, callback: string, callbackId: string = email.to): Promise<SendQueueModel> {
		const q = this.create();
		q.set('email', email);
		q.set('callback', callback);
		q.set('callback_id', callbackId);
		return q.save();
	}
}

export const instance = new SendQueue();
