import { defineConfig } from 'oxlint'
import { configs } from '@naboo/oxc-config/base'

export default defineConfig({
  extends: configs,
  ignorePatterns: ['**/node_modules/**', '**/dist/**', 'apps/**', 'packages/**']
})
