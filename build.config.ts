import {MicroBuildHelper} from "./.micro-build/x/microbuild-helper";
import {MicroBuildConfig, ELabelNames, EPlugins} from "./.micro-build/x/microbuild-config";
import {JsonEnv} from "./.jsonenv/_current_result";
declare const build: MicroBuildConfig;
declare const helper: MicroBuildHelper;
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

build.systemdType('notify');
build.systemdWatchdog(10);

build.forceLocalDns();
build.isInChina(JsonEnv.gfw.isInChina, JsonEnv.gfw);
build.npmCacheLayer(JsonEnv.gfw.npmRegistry);
build.npmInstall('./package.json', ['git']);

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

build.listenPort(JsonEnv.email.debugPort);

build.addPlugin(EPlugins.npm_publish, {
	path: './package'
});

build.dockerRunArgument('--dns=${HOST_LOOP_IP}');

build.onConfig((isBuild) => {
	const config = helper.createConfig(`
export const token: string = ${JSON.stringify(JsonEnv.email.request_key)};
`);
	config.save('package/src/cfg.ts');
});
