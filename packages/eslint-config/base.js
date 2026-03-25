import {
  importsConfig,
  prettierConfig,
  typescriptConfig
} from '@viclafouch/eslint-config-viclafouch'

/**
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  { ignores: ['**/node_modules/**', '**/dist/**', 'eslint.config.mjs'] },
  ...typescriptConfig,
  ...importsConfig,
  ...prettierConfig
]
