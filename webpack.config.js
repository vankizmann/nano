const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let jsExport = {
    mode: "development",
    entry: ["./src/index.js"],
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

let cssExport = {
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
                    MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
                ]
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