# Contributing to The Prune Tree App

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and 
details about how this project handles them. Please make sure to read the relevant section before making your 
contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The 
community looks forward to your contributions. 🎉

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to 
  support the project and show your appreciation, which we would also be very happy about:
> - Star the project
> - Share the project online
> - Tell your friends/colleagues

## Table of Contents

- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Improving The Documentation](#improving-the-documentation)
- [Styleguides](#styleguides)
- [Commit Messages](#commit-messages)



## I Have a Question

> If you want to ask a question, we assume that you have read the available [guides][guides] on
  how to use the app.

Before you ask a question, it is best to search for existing [Issues][issues] 
that might help you. In case you have found a suitable issue and still need clarification, you can write your question 
in this issue.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue][new-issue].
- Choose the `Question` template.
- Provide as much context as you can about what you're running into.
- Provide app version (shown at the bottom of the app sidebar) and platform versions (desktop / mobile, browser etc.), 
  depending on what seems relevant.

We will then take care of the issue as soon as possible.

## I Want To Contribute

<!-- omit in toc -->
> ### Legal Notice
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the 
  necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

<!-- omit in toc -->
#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to 
investigate carefully, collect information and describe the issue in detail in your report. Please complete the 
following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using an Incognito browser window (Make sure 
  that you have read the [guides][guides]. If you are looking for support, you might want to 
  check [this section](#i-have-a-question)).
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there 
  is not already a bug report existing for your bug or error in the 
  [bug tracker][issues-bugs].
- Collect information about the bug:
- Desktop / Mobile, Browser, Browser Version and App Version
- Possibly what actions you took before the bug occurred
- Can you reliably reproduce the issue? And if so, what are the steps to reproduce it?

<!-- omit in toc -->
#### How Do I Submit a Good Bug Report?

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue][new-issue].
- Choose the `Bug Report` template.
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction steps* that someone else can follow to 
  recreate the issue on their own. For good bug reports it can be helpful if you can isolate the problem and create a 
  reduced test case.
- Provide the information you collected in the previous section.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no 
  obvious way to reproduce the issue, the team will ask you for additional information.


### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for The Prune Tree App, **including completely 
new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and 
the community to understand your suggestion and find related suggestions.

<!-- omit in toc -->
#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [guides][guides] carefully and find out if the functionality is already covered.
- Perform a [search][issues-enhancement] to see if the 
  enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to 
  convince the project's developers of the merits of this feature.

<!-- omit in toc -->
#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues][new-issue].

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point 
  you can also tell which alternatives do not work for you.
- You may want to **include screenshots, animated GIFs and short videos** which help you demonstrate the steps or point
  out the part which the suggestion is related to.
- **Explain why this enhancement would be useful** to The Prune Tree App users. You may also want to point out if and 
  other projects have solved it better and which could serve as inspiration.


### Your First Code Contribution

To get your development environment set up, please refer to the [README][readme] for instructions.

### Improving The Documentation

For writing guide that are shown in the app, we use Markdown files, which are located in the under 
`src/components/Guides/content`. We use some custom syntax to add additional features to the guides, so check out the
existing guides to see how they are written. To add a new guide, you need to reference it in the 
`src/components/Guides/index.tsx` file, as well as reference any associated images in the 
`src/components/Guides/assets/index.ts` file to ensure the compiler can find them.

## Styleguides
### Commit Messages

Our automatic deployment scripts expects commits to use the [conventional commits][conventional-commits] style to
auto-generate useful changelogs using [release-please][release-please]. You may consider using [commitlint][commitlint]
or similar tools to ensure your commits are formatted correctly for the automatic changelog generation.

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

## Attribution
This guide is based on the **contributing-gen**. [Make your own](https://github.com/bttger/contributing-gen)!

[readme]: README.md
[guides]: https://prunetree.app/#/guides
[issues]: https://github.com/TrueKuehli/PruneTree/issues
[issues-bugs]: https://github.com/TrueKuehli/PruneTree/issues?q=is%3Aissue+label%3Abug
[issues-enhancement]: https://github.com/TrueKuehli/PruneTree/issues?q=is%3Aissue+label%3Aenhancement
[new-issue]: https://github.com/TrueKuehli/PruneTree/issues/new/choose
[conventional-commits]: https://www.conventionalcommits.org/en/v1.0.0/
[commitlint]: https://commitlint.js.org/#/
[release-please]: https://github.com/googleapis/release-please/