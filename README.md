# Plum Tree UI

> Fool me seven times, shame on you. Fool me eight or more times, shame on me.

[React][reactjs] frontend for The Plum Tree.

This repo is simply built using [Webpack][webpack] and served as static assets.

[React Router][reactrouter] is used for navigating between pages, only the
[BrowserRouter][browserrouter] is used (no SSR).

Trees are rendered using [D3][d3], specifically the [tree hierarchy][d3tree].

## Running

To run locally:

1. Use `npm install` to install the repo dependencies
1. Run `npm start` to start a local dev server (this may take a minute or two)
1. Go to [http://localhost:8080/](http://localhost:8080/) when the log reads `Compiled successfully.`

### API configuration

By default any requests to `/api` are proxied to
[http://localhost:3000/](http://localhost:3000/). You can change/configure this
in [webpack.config.js](./webpack.config.js).

## Deploying

All deploys should be done via the [GitLab pipelines][pipeline] for consistency
and accountability.

The Plum Tree uses a [blue/green][bluegreen] deploy mechanism.

By default the validation jobs will run when a pipeline is triggered. To show
the deploy stage a `STACK` variable must be passed. This signify which
environment to deploy to.

Generally we should deploy to a non active color and perform a blue/green flip
once we are happy the deploy was successful. The blue/green flip is done by the
infrastructure repo which updates the CloudFront behavior to point to the new
color.

[reactjs]: https://reactjs.org/
[webpack]: https://webpack.js.org/
[reactrouter]: https://reactrouter.com/
[browserrouter]: https://reactrouter.com/web/api/BrowserRouter
[d3]: https://d3js.org/
[d3tree]: https://github.com/d3/d3-hierarchy#tree
[pipeline]: https://gitlab.com/plum-tree/ui/-/pipelines
[bluegreen]: https://martinfowler.com/bliki/BlueGreenDeployment.html
