import {instance as sendQueue} from "../database/send-queue";
import {createLogger, LEVEL} from "typescript-common-library/server/debug";
import {senderAddress, transporter, senderName} from "../mail/nodemailer";
import {SendMailOptions} from "nodemailer";
import {instance as emailHistoryModel} from "../database/mail-history";
import {requestJson} from "typescript-common-library/server/communication/request-json";
import {REQUEST_METHOD} from "typescript-common-library/library/request-method";

const debug = createLogger(LEVEL.SILLY, 'SendQueue');
const error = createLogger(LEVEL.ERROR, 'SendQueue');
const info = createLogger(LEVEL.INFO, 'raw');

export function startSendingQueue() {
	setTimeout(asyncSendNext, 1000);
}

function asyncSendNext() {
	setTimeout(() => {
		sendNext().then((c) => {
			if (c) {
				debug('success process %s queued mails.', c);
			}
		}, (e) => {
			error('failed process queued mail: %j', e);
		});
	}, 5000);
}

async function sendNext() {
	const list = await sendQueue.model.find({sent: false,}).limit(3).sort('_id').exec();
	for (let i = list.length - 1; i >= 0; i--) {
		const emailContent = list[i].email;
		const email: SendMailOptions = {
			from: `${senderName} <${senderAddress}>`,
			sender: senderName,
			to: emailContent.to,
			subject: emailContent.subject,
			html: emailContent.html,
		};
		if (emailContent.text) {
			email.text = emailContent.text;
		} else {
			email.text = 'your email client do not support HTML.';
		}
		
		try {
			info('send a mail to %s.', email.to);
			email.messageId = list[i]._id;
			await transporter.sendMail(email);
			debug('send mail has success');
			await emailHistoryModel.createHistory(email);
			await list[i].set({sent: true, success: true}).save();
		} catch (e) {
			error('send mail failed: %j', e);
			await list[i].set({sent: true, success: false,}).save();
		}
		
		try {
			const ret = await requestJson(REQUEST_METHOD.POST, list[i].callback, Object.assign({}, list[i].toJSON()));
			await list[i].set({sent: true, callback_result: ret, callback_called: true}).save();
		} catch (e) {
			error('mail callback failed: %j', e.message);
			await list[i].set({sent: true, success: false, callback_result: disErr(e), callback_called: true}).save();
		}
	}
	setTimeout(asyncSendNext, 5000);
	
	return list.length;
}

function disErr(e) {
	if (e) {
		return (e.message || e);
	} else {
		return '{UnknownError}';
	}
}
