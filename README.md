# HeatSync Labs Website

## Contributing

Fork this repository, clone, implement something, issue a pull request

## Requirements

* `node.js >=0.10.21`
* `npm >=1.3.11`
* java runtime environment, on osx I needed the old version https://support.apple.com/kb/DL1572?locale=en_US

In the project directory, run `npm install` to get development dependencies.

## Building

To build the assets for the site, run `npm run build` in the project directory.

## Deploying

Merge your changes into the gh-pages branch and push to Github. (The production branch is no longer used.)

## Under the hood

`npm run build` runs the build script in the package.json file which is currently grunt. Grunt builds, minifies and packages all the templates, css, and javascript, so dont edit anything in the dist file!

##### CSS

Base CSS is twitter/bootstrap and bootstrap-responsive. __Don't edit those files__

New styles should be added to app.css or a new CSS file that you include in the index.html

To build CSS, run `grunt cssmin`

##### JS

JavaScript is loaded with AMD, Dojo is used as the loader.

Entry point to the application is js/main.js - put JS code in that file or define a new module (same syntax) and include it as a dependency

To build JS, run `grunt dojo`

##### Templates

Templates are stored in the templates directory and use Lo-Dash template syntax.

To compile templates, run `grunt template`
