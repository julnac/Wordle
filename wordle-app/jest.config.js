module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Opcjonalnie, jeśli masz specyficzne ścieżki lub inne konfiguracje:
    roots: ['<rootDir>/src', '<rootDir>/test'],
    // testMatch: [
    //   '**/__tests__/**/*.+(ts|tsx|js)',
    //   '**/?(*.)+(spec|test).+(ts|tsx|js)',
    // ],
    // transform: {
    //   '^.+\\.(ts|tsx)$': 'ts-jest',
    // },
};