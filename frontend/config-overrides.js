const path = require('path');

module.exports = (config) => {
    config.resolve = {
        alias: {
            '@': path.resolve(__dirname, './src/'),
        },
        extensions: ['.js', '.ts', '.d.ts', '.tsx']
    };

    return config;
};
