import { defineConfig } from 'wxt'
import { cp } from 'node:fs/promises'
import { join } from 'node:path'

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
      homepage_url: 'https://github.com/cssnr/new-tab',

      permissions: [
        'contextMenus',
        'storage',
        'bookmarks',
        'history',
        'search',
        'topSites',
        ...(!isFirefox ? ['favicon'] : []),
      ],

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
                id: 'new-tab@cssnr.com',
                strict_min_version: '112.0', // manifest - background.type
                data_collection_permissions: { required: ['none'] },
                update_url:
                  'https://raw.githubusercontent.com/cssnr/new-tab/master/update.json',
              },
              // gecko_android: { strict_min_version: '120.0' }, // permissions.request
            },
          }
        : { minimum_chrome_version: '127' }), // chrome.action.openPopup
    }
  },

  // https://wxt.dev/guide/essentials/config/hooks
  hooks: {
    'build:manifestGenerated': (wxt, manifest) => {
      console.log('build:manifestGenerated:', wxt.config.browser)
      if (manifest.action) manifest.action.default_icon = manifest.icons
      if (manifest.sidebar_action) manifest.sidebar_action.default_icon = manifest.icons
    },
    'build:done': async (wxt) => {
      const src = join(process.cwd(), 'node_modules/simple-icons/icons')
      const dest = join(wxt.config.outDir, 'si')
      console.log(`Copying simple-icons to ${dest}`)
      await cp(src, dest, { recursive: true })
    },
  },

  // https://wxt.dev/guide/essentials/config/browser-startup.html
  // NOTE: Configured in web-ext.config.ts
  // webExt: { disabled: true },

  // https://wxt.dev/guide/essentials/config/vite.html
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
