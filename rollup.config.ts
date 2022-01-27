import esbuild from 'rollup-plugin-esbuild';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
	input: 'src/index.ts',
	plugins: [
		nodeResolve(),
		commonjs(),
		esbuild({
			minify: true,
		}),
	],
	output: {
		format: 'esm',
		file: 'dist/index.mjs',
	},
};
