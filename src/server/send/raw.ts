import {transporter, senderAddress} from "../../mail/nodemailer";
import {SendMailOptions} from "nodemailer";
import {createDebug} from "typescript-common-library/server/debug";
import {JsonApiHandler} from "typescript-common-library/server/express/api-handler";
import {ApiResponse, ApiRequest} from "typescript-common-library/server/express/protocol";
import {ERequestType} from "typescript-common-library/server/express/base/types";
import {ValueChecker} from "typescript-common-library/server/value-checker/value-checker";

const debug = createDebug('raw');

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
	console.log(context)
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
	return <any> transporter.sendMail(email).then(() => {
		return {};
	});
});

export default rawSendApi;
