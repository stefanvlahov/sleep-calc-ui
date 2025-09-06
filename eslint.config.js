import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'
import tseslint from 'typescript-eslint'
import {globalIgnores} from 'eslint/config'

export default tseslint.config([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommendedTypeChecked,
            tseslint.configs.stylisticTypeChecked,
            reactHooks.configs['recommended-latest'],
            reactX.configs['recommended-typescript'],
            reactDom.configs.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                // Enable the project service for rules requiring type information
                projectService: true,
                // Point to the project's tsconfig files used for type-aware linting
                project: ['./tsconfig.json', './tsconfig.app.json', './tsconfig.node.json'],
                tsconfigRootDir: new URL('.', import.meta.url).pathname,
            },
        },
    },
])
