import pluginJs from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import eslintPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{ ignores: ['dist', 'node_modules', 'build'] },
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		extends: [
			pluginJs.configs.recommended,
			...tseslint.configs.recommended,
			eslintPrettier,
		],
	},
	{
		languageOptions: {
			ecmaVersion: 2021,
			globals: globals.browser,
			parser: tsParser,
		},
		rules: {
			'no-console': 'warn',
			'no-debugger': 'warn',
			'prettier/prettier': 'error',
			'@typescript-eslint/no-unused-vars': 'warn',
		},
	}
);
