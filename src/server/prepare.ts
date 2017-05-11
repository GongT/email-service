/// <reference path="../globals.d.ts"/>
import {initDefaultDatabaseConnection} from "typescript-common-library/server/database/mongodb";
export const defaultDatabaseConnectionString = JsonEnv.DataBaseUrlTemplate.replace('%DATABASE-NAME%', 'DefaultDatabase');
initDefaultDatabaseConnection(defaultDatabaseConnectionString);
