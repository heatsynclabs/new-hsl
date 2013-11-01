# HeatSync Labs Website

## Contributing

Fork this repository, clone, implement something, issue a pull request

## Requirements

* `node.js >=0.10.21`
* `npm >=1.3.11`

In the project directory, run `npm install` to get development dependencies.

## Building

To build the assets for the site, run `npm run-script build` in the project directory.

# Specifics

## CSS

Base CSS is twitter/bootstrap and bootstrap-responsive. __Don't edit those files__

New styles should be added to app.css or a new CSS file that you include in the index.html

To build CSS, run `grunt cssmin`

## JS

JavaScript is loaded with AMD, Dojo is used as the loader.

Entry point to the application is js/main.js - put JS code in that file or define a new module (same syntax) and include it as a dependency

To build JS, run `grunt dojo`

## TEMPLATES

Templates are stored in the templates directory and use Lo-Dash template syntax.

To compile templates, run `grunt template`
