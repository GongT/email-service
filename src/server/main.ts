/// <reference path="../../globals.d.ts"/>
import {checkMailServer} from "../mail/nodemailer";
import {waitDatabaseToConnect} from "typescript-common-library/server/database/mongodb";
import {bootExpressApp} from "typescript-common-library/server/boot/express-init";
import {createExpressApp, createRouterOn} from "typescript-common-library/server/boot/express-app-builder";
import {resolve} from "path";

// enableDebugConsoleOnNetwork();

const appCreator = createExpressApp();
appCreator.setServerRootPath(resolve(__dirname, '../../'));
appCreator.setDefaultLogging(':method :url :status - :response-time ms');

const apiRouter = createRouterOn(appCreator, '/api');
apiRouter.registerHandlersFromDir(resolve(__dirname, './send'));
apiRouter.internalProtect(JsonEnv.email.request_key);

const app = appCreator.generateApplication();

Promise.all([
	checkMailServer(),
	waitDatabaseToConnect(),
]).then(() => {
	bootExpressApp(app);
}, (e) => {
	console.error(e);
	process.exit(1);
});
