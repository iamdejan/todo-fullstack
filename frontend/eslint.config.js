import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import stylisticJs from '@stylistic/eslint-plugin-js'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic/js': stylisticJs,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-multi-spaces': 'error',
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/semi': 'error',
      '@stylistic/js/quotes': ['error', 'double', { "avoidEscape": true }],
      '@stylistic/js/eol-last': 'error',
      '@stylistic/js/no-multiple-empty-lines': ['error', {"max": 1}],
      '@stylistic/js/no-tabs': 'error',
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    },
  },
)
