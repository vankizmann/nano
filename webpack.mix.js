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


mix.js('src/index.js', 'dist/js/index.js', {
    // JS options
});

mix.js('src/index.vue.js', 'dist/js/index.vue.js', {
    // JS options
});

mix.sass('src/vue/bootstrap.scss', 'dist/css/index.vue.css', {
    precision: 3
});
