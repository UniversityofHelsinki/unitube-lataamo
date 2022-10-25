module.exports = {
    'env': {
        'node': true,
        'browser': true,
        'es6': true,
        'jest/globals': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 11,
        'sourceType': 'module'
    },
    'plugins': [
        'react', 'jest'
    ],
    'rules': {
        'indent': [2, 4],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-constant-condition': [
            'error',
            { 'checkLoops': false }
        ],
        'eqeqeq': 'error',
        'no-unused-vars': 'off',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [
            'error', 'always'
        ],
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ],
        'no-console': 0,
        'react/prop-types': 0
    }
};
