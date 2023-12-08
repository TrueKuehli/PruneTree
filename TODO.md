- [x] Replace all API calls with IndexedDB transactions
- [ ] Replace image upload with IndexedDB transactions
  - [ ] Detect the remaining storage quota and warn the user if they are close to the limit
  - [ ] Catch storage quota errors
- [ ] Ensure all sunset notes and donation notes are removed
- [x] Remove pages and assets that are unavailable without a server
- [ ] Rename project, replace all references to Plum Tree except for attribution
  - [ ] Replace all references to name pending
- [ ] Rework guides, removing references to any removed features

- [ ] Work on deployment using GitHub pages
  - [ ] Replace Gitlab CI with GitHub actions
  - [ ] Add a `deploy` script to `package.json`, as well as instructions on how to use
  - [ ] Serve using GitHub pages once the repo is public
- [ ] Add contribution guidelines

- [ ] Remove all unused dependencies
- [ ] Replace standard lint with eslint
- [ ] Migrate code to TypeScript 
- [ ] Rework download feature to allow exporting as JSON, as well as the original HTML export
- [ ] Implement requirements for PWA to allow offline usage and installation

- [ ] Improve person linking feature
  - [ ] Allow choosing another tree from a dropdown menu
  - [ ] Allow choosing another person from a dropdown menu
  - [ ] Add feature to import a person from another tree to copy over their data
    - [ ] Optionally link this person to the original person

- [ ] Investigate if re-implement sharing of trees using e.g. imgur and pastebin APIs is feasible and compliant with their terms of service
  - [ ] If so, add a page to import trees from these services
    - [ ] Attach parameters to the URL to autofill these fields
  - [ ] This may necessitate adding some sanitizations, especially for the raw HTML fields
    - [ ] Maybe just replace those entirely with a markdown renderer or similar?
      - [ ] Depending on the state of the project at that point, since this is a breaking change, it may be worth keeping the old way of doing things as a legacy option (but don't allow importing of these legacy fields!)