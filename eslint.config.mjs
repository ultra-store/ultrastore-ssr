import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { importX, flatConfigs as importXFlatConfigs } from 'eslint-plugin-import-x'
import noRelativeImports from 'eslint-plugin-no-relative-import-paths'
import * as tsResolver from 'eslint-import-resolver-typescript'
import { configs as tsConfigs, parser as tsParser, plugin as tsPlugin } from 'typescript-eslint'

export default [
  {
    ignores: ['**/dist/*', '**/node_modules/*', '**/public/*'],
  },

  eslint.configs.recommended,
  ...tsConfigs.recommended,
  ...tsConfigs.stylistic,
  importXFlatConfigs.recommended,
  importXFlatConfigs.typescript,
  stylistic.configs.recommended,

  {
    files: ['src/**/*'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        createDefaultProgram: true,
        projectService: ['**/tsconfig.json'],
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      '@stylistic': stylistic,
      'import-x': importX,
      'no-relative-import-paths': noRelativeImports,
    },

    settings: {
      'import-x/resolver': {
        name: 'tsResolver',
        resolver: tsResolver,
      },
    },

    rules: {
      'curly': ['error', 'all'],

      // Stylistic
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/max-len': ['error', { code: 120, ignoreStrings: true }],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: '*', next: ['interface', 'type'] },
      ],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/object-property-newline': 'error',
      '@stylistic/object-curly-newline': ['error', { minProperties: 1 }],
      '@stylistic/curly-newline': ['error', 'always'],
      '@stylistic/array-element-newline': ['error', 'consistent'],
      '@stylistic/array-bracket-newline': ['error', 'consistent'],

      // TypeScript
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: true, fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',

      // Imports
      'no-relative-import-paths/no-relative-import-paths': ['warn', { allowSameFolder: true }],
      'import-x/first': 'error',
      'import-x/newline-after-import': 'off',
      'import-x/no-default-export': 'off',
      'import-x/no-duplicates': 'error',
      'import-x/no-unresolved': 'error',
      'import-x/prefer-default-export': 'off',
      'import-x/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
          'alphabetize': { order: 'asc', orderImportKind: 'asc' },
          'warnOnUnassignedImports': true,
          'pathGroups': [
            { pattern: 'react', group: 'builtin', position: 'before' },
            { pattern: './**/*.css', group: 'index', position: 'after' },
            { pattern: 'src/**', group: 'internal', position: 'before' },
          ],
          'newlines-between': 'always-and-inside-groups',
          'pathGroupsExcludedImportTypes': ['react'],
        },
      ],
    },
  },
]
