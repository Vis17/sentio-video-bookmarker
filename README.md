# Sentio - Video bookmarker

Sentio is a Firefox-Addon that let´s you create Video-Bookmarks 📺.

They work like you expect them to work: bookmark a video and Sentio will save 💾, to which point 🕔 you have watched the video. These information help Sentio to jump right into where you stopped last time ▶ if you visit the page again.

## Development

* project setup

```bash
npm install
```

* compiling & file-watching

```bash
npm run build:dev:watch
# or, without file-watching
npm run build:dev
```

* tests the files with jest (only a few files/funtions are getting tested (yet)!)

```bash
npm run test
# or, with file-watching
npm run test:watch
```

* lints the files

```bash
npm run lint
```

* starts the addon in Firefox Developer Edition with auto reloading

```bash
npm run start:firefoxdeveloperedition
```

* builds for production

```bash
npm run build:prod
```

## License

MIT
