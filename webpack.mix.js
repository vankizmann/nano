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
 * Set public and resource path to root
 */

mix.setPublicPath(
    path.resolve(__dirname)
);

mix.setResourceRoot(
    path.resolve(__dirname)
);


mix.js('src/bootstrap.js', 'dist/js/index.js', {
    // JS options
});

mix.sass('src/bootstrap.scss', 'dist/css/index.css', {
    precision: 3
});
