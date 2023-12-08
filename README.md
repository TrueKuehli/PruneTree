# Plum Tree UI

Fork of the now discontinued [Plum Tree][plumtree] app based on the [front-end][frontend] code. 
The primary goal of this repository is to replace any reliance on servers with local browser storage.
This offers a replacement for the base features of the original app, but lacks the ability to share trees.
On a technical side however, this allows the app to be deployed using only static assets, allowing 
free hosting services like GitHub pages. 
A further goal of the project is to enable offline usage of the application as a [Progressive Web App][pwa].

The app itself is built on the [React][reactjs] framework with replacements to the server API 
utilizing an [IndexedDB][indexeddb] in-browser database. 
The build system uses [Webpack][webpack] to bundle the app as static assets.

[React Router][reactrouter] is used for navigating between pages, only the
[BrowserRouter][browserrouter] is used (no SSR).

Trees are rendered using [D3][d3], specifically the [tree hierarchy][d3tree].

## Running

To run locally:

1. Use `npm install` to install the repo dependencies
2. Run `npm start` to start a local dev server (this may take a minute or two)
3. Go to [http://localhost:8080/](http://localhost:8080/) when the log reads `Compiled successfully.`

## Deploying

TODO:
- Serve using GitHub pages once the repo is public
- Add a `deploy` script to `package.json`, as well as instructions on how to use

## Contributing

Any contributions to the project are welcome, including issues, pull requests, and forks. 
If you have any questions, feel free to open an issue.

## Attribution

Many thanks to Tobias Gray for creating the original and maintaining the original Plum Tree app for many years, and for making the source code available for anyone to use.


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
