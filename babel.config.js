module.exports = function (api) {

    api.cache(true);

    const presets = [
        [
            '@babel/preset-env',
            {
                modules: false,
                useBuiltIns: 'usage'
            }
        ],
        [
            "@vue/babel-preset-jsx",
            {
                modules: false,
                useBuiltIns: 'usage'
            }
        ]
    ];

    const plugins= [
        "@vue/babel-plugin-transform-vue-jsx",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-export-default-from"
    ];

    return { presets,  plugins };
};
