module.exports = {
  "globDirectory": "./",
  "globPatterns": [
    "**/*.{css,png,js,eot,svg,ttf,woff,otf,html,ico}"
  ],
  "swDest": "dist/sw.js",
  "globIgnores": [
    'node_modules/**/*',
    'deps/**/*',
    'src/**/*',
    'webpack.config.js',
    'Gruntfile.js',
    'workbox-config.js'
  ]
};
