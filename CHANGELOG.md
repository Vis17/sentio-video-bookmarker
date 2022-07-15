# Changelog | Sentio - Video-Bookmarker

## `1.0.0-beta.6` (01/2022)

### What´s new?

- Options: Finally there is an error message if the access to the background page is not possible. (This can be due to the `options_page` is opened in a container)

### Fixes

- `durationchange`-events are now handled properly (so it works now 😉 (hopefully))
- `video.currentSrc` is read instead of `video.src`, which enables support for

  ```html
  <video>
    <source src="x" />
  </video>
  ```

[[**Full Changelog**](https://github.com/tametsi/sentio-video-bookmarker/compare/v1.0.0-beta.5...v1.0.0-beta.6)]

## `1.0.0-beta.5` (01/2022)

### What´s new?

- Popup:
  - removed `page_popup`
  - `browser_popup` is now handling bookmarking and _(also new)_ unbookmarking by clicking on Video-Bookmarks
  - Video-Bookmarks on the current page are marked by a ⭐

### Fixes

- everything now responds to the browser´s default font-size (bigger font-size means bigger popup, ...)

[[**Full Changelog**](https://github.com/tametsi/sentio-video-bookmarker/compare/v1.0.0-beta.4...v1.0.0-beta.5)]

## `1.0.0-beta.4` (01/2022)

### What´s new?

- Storage tab:
  - clear extension storage
  - import/export functionality

### Fixes

- Video-Bookmarks sometimes still shown in Manage-tab after pressing 'Delete All'
- remove not required permission `tabs`
