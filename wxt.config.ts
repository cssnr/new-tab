import { defineConfig } from 'wxt'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// NOTE: Icons are also defined in <mata> tags for:
//    popup/index.html
//    sidepanel/index.html
// const icons = {
//   16: 'icons/16.png',
//   24: 'icons/24.png',
//   32: 'icons/32.png',
//   48: 'icons/48.png',
//   96: 'icons/96.png',
//   128: 'icons/128.png',
// }

// See https://wxt.dev/api/config.html
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-vue', '@wxt-dev/i18n/module', '@wxt-dev/auto-icons'],
  // https://wxt.dev/guide/essentials/config/auto-imports.html#disabling-auto-imports
  // imports: false,

  autoIcons: {
    enabled: true,
    baseIconPath: 'assets/icon.svg',
    developmentIndicator: false,
    // developmentIndicator: 'overlay',
    sizes: [96, 24], // Dfault: 128, 48, 32, 16
  },
  // NOTE: Icons are also defined in <mata> tags for:
  //    popup/index.html
  //    sidepanel/index.html

  // https://wxt.dev/guide/essentials/config/manifest.html
  manifest: ({ browser, mode }) => {
    const isFirefox = browser === 'firefox'
    const isDev = mode === 'development'
    console.log(`isDev: ${isDev} - isFirefox: ${isFirefox}`)

    return {
      default_locale: 'en',
      name: '__MSG_name__',
      short_name: '__MSG_short_name__',
      description: '__MSG_description__',

      homepage_url: 'https://github.com/smashedr/new-tab',
      permissions: [
        'contextMenus',
        'storage',
        'bookmarks',
        'history',
        'search',
        'topSites',
        'favicon',
      ],

      // chrome_url_overrides: {
      //   newtab: 'tab.html',
      // },

      commands: {
        _execute_action: {
          description: '__MSG_cmd_executeAction__',
          suggested_key: { default: 'Alt+Shift+A' },
        },
        openSidePanel: {
          description: '__MSG_cmd_openSidePanel__',
          suggested_key: { default: 'Alt+Shift+P' },
        },
        openExtPanel: {
          description: '__MSG_cmd_openExtPanel__',
          ...(!isDev && { suggested_key: { default: 'Alt+Shift+W' } }),
        },
        openOptions: {
          description: '__MSG_cmd_openOptions__',
          suggested_key: { default: 'Alt+Shift+O' },
        },
      },

      ...(isFirefox
        ? {
            browser_specific_settings: {
              gecko: {
                id: 'new-tab-dev@cssnr.com',
                strict_min_version: '112.0', // unknown
                data_collection_permissions: { required: ['none'] },
                update_url:
                  'https://raw.githubusercontent.com/smashedr/new-tab/master/update.json',
              },
              gecko_android: { strict_min_version: '120.0' }, // unknown
            },
          }
        : { minimum_chrome_version: '127' }), // chrome.action.openPopup
    }
  },

  // // https://wxt.dev/guide/essentials/config/hooks
  // hooks: {
  //   'build:done': async (wxt) => {
  //     await generateIcons(wxt.config.outDir)
  //   },
  // },

  // https://wxt.dev/guide/essentials/config/browser-startup.html
  // NOTE: Override with web-ext.config.ts
  webExt: {
    disabled: true,
  },

  // https://wxt.dev/guide/essentials/config/vite.html
  vite: () => ({
    plugins: [
      // NOTE: For retarded icons
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/simple-icons/icons/*.svg',
            dest: 'si',
          },
        ],
      }),
    ],
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
