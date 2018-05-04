# HeatSync Labs Website

## Contributing

Fork this repository, clone, implement something, issue a pull request

## Requirements

* `node.js >=6`
* `npm >=5`

In the project directory, run `npm install` to get development dependencies.

## Building

To build the assets for the site, run `npm run build` in the project directory.

## Running locally

Run `npm run start` in the project directory, then visit http://localhost:1337


## Deploying

Merge your changes into the gh-pages branch and push to Github. (The production branch is no longer used.)

## Under the hood

`npm run build` runs the build script in the package.json file which is currently lint, grunt, and webpack. Grunt builds, minifies and packages all the css, so dont edit anything in the dist file!

##### CSS

Base CSS is twitter/bootstrap and bootstrap-responsive. __Don't edit those files__

New styles should be added to app.css or a new CSS file that you include in the index.html

##### JS

JavaScript is bundled using webpack.

Entry point to the application is src/index.js - put JS code in that file or define a new module (same syntax) and include it as a dependency
