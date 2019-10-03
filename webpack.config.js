const path = require('path');
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");



let jsExtExport = {
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
        vue: {
            root: 'Vue', commonjs: 'vue', commonjs2: 'vue', amd: 'vue'
        }
    },
};

let jsWinExport = {
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
        vue: {
            root: 'Vue', commonjs: 'vue', commonjs2: 'vue', amd: 'vue'
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

module.exports = [jsWinExport, jsExtExport, cssModernExport, cssLegacyExport];