import {senderAddress, transporter} from "../../mail/nodemailer";
import {SendMailOptions} from "nodemailer";
import {createDebug, LEVEL} from "typescript-common-library/server/debug";
import {JsonApiHandler} from "typescript-common-library/server/express/api-handler";
import {ApiResponse, ApiRequest} from "typescript-common-library/server/express/protocol";
import {ERequestType} from "typescript-common-library/server/express/base/types";
import {ValueChecker} from "typescript-common-library/server/value-checker/value-checker";
import {serverRequestOnly} from "typescript-common-library/server/safe/server-request-only";
import {instance as emailHistoryModel} from "../../database/mail-history";

const debug = createDebug('raw', LEVEL.SILLY);

interface SendBody extends ApiRequest {
	to: string;
	subject: string;
	text?: string;
	html: string;
	files?: Express.Multer.File[]
}
const rawSendApi = new JsonApiHandler<SendBody ,{} & ApiResponse>(ERequestType.TYPE_POST, '/send/raw');
rawSendApi.handleArgument('to').fromPost()
          .filter(new ValueChecker().isString().isEmail());
rawSendApi.handleArgument('subject').fromPost()
          .filter(new ValueChecker().isString().isNotEmpty());
rawSendApi.handleArgument('text').fromPost().optional('')
          .filter(new ValueChecker().isString().isNotEmpty());
rawSendApi.handleArgument('html').fromPost()
          .filter(new ValueChecker().isString().isNotEmpty());
rawSendApi.setAsyncHandler((context) => {
	const email: SendMailOptions = {
		from: senderAddress,
		to: context.params.to,
		subject: context.params.subject,
		html: context.params.html,
	};
	if (context.params.text) {
		email.text = context.params.text;
	}
	
	const files = context.params.files;
	if (files && files.length) {
		email.attachments = files.map((file) => {
			return {
				filename: file.originalname,
				path: file.destination,
				content: null,
				contentType: file.mimetype,
			};
		});
	}
	debug(email);
	return <any> transporter.sendMail(email).then((e) => {
		emailHistoryModel.createHistory(email);
		context.response.success();
	}, (e) => {
		return Promise.reject(e);
	});
});

export default rawSendApi;
