# Changelog

## [1.7.1](https://github.com/TrueKuehli/PruneTree/compare/v1.7.0...v1.7.1) (2024-02-02)


### Bug Fixes

* **guides:** Converted guide videos to yuv420 to fix videos being broken on some devices ([32d1042](https://github.com/TrueKuehli/PruneTree/commit/32d1042e7ec27516bf4054a00da70cea2ab1adbe))

## [1.7.0](https://github.com/TrueKuehli/PruneTree/compare/v1.6.1...v1.7.0) (2024-02-02)


### Features

* **offline:** Added offline support ([38d8228](https://github.com/TrueKuehli/PruneTree/commit/38d82289dc531b69c5918cb48812335d3d845f37))


### Performance Improvements

* **minification:** Scripts and styles are now minified to reduce their size ([38d8228](https://github.com/TrueKuehli/PruneTree/commit/38d82289dc531b69c5918cb48812335d3d845f37))

## [1.6.1](https://github.com/TrueKuehli/PruneTree/compare/v1.6.0...v1.6.1) (2024-01-15)


### Bug Fixes

* **docs:** Updated Support page ([98a233b](https://github.com/TrueKuehli/PruneTree/commit/98a233ba026b30e3cbc32788922c40530a69cbbc))


### Performance Improvements

* **images:** Compressed images used on the Home page and added webp versions which are loaded if supported ([167fb23](https://github.com/TrueKuehli/PruneTree/commit/167fb2346845953d8e2c689935eae4d36f0759c5))

## [1.6.0](https://github.com/TrueKuehli/PruneTree/compare/v1.5.2...v1.6.0) (2024-01-14)


### Features

* **import:** The import feature now supports the original Plum Tree download format. Please report any issues to https://github.com/TrueKuehli/PruneTree/issues/new/choose ([5f39536](https://github.com/TrueKuehli/PruneTree/commit/5f395361f794ce8bf232201ba55ca19029254f3e))


### Bug Fixes

* **import:** Missing attributes are now replace with defaults if missing in a backup ([c27dbf7](https://github.com/TrueKuehli/PruneTree/commit/c27dbf7de4f16d9b5fefed4faa6cde21514aed23))

## [1.5.2](https://github.com/TrueKuehli/PruneTree/compare/v1.5.1...v1.5.2) (2024-01-13)


### Bug Fixes

* **navigation:** Fixed version link not closing the sidebar ([1667a89](https://github.com/TrueKuehli/PruneTree/commit/1667a8903fcf356484fee232af6f0e39fc9a7aec))
* **storage-estimate:** In some cases, Safari seems to try to call the (undefined) navigator?.storage?.estimate() function, causing pages containing the image manager to not render ([2271425](https://github.com/TrueKuehli/PruneTree/commit/227142584c64b4ac180adcb683332dc90d0a8794))

## [1.5.1](https://github.com/TrueKuehli/PruneTree/compare/v1.5.0...v1.5.1) (2024-01-12)


### Bug Fixes

* **import:** The import page no longer gets stuck on the loading screen when selecting an invalid backup zip file ([3f1b141](https://github.com/TrueKuehli/PruneTree/commit/3f1b141a14149e699e7014155bc97a0046c5f100))

## [1.5.0](https://github.com/TrueKuehli/PruneTree/compare/v1.4.0...v1.5.0) (2024-01-12)


### Features

* **download:** Added the ability to download a tree as a zip archive to create backups ([8d0bce9](https://github.com/TrueKuehli/PruneTree/commit/8d0bce93fb65c63943d67c31fe8eed73f9fcc3e9))
* **support:** Added a support page including an FAQ and contact information ([dc06696](https://github.com/TrueKuehli/PruneTree/commit/dc06696c7b66fef926144d98be18766f7d29730f))


### Bug Fixes

* **database:** Tree nodes no longer include all person data ([a17b368](https://github.com/TrueKuehli/PruneTree/commit/a17b368ec455150de724a398e0f9835d8ab407a1))
* **download:** Tree backup filename is now determined from tree title ([763e5d8](https://github.com/TrueKuehli/PruneTree/commit/763e5d8c2b7d8c31e567cdd3f35843ecf1ea3be8))
* **router:** Moving directly from a TreeDetails page to the "Create a Tree" page now refreshes the component ([2e31efd](https://github.com/TrueKuehli/PruneTree/commit/2e31efdfdd8c6b72d41f8c6482228de4ce1144ce))


### Performance Improvements

* **database:** The database no longer queries the entire image database when deleting a tree ([dae12fe](https://github.com/TrueKuehli/PruneTree/commit/dae12fe930e3d4b585e64539d9c370402024266d))

## [1.4.0](https://github.com/TrueKuehli/PruneTree/compare/v1.3.0...v1.4.0) (2023-12-29)


### Features

* **guides:** Reworked Guides ([971ad77](https://github.com/TrueKuehli/PruneTree/commit/971ad778a841f06b4c1d096338d4adc5f846b7c7))
* **storage:** Added storage quota display in the image manager interface ([cce18df](https://github.com/TrueKuehli/PruneTree/commit/cce18df06fa27e122926d4f18f00209ea700d85b))


### Bug Fixes

* **errors:** Fixed handling of storage quota exceeded errors ([b4578d4](https://github.com/TrueKuehli/PruneTree/commit/b4578d4a5f3ef57af8d451f9426de5eb80ff8076))
* **errors:** Fixed multiple error reports when fetching data from multiple components at once ([5bed988](https://github.com/TrueKuehli/PruneTree/commit/5bed988a08ed50b30c08eb04790a7e01d6994786))
* **storage:** The app now request storage persistence from the browser ([aa69d04](https://github.com/TrueKuehli/PruneTree/commit/aa69d04a45b00ea0d9c658c07131e1507ee34727))

## [1.3.0](https://github.com/TrueKuehli/PruneTree/compare/v1.2.2...v1.3.0) (2023-12-25)


### Features

* **version:** Version page now contains a changelog ([bfc29a3](https://github.com/TrueKuehli/PruneTree/commit/bfc29a3462128495d69a6584f3e1e2eb6f0c8623))

## [1.2.2](https://github.com/TrueKuehli/PruneTree/compare/v1.2.1...v1.2.2) (2023-12-25)


### Bug Fixes

* **image-manager:** Fixed bug where submitting a new crop would count as replacing the image, thus marking the image for deletion ([192841c](https://github.com/TrueKuehli/PruneTree/commit/192841cb094bf772c65d8625392c4629a9f60c09))

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
