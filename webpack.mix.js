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

/**
 * Destination folder
 */

let dest = process.env.NODE_ENV === 'production' ?
    'prod/' : 'dist/';

/**
 * Compile files
 */

if ( process.env.NODE_ENV !== 'production' ) {
    mix.sourceMaps();
}

mix.copyDirectory('src/fonts', dest + 'fonts', {
    // Copy options
});

mix.copyDirectory('src/img', dest + 'img', {
    // Copy options
});

mix.js('src/js/bootstrap.js', dest + 'js/index.js', {
    // JS options
});

mix.sass('src/sass/bootstrap.scss', dest + 'css/index.css', {
    precision: 3
});
