// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-plugin-prettier/recommended'
// @ts-ignore
import tailwind from 'eslint-plugin-tailwindcss'

export default withNuxt(prettier, ...tailwind.configs['flat/recommended'])
