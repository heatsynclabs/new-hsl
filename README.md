# HeatSync Labs Website

## Contributing

1. Fork this repository
2. Clone locally
3. Implement something
4. Issue a pull request from your forked repo into the `gh-pages` branch on the original repo.

## Requirements

This project uses [Vite](https://vitejs.dev/) to serve and build for production. Vite requires Node.js version 14.18+, 16+. Please upgrade if your package manager warns about it.

In the project directory, run `npm install` to get development dependencies.

## Running locally

Run `npm run dev` in the project directory, then visit http://localhost:5173/

If you've set a local environment variable `VITE_BASE`, visit `http://localhost:5173/<VITE_BASE>`

To create a production build and preview it locally, run `npm run build`, then run `npm run preview` and visit http://localhost:4173/.

If you've set a local environment variable `VITE_BASE`, visit `http://localhost:4173/<VITE_BASE>`

## Deploying to Forked Repository's Github Page

In some cases, such as when you'd like to make it easier for PR reviewers to preview your changes, you may want to deploy a version of the site to your own GitHub page. To do so:

1. Follow GitHub [instructions to create a repository level environment variable](https://docs.github.com/en/actions/learn-github-actions/variables#creating-configuration-variables-for-a-repository). The Name will be `VITE_BASE` and the value will be `/<REPO>/`. Since this repository's name is `new-hsl`, the value would be `/new-hsl/`.

   > You can read why this is necessary [Vite's docs about deploying to a GitHub page](https://vitejs.dev/guide/static-deploy.html#github-pages).

2. Navigate to the repository Settings tab, then Pages under the "Code and automation" section.

3. In the "Build and Deployment" section, select GitHub Actions for the Source.

Now, when you push to the `gh-pages` branch on your forked repo, your changes should automatically deploy to `https://<USERNAME>.github.io/<REPO>/`. If this doesn't happen automatically, be sure to check https://www.githubstatus.com/ to see if GitHub actions are up and running before starting other troubleshooting.

## Linting

Before commiting changes, it is helpful to run `npm run lint` and fix any warnings or errors to ensure your changes match expected coding styles.

## Testing

There are currently no tests.

## Deploying

When your changes are merged into the `gh-pages` branch and pushed to Github, the changes will deploy automatically using GitHub actions. (The production branch is no longer used.)

##### CSS

Base CSS is twitter/bootstrap and bootstrap-responsive. **Don't edit those files**

New styles should be added to app.css or a new CSS file that you include in the relevant html file.

##### JS

There is a /src repo where JavaScript code lives. React component code can go here. There is also some minimalistic scripts in /src/scripts.
