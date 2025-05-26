import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import pkg from './package.json' with {type: 'json'};


export default {
	input: 'index.mjs',
	output: [
		{ file: pkg.main, format: 'cjs' },
		{ file: pkg.module, format: 'es' }
	],
	external: [
		'react',
		'react-dom',
		'/node_modules/'
	],
	plugins: [
		nodeResolve({
			extensions: ['.js', '.jsx']
		}),
		babel({
			babelHelpers: 'bundled',
			presets: ['@babel/preset-react'],
			extensions: ['.js', '.jsx']
      	}),
		commonjs(),
		json(),
		replace({
			preventAssignment: false,
			'process.env.NODE_ENV': '"development"'
		}),
	],
};
