import {ApiRequest, ApiResponse} from "@gongt/ts-stl-library/request/protocol";
import {ERequestType} from "@gongt/ts-stl-library/request/request";
import {JsonApiHandler} from "@gongt/ts-stl-server/express/api-handler";
import {ValueChecker} from "@gongt/ts-stl-server/value-checker/value-checker";
import {instance as sendQueue} from "../../database/send-queue";
import {EmailStruct} from "../../package";

interface SendBody extends ApiRequest {
	list: (EmailStruct&{callbackId: string})[];
	callback: string;
}
interface QueueResponse extends ApiResponse {
	queued: {[id: string]: string};
	failed: string[];
}
const rawSendApi = new JsonApiHandler<SendBody, QueueResponse>(ERequestType.TYPE_POST, '/send/queue');

const email_checker = new ValueChecker().isObject();
email_checker.field('to').isString().isEmail();
email_checker.field('subject').isString().isNotEmpty();
email_checker.field('html').isString().isNotEmpty();
email_checker.optionalField('text').isString();
email_checker.optionalField('callbackId').isString();
rawSendApi.handleArgument('list').fromPost()
          .filter(new ValueChecker().isArray().min(1).every(email_checker));

rawSendApi.handleArgument('callback').fromPost()
          .filter(new ValueChecker().isString().isURL({
	          protocols: ['http', 'https'],
	          require_protocol: true,
	          require_host: true,
	          require_valid_protocol: true,
          }));

rawSendApi.setHandler(async (context) => {
	const list = context.params.list;
	const result = {}, failed = [];
	for (let i = list.length - 1; i >= 0; i--) {
		const {callbackId, to, subject, html, text,} = list[i];
		try {
			const ret = await sendQueue.appendQueue({to, subject, html, text}, context.params.callback, callbackId);
			rawSendApi.debug('saved');
			result[ret.callback_id] = ret._id;
		} catch (e) {
			failed.push(callbackId);
		}
	}
	
	return {queued: result, failed: failed};
});

export default rawSendApi;
