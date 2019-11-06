const path = require('path');
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let jsExtVueExport = {
    mode: "development",
    entry: ["./src/index.js"],
    output: {
        filename: "index.esm.js",
        path: path.resolve(__dirname, "dist"),
        library: "Nano",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /.js$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loader: 'babel-loader',
                options: {
                    configFile: path.resolve('./babel.config.js')
                },
            }
        ]
    },
    externals: {
        'vue': {
            root: 'Vue', commonjs: 'vue', commonjs2: 'vue', amd: 'vue'
        },
        'velocity-animate': {
            root: 'Velocity', commonjs: 'velocity-animate', commonjs2: 'velocity-animate', amd: 'velocity-animate'
        }
    },
};

let jsWinVueExport = {
    mode: "development",
    entry: ["@babel/polyfill", "./src/index.js"],
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
        library: "Nano",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /.js$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loader: 'babel-loader',
                options: {
                    configFile: path.resolve('./babel.config.js')
                },
            }
        ]
    },
    externals: {
        'vue': {
            root: 'Vue', commonjs: 'vue', commonjs2: 'vue', amd: 'vue'
        },
        'velocity-animate': {
            root: 'Velocity', commonjs: 'velocity-animate', commonjs2: 'velocity-animate', amd: 'velocity-animate'
        }
    },
};

let jsExtEssentialExport = {
    mode: "development",
    entry: ["./src/index.essential.js"],
    output: {
        filename: "index.essential.esm.js",
        path: path.resolve(__dirname, "dist"),
        library: "Nano",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /.js$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loader: 'babel-loader',
                options: {
                    configFile: path.resolve('./babel.config.js')
                },
            }
        ]
    },
    externals: {
        'velocity-animate': {
            root: 'Velocity', commonjs: 'velocity-animate', commonjs2: 'velocity-animate', amd: 'velocity-animate'
        }
    },
};

let jsWinEssentialExport = {
    mode: "development",
    entry: ["@babel/polyfill", "./src/index.essential.js"],
    output: {
        filename: "index.essential.js",
        path: path.resolve(__dirname, "dist"),
        library: "Nano",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /.js$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loader: 'babel-loader',
                options: {
                    configFile: path.resolve('./babel.config.js')
                },
            }
        ]
    },
    externals: {
        'velocity-animate': {
            root: 'Velocity', commonjs: 'velocity-animate', commonjs2: 'velocity-animate', amd: 'velocity-animate'
        }
    },
};

let cssModernExport = {
    mode: "development",
    entry: "./src/index.scss",
    output: {
        filename: ".ignore.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "index.css"
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [ autoprefixer() ]
            }
        })
    ]
};

let cssLegacyExport = {
    mode: "development",
    entry: ["./src/index.legacy.scss"],
    output: {
        filename: ".ignore.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "index.legacy.css"
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [ autoprefixer() ]
            }
        })
    ]
};

module.exports = [
    jsWinVueExport, jsExtVueExport,
    jsWinEssentialExport, jsExtEssentialExport,
    cssModernExport, cssLegacyExport
];