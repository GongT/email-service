/// <reference path="../globals.d.ts"/>
import {initDefaultDatabaseConnection} from "@gongt/ts-stl-server/database/mongodb";
export const defaultDatabaseConnectionString = JsonEnv.DataBaseUrlTemplate.replace('%DATABASE-NAME%', 'DefaultDatabase');
initDefaultDatabaseConnection(defaultDatabaseConnectionString);
