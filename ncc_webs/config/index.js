const configJSON = require('../config.json');
const buildEntry = require('./buildEntry');
const { exec } = require('child_process');
const { spawn } = require('child_process');

// buildPath是npm参数
let _buildPath;
if (process.env.npm_config_argv) {
	[ , , ..._buildPath ] = JSON.parse(process.env.npm_config_argv).original;
} else {
	[ , , , ..._buildPath ] = process.argv;
}
buildPath = _buildPath.map((e) => e.split('--env.buildPath=')[1]).filter((e) => e);
if (!buildPath.length) {
	buildPath = configJSON.buildEntryPath || './src/*/*/*/*/index.js';
}
let buildWithoutHTML = configJSON.buildWithoutHTML;
buildWithoutHTML && typeof buildWithoutHTML === 'string' && (buildWithoutHTML = [ buildWithoutHTML ]);

// mode是nodeJs参数
let [ , , mode ] = process.argv;

let { entries: hashEntries, plugins: hashPlugins } = buildEntry({ buildPath, buildWithoutHTML, hash: true });
let { entries, plugins } = buildEntry({ buildPath, buildWithoutHTML, hash: false });

if (Object.keys(hashEntries).length) {
	runSpawn(mode, true);
}
if (Object.keys(entries).length) {
	runSpawn(mode, false);
}

function runSpawn(mode, hash) {
	const ls = spawn('node', [
		'--max_old_space_size=8192',
		'node_modules/webpack/bin/webpack.js',
		'--progress',
		'--colors',
		'--config',
		'./config/webpack.prod.config.js',
		`--env.mode=${mode}`,
		`--env.hash=${hash}`,
		...buildPath.map((e) => '--env.buildPath=' + e)
	]);

	ls.stdout.on('data', (data) => {
		if (data.includes('ERROR')) {
			throw new Error(data);
		} else {
			data && console.log(`${data}`);
		}
	});

	ls.stderr.on('data', (data) => {
		if (data.includes('ERROR')) {
			throw new Error(data);
		} else {
			data && console.log(`${data}`);
		}
	});
}
