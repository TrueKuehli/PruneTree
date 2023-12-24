# [The Prune Tree App][prunetree]

[![Open App Link Shield](https://img.shields.io/badge/Open%20Application-prunetree.app-purple?labelColor=blue)][prunetree]
[![GitHub License Shield](https://img.shields.io/github/license/TrueKuehli/PruneTree?label=License)](LICENCE)
[![Deployment Workflow Shield](https://img.shields.io/github/actions/workflow/status/TrueKuehli/PruneTree/deploy.yml?label=Deployment)][deploy]
[![Validation Workflow Shield](https://img.shields.io/github/actions/workflow/status/TrueKuehli/PruneTree/validation.yml?label=Validation)][validation]

```diff
- THIS PROJECT IS CURRENTLY IN VERY EARLY DEVELOPMENT AND IS NOT READY FOR USE OUTSIDE OF TESTING.
```

Fork of the [Plum Tree][plumtree] app _pruning_ API calls from the [front-end][frontend] code
and replacing them with local browser storage.
This offers a replacement for the base features of the original app, while allowing the app to be deployed using 
only static assets.

The app itself is built on the [React][reactjs] framework with replacements to the server API 
utilizing an [IndexedDB][indexeddb] in-browser database. 
The build system uses [Webpack][webpack] to bundle the app as static assets.

[React Router][reactrouter] is used for navigating between pages, only the
[BrowserRouter][browserrouter] is used (no SSR).

Trees are rendered using [D3][d3], specifically the [tree hierarchy][d3tree].

## Contributing

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](conventional-commits)
[![GitHub Issues Shield](https://img.shields.io/github/issues/TrueKuehli/PruneTree?label=Open%20Issues)][issues]
[![GitHub Pull Requests Shield](https://img.shields.io/github/issues-pr/TrueKuehli/PruneTree?label=Pull%20Requests)][pulls]

Any contributions to the project are welcome, including issues, pull requests, and forks.
If you have any questions, feel free to open an issue.

The deployment scripts expects commits to use the [conventional commits](conventional-commits) style to auto-generate
the changelog. This does not affect pull requests, which use the available tags for determining the type of change.
However, if you're working with a fork of the project and want to directly commit your changes, you may consider using
[commitlint](commitlint) or similar tools to ensure your commits are formatted correctly for the
automatic changelog generation.


## Running Your Own Instance

To run the app locally in a development environment, follow these steps:

1. Use `npm install` to install the repo dependencies
2. Run `npm start` to start a local dev server (this may take a minute or two)
3. Go to [http://localhost:8080/](http://localhost:8080/) when the log reads `Compiled successfully.`

### Deploying

The workflows in the `.github/workflows` directory are used to automate validation and deployment to GitHub pages.
Validation is run on every push to the `main` branch, ensuring dependencies are up-to-date, the code compiles, 
tests pass, and the code is formatted correctly.

Deployment is run manually from the GitHub Actions tab, and will deploy the current `main` branch to GitHub pages.

## Attribution

Many thanks to Tobias Gray for creating and maintaining the original [Plum Tree][plumtree] app, 
and for making the source code available for anyone to use.


[prunetree]: https://prunetree.app
[plumtree]: https://gitlab.com/plum-tree/
[frontend]: https://gitlab.com/plum-tree/ui
[pwa]: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
[reactjs]: https://reactjs.org/
[indexeddb]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
[webpack]: https://webpack.js.org/
[reactrouter]: https://reactrouter.com/
[browserrouter]: https://reactrouter.com/web/api/BrowserRouter
[d3]: https://d3js.org/
[d3tree]: https://github.com/d3/d3-hierarchy#tree
[issues]: https://github.com/TrueKuehli/PruneTree/issues
[pulls]: https://github.com/TrueKuehli/PruneTree/pulls
[deploy]: https://github.com/TrueKuehli/PruneTree/actions/workflows/deploy.yml
[validation]: https://github.com/TrueKuehli/PruneTree/actions/workflows/validation.yml
[conventional-commits]: https://www.conventionalcommits.org/en/v1.0.0/
[commitlint]: https://commitlint.js.org/#/
