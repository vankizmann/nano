/**
 * Webpack / Mix configuration file
 */

let mix = require('laravel-mix');
let path = require('path');


/**
 * Do default configuration
 */

mix.options({
    clearConsole: true,
    processCssUrls: false
});

/**
 * Webpack configuration
 */

mix.webpackConfig({

    externals: {
        "vue": "Vue"
    },

    output: {
        libraryTarget: "umd"
    }

});

/**
 * Set public and resource path to root
 */

mix.setPublicPath(
    path.resolve(__dirname)
);

mix.setResourceRoot(
    path.resolve(__dirname)
);


mix.js('src/nano-js.js', 'dist/js/nano-js.js', {
    // JS options
});

mix.js('src/nano-ui.js', 'dist/js/nano-ui.js', {
    // JS options
});

mix.sass('src/nano-ui.scss', 'dist/css/nano-ui.css', {
    precision: 3
});
