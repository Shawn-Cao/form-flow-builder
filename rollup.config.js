import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import pkg from './package.json' with {type: 'json'};


export default [
	// all inclusive bundle. For clients with tree-shaking setup
	{
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
	},
	// react build
	{
		input: 'lib/react/form-ui-react.js',
		output: [
			{ file: 'react.cjs', format: 'cjs' },
			{ file: 'react.js', format: 'es' }
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
	},
	// plain HTML build
	{
		input: 'lib/html/form-ui-html.js',
		output: [
			{ file: 'html.cjs', format: 'cjs' },
			{ file: 'html.js', format: 'es' }
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
	},
];
