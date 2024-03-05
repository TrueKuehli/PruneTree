# [The Prune Tree App][prunetree]

[![Open App Link Shield](https://img.shields.io/badge/Open%20Application-prunetree.app-purple?labelColor=blue)][prunetree]
[![GitHub License Shield](https://img.shields.io/github/license/TrueKuehli/PruneTree?label=License)][license-file]
[![Deployment Workflow Shield](https://img.shields.io/github/actions/workflow/status/TrueKuehli/PruneTree/deploy.yml?label=Deployment)][deploy]
[![Validation Workflow Shield](https://img.shields.io/github/actions/workflow/status/TrueKuehli/PruneTree/validation.yml?label=Validation)][validation]

```diff
- THIS PROJECT IS CURRENTLY UNDER DEVELOPMENT AND 
- MAY EXHIBIT BUGS THAT CAN CAUSE DATA LOSS. 
- USE WITH CAUTION.
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

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)][conventional-commits]
[![GitHub Issues Shield](https://img.shields.io/github/issues/TrueKuehli/PruneTree?label=Open%20Issues)][issues]
[![GitHub Pull Requests Shield](https://img.shields.io/github/issues-pr/TrueKuehli/PruneTree?label=Pull%20Requests)][pulls]

Any contributions to the project are welcome, including issues, pull requests, and forks.
If you have any questions or suggestions, feel free to open an issue.

The deployment scripts expects commits to use the [conventional commits][conventional-commits] style to auto-generate
the changelog using [release-please][release-please]. If you're working with a fork of the project and want to directly 
commit your changes to the main branch, you may consider using [commitlint][commitlint] or similar tools to ensure your 
commits are formatted correctly for the automatic changelog generation.

By default, the following commit types are used. Commit types marked as hidden will not be included in the changelog.
```js
[
  {type: 'feat', section: 'Features'},
  {type: 'fix', section: 'Bug Fixes'},
  {type: 'perf', section: 'Performance Improvements'},
  {type: 'revert', section: 'Reverts'},
  {type: 'chore', section: 'Miscellaneous Chores', hidden: true},
  {type: 'docs', section: 'Documentation', hidden: true},
  {type: 'style', section: 'Styles', hidden: true},
  {type: 'refactor', section: 'Code Refactoring', hidden: true},
  {type: 'test', section: 'Tests', hidden: true},
  {type: 'build', section: 'Build System', hidden: true},
  {type: 'ci', section: 'Continuous Integration', hidden: true}
]
```


## Running Your Own Instance

To run the app locally in a development environment, follow these steps:

1. Use `npm install` to install the repo dependencies
2. Run `npm start` to start a local dev server (this may take a minute or two)
3. Go to [http://localhost:8080/](http://localhost:8080/) when the log reads `Compiled successfully.`

We also provide built releases of the app in the [releases section][releases] of this repo, including older versions,
which you can use to host the app yourself.

### Deploying

The workflows in the `.github/workflows` directory are used to automate validation and deployment to GitHub pages.
Validation is run on every push to the `main` branch, ensuring dependencies are up-to-date, the code compiles, 
tests pass, and the code is formatted correctly.

The deployment automatically generates a release pull-request using [release-please][release-please] on each push
to the main branch. This PR includes a changelog of all user-facing changes since the last release. Merging this PR
automatically builds and deploys a new release of the app to GitHub pages. All release files are also uploaded to the
[Releases][releases] page of the repo.

## Attribution

Many thanks to Tobias Gray for creating and maintaining the original [Plum Tree][plumtree] app, 
and for making the source code available for anyone to use.

## Contributors ✨
List of all contributors can be found [here](CONTRIBUTORS.md)

[prunetree]: https://prunetree.app
[license-file]: LICENCE
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
[releases]: https://github.com/TrueKuehli/PruneTree/releases
[deploy]: https://github.com/TrueKuehli/PruneTree/actions/workflows/deploy.yml
[validation]: https://github.com/TrueKuehli/PruneTree/actions/workflows/validation.yml
[conventional-commits]: https://www.conventionalcommits.org/en/v1.0.0/
[commitlint]: https://commitlint.js.org/#/
[release-please]: https://github.com/googleapis/release-please/