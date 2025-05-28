// eslint.config.js
module.exports = [
    {
        files: ['src/api/*.ts'],
        languageOptions: {
            parser: require('@typescript-eslint/parser'),
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
        },
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'semi': ['error', 'always'],
            '@typescript-eslint/no-explicit-any': 'warn',

        },
    },
];