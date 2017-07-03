import {DataModel} from "@gongt/ts-stl-server/database/mongodb";
import {Document, Model, SchemaDefinition} from "mongoose";
import {EmailStruct} from "../package";
import {ISendQueueDoc, SendQueueSchema} from "./send-queue.def";

export type SendQueueModel = ISendQueueDoc&Document;
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
