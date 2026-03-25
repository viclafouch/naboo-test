import {
  importsConfig,
  nextConfig,
  playwrightConfig,
  prettierConfig,
  typescriptConfig
} from '@viclafouch/eslint-config-viclafouch'

/**
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      'eslint.config.mjs',
      'next-env.d.ts',
      'postcss.config.mjs'
    ]
  },
  ...typescriptConfig,
  ...nextConfig,
  ...importsConfig,
  ...playwrightConfig.map((config) => {
    return {
      ...config,
      files: ['e2e/**/*.ts']
    }
  }),
  ...prettierConfig
]
