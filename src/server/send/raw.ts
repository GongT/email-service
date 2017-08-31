import {createLogger} from "@gongt/ts-stl-library/log/debug";
import {LOG_LEVEL} from "@gongt/ts-stl-library/log/levels";
import {ApiRequest, ApiResponse} from "@gongt/ts-stl-library/request/protocol";
import {ERequestType} from "@gongt/ts-stl-library/request/request";
import {JsonApiHandler} from "@gongt/ts-stl-server/express/api-handler";
import {ValueChecker} from "@gongt/ts-stl-server/value-checker/value-checker";
import {SendMailOptions} from "nodemailer";
import {instance as emailHistoryModel} from "../../database/mail-history";
import {senderAddress, senderName, transporter} from "../../mail/nodemailer";

const debug = createLogger(LOG_LEVEL.SILLY, 'raw');
const info = createLogger(LOG_LEVEL.INFO, 'raw');

interface SendBody extends ApiRequest, SendMailOptions {
	files?: Express.Multer.File[];
}

const rawSendApi = new JsonApiHandler<SendBody, {}&ApiResponse>(ERequestType.TYPE_POST, '/send/raw');
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
		sender: senderName,
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
	info('send a mail to %s.', email.to);
	debug(email);
	return <any> transporter.sendMail(email).then((e) => {
		debug('mail send success');
		emailHistoryModel.createHistory(email);
		context.response.success();
	}, (e) => {
		debug('mail send failed', e);
		return Promise.reject(e);
	});
});

export default rawSendApi;
