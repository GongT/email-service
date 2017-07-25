/// <reference path="./.jsonenv/_current_result.json.d.ts"/>
import {JsonEnv} from "@gongt/jenv-data";
import {EPlugins, MicroBuildConfig} from "./.micro-build/x/microbuild-config";
import {MicroBuildHelper} from "./.micro-build/x/microbuild-helper";
declare const build: MicroBuildConfig;
declare const helper: MicroBuildHelper;
/*
 +==================================+
 |  **DON'T EDIT ABOVE THIS LINE**  |
 | THIS IS A PLAIN JAVASCRIPT FILE  |
 |   NOT A TYPESCRIPT OR ES6 FILE   |
 |    ES6 FEATURES NOT AVAILABLE    |
 +==================================+
 */

const projectName = 'email';

build.baseImage('node', 'alpine');
build.projectName(projectName);
build.domainName(projectName + '.' + JsonEnv.baseDomainName);
// build.domainName(projectName + '.' + JsonEnv.baseDomainName);

build.systemdType('notify');
build.systemdWatchdog(30);

build.forceLocalDns();
build.isInChina(JsonEnv.gfw.isInChina, JsonEnv.gfw);
build.npmCacheLayer(JsonEnv.gfw.npmRegistry);
build.npmInstall('./package.json', ['git', 'make', 'g++', 'python']);

build.forwardPort(80, 'tcp');

build.startupCommand('node_modules/.bin/ts-app-loader');
build.environmentVariable('MAIN_FILE', './dist/server/main');
build.shellCommand('/usr/local/bin/node');
// build.stopCommand('stop.sh');

build.addPlugin(EPlugins.jenv);

build.addPlugin(EPlugins.typescript, {
	source: 'src',
	target: 'dist',
});

build.addPlugin(EPlugins.typescript, {
	source: 'src/package',
	target: 'dist/npm-package',
});

build.environmentVariableAppend('DEBUG', ',email:*');
build.listenPort(JsonEnv.email.debugPort);
build.dockerRunArgument('--dns=${HOST_LOOP_IP}');

build.onConfig((isBuild) => {
	if (!isBuild) {
		const r = require('child_process').spawnSync('sh', ['pre-start.sh'], {
			stdio: 'inherit',
			cwd: __dirname,
		});
		if (r.error) {
			throw r.error;
		}
		if (r.status !== 0) {
			process.exit(r.status);
		}
	}
});
