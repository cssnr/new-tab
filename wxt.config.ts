import { defineConfig } from 'wxt'

// NOTE: Icons are also defined in <mata> tags for:
//    popup/index.html
//    sidepanel/index.html
const icons = {
  16: 'images/logo16.png',
  24: 'images/logo24.png',
  32: 'images/logo32.png',
  48: 'images/logo48.png',
  96: 'images/logo96.png',
  128: 'images/logo128.png',
}

// See https://wxt.dev/api/config.html
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-vue'],

  manifest: ({ browser, mode }) => {
    const isFirefox = browser === 'firefox'
    const isDev = mode === 'development'
    console.log(`isDev: ${isDev} - isFirefox: ${isFirefox}`)

    return {
      icons,
      name: 'New Tab',
      description: 'New Tab Extension.',
      homepage_url: 'https://github.com/smashedr/new-tab',
      permissions: ['contextMenus', 'storage', 'bookmarks', 'history', 'search'],

      // chrome_url_overrides: {
      //   newtab: 'tab.html',
      // },

      commands: {
        openSidePanel: {
          description: 'Open Side Panel',
          suggested_key: { default: 'Alt+Shift+P' },
        },
        _execute_action: {
          description: 'Open Popup',
          suggested_key: { default: 'Alt+Shift+A' },
        },
        openExtPanel: {
          description: 'Open Extension Panel',
          ...(!isDev && { suggested_key: { default: 'Alt+Shift+W' } }),
        },
        openOptions: {
          description: 'Open Options',
          suggested_key: { default: 'Alt+Shift+O' },
        },
      },

      ...(isFirefox && {
        browser_specific_settings: {
          gecko: {
            id: 'new-tab@cssnr.com',
            strict_min_version: '112.0',
            data_collection_permissions: {
              required: ['none'],
            },
            update_url:
              'https://raw.githubusercontent.com/smashedr/new-tab/master/update.json',
          },
          gecko_android: {
            strict_min_version: '120.0',
          },
        },
      }),
    }
  },

  // NOTE: Override with web-ext.config.ts
  webExt: {
    disabled: true,
  },

  vite: () => ({
    // NOTE: This silences bootstrap deprecation warnings
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: [
            'import',
            'color-functions',
            'global-builtin',
            'if-function',
          ],
        },
      },
    },
  }),
})
