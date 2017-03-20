import {instance as sendQueue} from "../database/send-queue";
import {createLogger, LEVEL} from "typescript-common-library/server/debug";

const debug = createLogger(LEVEL.SILLY, 'SendQueue');

export function startSendingQueue() {
	setTimeout(function () {
		const p = sendQueue.model.find({sent: false,}).limit(3).sort('_id').exec();
		p.then((list) => {
			debug('%s: ', typeof list, list)
		});
	}, 5000);
}
