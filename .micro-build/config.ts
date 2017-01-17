import {MicroBuildConfig, EPlugins} from "./x/microbuild-config";
declare const build: MicroBuildConfig;
/*
 +==================================+
 | <**DON'T EDIT ABOVE THIS LINE**> |
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

build.isInChina(JsonEnv.gfw.isInChina, JsonEnv.gfw);
build.npmCacheLayer(JsonEnv.gfw.npmRegistry);
build.npmInstall('./package.json');

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
	source: 'package/src',
	target: 'package/dist',
});

build.environmentVariableAppend('DEBUG', ',email:*');

// build.volume('/host/folder/path', '/mnt/in/container');

// build.prependDockerFile('/path/to/docker/file');
// build.appendDockerFile('/path/to/docker/file');

const {resolve} = require("path");
const {writeFileSync} = require("fs");
const FILE = resolve(__dirname, '../package/src/config.ts');

build.listenPort(JsonEnv.email.debugPort);

build.addPlugin(EPlugins.npm_publish, {
	path: './package'
});

build.onConfig((isBuild) => {
	let baseDomainWithPort;
	if (isBuild) {
		baseDomainWithPort = 'http://' + projectName + '.' + JsonEnv.baseDomainName;
	} else {
		const port = build.toJSON().port;
		baseDomainWithPort = 'http://127.0.0.1:' + port;
	}
	const config = `
export const base: string = ${JSON.stringify(baseDomainWithPort)};
export const token: string = ${JSON.stringify(JsonEnv.email.request_key)};
`;
	console.log('write config.ts: %s', config);
	writeFileSync(FILE, config.trim(), 'utf-8');
});
