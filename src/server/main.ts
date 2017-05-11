import "./prepare"; // must be first
import {checkMailServer} from "../mail/nodemailer";
import {waitDatabaseToConnect} from "typescript-common-library/server/database/mongodb";
import {bootExpressApp} from "typescript-common-library/server/boot/express-init";
import {createExpressApp, createRouterOn} from "typescript-common-library/server/boot/express-app-builder";
import {resolve} from "path";
import {initServiceWait} from "typescript-common-library/server/boot/init-systemd-service";
import {startSendingQueue} from "./start-sending-queue";

const appCreator = createExpressApp();
appCreator.setServerRootPath(resolve(__dirname, '../../'));
appCreator.setDefaultLogging(':method :url :status - :response-time ms');

const apiRouter = createRouterOn(appCreator, '/api');
apiRouter.registerHandlersFromDir(resolve(__dirname, './send'));
apiRouter.internalProtect();

const app = appCreator.generateApplication();

const initQueue = Promise.all([
	checkMailServer(),
	waitDatabaseToConnect(),
]).then(() => {
	return bootExpressApp(app);
});

initServiceWait(initQueue);
initQueue.then(startSendingQueue);
