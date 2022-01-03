# Sentio - Video-Bookmarker

Sentio is a Firefox-Addon that lets you create Video-Bookmarks 📺.

They work like you expect them to work: bookmark a video and Sentio will save 💾, to which point 🕔 you have watched the video. These information help Sentio to jump right into where you stopped last time ▶ if you visit the page again.

## Build the extension

```bash
# Setup
npm install

# Compile with webpack
npm run build:prod
```

Upload the zipped `dist` folder to AMO

```bash
# or sign the addon with
# for this make sure a firefox_api_creds.json with the keys "api_key", "api_secret" & "id" is available
npm run sign:firefox
```

## Development

- Project setup

```bash
npm install
```

- Bundling

```bash
npm run build:dev:watch
# or, without file-watching
npm run build:dev
```

- Testing (only a few files/funtions are getting tested (yet)!)

```bash
npm run test
# or, with file-watching
npm run test:watch
```

- Linting

```bash
npm run lint
```

- Starting the addon in Firefox Developer Edition with auto reloading

```bash
npm run start:firefoxdeveloperedition
```

For a complete production build check [**this**](#build-the-extension) out.

## Libraries

- [Svelte](https://svelte.dev/) and [Sass](https://sass-lang.com/) are used for the UI
- [webpack](https://webpack.js.org/) is used to bundle the files
- [Jest](https://jestjs.io/) is used for the few tests

## License

MIT ([see here](https://github.com/Vis17/sentio-video-bookmarker/blob/main/LICENSE))
