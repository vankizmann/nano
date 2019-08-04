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

    // output: {
    //     libraryExport: 'default',
    //     library: 'NANO',
    //     libraryTarget: 'commonjs2'
    // }

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


mix.js('src/nano-test.js', 'dist/js/index.js', {
    //
});

mix.sass('src/nano-ui.scss', 'dist/css/nano-ui.css', {
    precision: 3
});
