const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let jsExport = {
    mode: "production",
    entry: "./src/index.js",
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
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    externals: {
        vue: {
            root: 'Vue', commonjs: 'vue', commonjs2: 'vue', amd: 'vue'
        }
    },

};

let cssExport = {
    mode: "production",
    entry: "./src/index.scss",
    output: {
        filename: ".ignore.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "index.css"
        })
    ]
};

module.exports = [jsExport, cssExport];