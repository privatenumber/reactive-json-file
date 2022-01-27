import { builtinModules } from 'module';
import { defineConfig } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';

export default [
	defineConfig({
		input: 'src/index.ts',
		plugins: [
			nodeResolve(),
			commonjs(),
			esbuild({
				minify: true,
			}),
		],
		external: builtinModules,
		output: [
			{
				format: 'esm',
				file: 'dist/index.mjs',
			},
			{
				format: 'cjs',
				file: 'dist/index.js',
			},
		],
	}),
	defineConfig({
		input: 'src/index.ts',
		output: {
			file: 'dist/indes.d.ts',
			format: 'esm',
		},
		plugins: [dts()],
	}),
];
