# Contributing

- [Development](#development)
- [Building](#building)
- [WXT](#wxt)

> [!WARNING]  
> This guide is not complete and just the bare minimum.

## Development

Install dependencies:

```shell
npm i
```

### Chrome

```shell
npm run dev
```

Open Chrome and navigate to `chrome://extensions/`, enable "Developer mode",
and load the unpacked extension from the `.output` directory.

### Firefox

```shell
npm run dev:ff
```

Open Firefox and navigate to `about:debugging#/runtime/this-firefox`, then click "Load Temporary Add-on..."
and load the unpacked extension from the `.output` directory.

### Android

This requires the [Android Debug Bridge (adb)](https://developer.android.com/tools/adb).

In another terminal (or without the watcher run `npm build:ff`).

```shell
npm run watch:ff
```

Enable USB or Wireless Debugging, connect, and get your device `name`.

```shell
adb devices
```

Then run using your device `name`.

```shell
npm run android -- name
```

## Building

### Package All

This type checks the project, builds and zips to the `.output` directory.

```shell
npm run package
```

### Chrome

To build the `.output` directory.

```shell
npm run build
```

To build and create an archive in the `.output` directory.

```shell
npm run zip:chrome
```

### Firefox

To build the `.output` directory.

```shell
npm build:ff
```

To build and create an archive in the `.output` directory.

```shell
npm run zip:ff
```

## WXT

This project uses the WXT framework.

- <https://wxt.dev/>

To customize the config for development add a `web-ext.config.ts` to the project root.

```ts
// web-ext.config.ts
import { defineWebExtConfig } from 'wxt'

export default defineWebExtConfig({
  binaries: {
    firefox: 'C:/Program Files/Firefox Developer Edition/firefox.exe',
  },
  disabled: false,
})
```
