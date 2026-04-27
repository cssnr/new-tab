declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.svg?component' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

type RadioBackground = 'bgNone' | 'bgPicture' | 'bgVideo' | 'bgLocal'
