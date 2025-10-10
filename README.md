# Azot Extension Example

This is an example of an extension for [Azot](https://github.com/azot-labs/azot).

This project uses TypeScript to provide type checking and documentation. The repo depends on the latest extension API in TypeScript Definition format, which contains TSDoc comments describing what it does.

This extension example demonstrates some of the basic functionality the extension API can do. [Bitmovin](https://bitmovin.com/demos/stream-test?format=dash) is used as an example of a service from which metadata is extracted for downloading.

- Detects whether the URL is supported by the extension.
- Parses download (manifest) links from a given URL.

## First time developing extensions?

Quick starting guide for new extension devs:

- Check if [someone already developed an extension for what you want](https://github.com/azot-labs/extensions/blob/main/extensions.json)! There might be an existing extension similar enough that you can partner up with.
- Make a copy of this repo as a template with the "Use this template" button (login to GitHub if you don't see it).
- Clone your repo to a local development folder.
- Install [Node.js](https://nodejs.org/en/download), then run `npm i` in the command line under your repo folder.
- Run `npm run dev` to compile your extension from `main.ts` to `main.js`.
- Make changes to `main.ts` (or create new `.ts` files). Those changes should be automatically compiled into `main.js`.
- Reload Azot to load the new version of your extension.
- For updates to the Azot API run `npm i azot@latest` in the command line under your repo folder.
- For testing we use `vitest` by default. Run `npm test` to run the test suite in `main.test.ts`.

## Releasing new releases

- Update your `package.json` with your new `version` number, such as `1.0.1`, and `engines.azot` with the minimum Azot version required for your latest release.

  > You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major`.

- Push all commits and tags to GitHub.

- [GitHub Actions workflow](https://github.com/azot-labs/azot-extension-example/blob/main/.github/workflows/release.yml) will handle the rest when new tags are pushed to GitHub.

## Adding your extension to the [community extension list](https://github.com/azot-labs/extensions/blob/main/extensions.json)

- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/azot-labs/extensions to add your extension.

## How to use

- Clone this repo.
- Make sure your [Node.js](https://nodejs.org/en/download) is at least v20 (`node --version`).
- `npm i` to install dependencies.
- `npm run dev` to start compilation in watch mode.

## Funding URL

You can include funding URLs where people who use your extension can financially support it.

The simple way is to set the `funding` field to your link in your `package.json` file:

```json
{
  "funding": {
    "type": "patreon",
    "url": "https://www.patreon.com/"
  }
}
```

If you have multiple URLs, you can also do:

```json
{
  "funding": [
    {
      "type": "individual",
      "url": "https://boosty.to/"
    },
    {
      "type": "patreon",
      "url": "https://www.patreon.com/"
    }
  ]
}
```
