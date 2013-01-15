# New HSL Website

## Contributing

Fork this repository, clone, implement something, issue a pull request

## CSS

Base CSS is twitter/bootstrap and bootstrap-responsive. __Don't edit those files__

New styles should be added to app.css or a new CSS file that you include in the index.html

## JS

JavaScript is loaded with AMD, Dojo is used as the loader.

Entry point to the application is js/main.js - put JS code in that file or define a new module (same syntax) and include it as a dependency

## TEMPLATES

Templates are stored in the templates directory

Templates are generated using `lodash` at the command line (`sudo npm install -g lodash`)

They are generated with the command `sudo lodash template="templates/*.jst" exports=amd -o ./js/lodash.template.js -d`