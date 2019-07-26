module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testEnvironment: 'jsdom',
    coverageReporters: ['html'],
    coverageDirectory: '<rootDir>/coverage',
    collectCoverageFrom: ['src/**/*.ts']
};
