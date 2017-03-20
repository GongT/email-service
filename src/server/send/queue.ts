import {JsonApiHandler} from "typescript-common-library/server/express/api-handler";
import {ApiResponse, ApiRequest} from "typescript-common-library/server/express/protocol";
import {ERequestType} from "typescript-common-library/server/express/base/types";
import {ValueChecker} from "typescript-common-library/server/value-checker/value-checker";
import {instance as sendQueue} from "../../database/send-queue";

interface SendBody extends ApiRequest {
	list: EmailStruct[];
	callback: string;
}
const rawSendApi = new JsonApiHandler<SendBody ,{} & ApiResponse>(ERequestType.TYPE_POST, '/send/queue');

const email_checker = new ValueChecker().isObject();
email_checker.field('to').isString().isEmail();
email_checker.field('subject').isString().isNotEmpty();
email_checker.field('html').isString().isNotEmpty();
email_checker.optionalField('text').isString();
rawSendApi.handleArgument('list').fromPost()
          .filter(new ValueChecker().isArray().min(1).every(email_checker));

rawSendApi.handleArgument('callback').fromPost()
          .filter(new ValueChecker().isString().isURL({
	          protocols: ['http', 'https'],
	          require_protocol: true,
	          require_host: true,
	          require_valid_protocol: true,
          }));

rawSendApi.setHandler(async(context) => {
	const list = context.params.list;
	const result = [];
	for (let i = list.length - 1; i >= 0; i--) {
		const ret = await sendQueue.appendQueue(list[i], context.params.callback);
		rawSendApi.debug('saved: ', ret);
		result.push(ret);
	}
	
	return {queued: result,};
});

export default rawSendApi;
