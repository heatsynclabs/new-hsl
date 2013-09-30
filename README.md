# HeatSync Labs Website

## Contributing

Fork this repository, clone, implement something, issue a pull request

Since this site uses Node.JS, you'll probably want to install nodejs, npm, and grunt to compile assets properly.

TODO: how to do this with the correct versions?

## CSS

Base CSS is twitter/bootstrap and bootstrap-responsive. __Don't edit those files__

New styles should be added to app.css or a new CSS file that you include in the index.html

To build CSS, run `grunt mincss`

## JS

JavaScript is loaded with AMD, Dojo is used as the loader.

Entry point to the application is js/main.js - put JS code in that file or define a new module (same syntax) and include it as a dependency

To build JS, run `grunt dojo`

## TEMPLATES

Templates are stored in the templates directory

Templates are generated using `lodash` at the command line (`sudo npm install -g lodash`)

They are generated with the command `sudo lodash template="templates/*.jst" exports=amd -o ./js/lodash.templates.js -d`

## SPRITES

Works like crap, not going to document or include as a dependency because things will break