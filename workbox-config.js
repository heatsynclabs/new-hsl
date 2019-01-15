module.exports = {
  "globDirectory": "./",
  "globPatterns": [
    "**/*.{css,png,js,eot,svg,ttf,woff,otf,html,ico,json}"
  ],
  "swDest": "dist/sw.js",
  "globIgnores": [
    'node_modules/**/*',
    'src/**/*',
    'webpack.config.js',
    'workbox-config.js',
    'package.json',
    'package-lock.json'
  ]
};
