module.exports = {
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    transform: {
        '^.+\\.js$': 'babel-jest'
    }
};