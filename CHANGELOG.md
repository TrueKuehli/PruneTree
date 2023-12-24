# Changelog

## 1.2.1

### Features

* Added a Delete button to the image manager, allowing users to remove the current image without uploading a new one

### Bug Fixes

* An empty tree tile / person name now shows up with a placeholder, instead of being blank


## 1.1.0

### Bug Fixes

* Fixed deploy script re-pulling the commit before the version bump before building the project, resulting in the
previous version number being shown in the app
* Images are now deleted whenever a new image is uploaded, overriding the previous image
* Images are now deleted whenever the tree or person is deleted to which the image belonged
* People are now deleted whenever the tree is deleted to which the person belonged

### Chores

* Moved deployment status and test status to the top of the README
* Changed dependency versioning to use `^` instead of `~` or no modifier to allow for minor version updates
* Updated dependencies


## 1.0.1

### Bug Fixes

* Fixed deploy script regression introduced in last version


## 1.0.0

### BREAKING CHANGES

* Migrated code base to use TypeScript, along with new linting rules

### Features

* Implemented image storage for trees and Sims

### Bug Fixes

* Applied React Toastify fix from previous version to the (currently unused) download version of the tree viewer 
to maintain consistency between the files
* Fixed theming issue with the new React Toastify version (requires theme="colored" to avoid contrast issues with
the new icons)

### Chores

* Updated deploy script


## 0.0.2

### Bug Fixes
* Fixed package.json containing an extraneous comma
* Fixed incorrect data being stored on Tree Update
* Fixed issue preventing React Toastify version upgrade

### Chores
* Changed wording referring to the previous project
* Removed unused dependencies
* Updated dependencies


## 0.0.1

### Features

* Initial version of the fork
* Replaced API calls with IndexedDB database calls to allow offline usage
  * This does not include image uploads, which are to be replaced in a later update

### Removed

* Removed Gallery page
* Removed Support page (will return in a later version)
* Removed the ability to share trees
* Removed donation links, sunset note and other now extraneous elements

### Bug Fixes

* Fixed Browser Router not working in GitHub pages deployment (using Hash Router instead)

### Chores

* Renamed project to Prune Tree
* Changed README to reflect fork status
* Moved PR templates to .github folder
* Moved CI over to GitHub actions, implementing automatic deployment to GitHub pages
