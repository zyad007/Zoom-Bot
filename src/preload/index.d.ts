import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      onBlur: Function,
      onFocused: Function,
      resize: Function
    }
  }
}
