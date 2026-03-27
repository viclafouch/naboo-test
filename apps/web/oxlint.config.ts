import { defineConfig } from 'oxlint'
import { configs } from '@naboo/oxc-config/next'

export default defineConfig({
  extends: configs,
  ignorePatterns: ['**/.next/**', 'next-env.d.ts', 'postcss.config.mjs']
})
