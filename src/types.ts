export interface Settings {
  someoneDun: boolean
  idChip: boolean
  chapters: boolean
}

export interface Shared {
  sequel: boolean
  sticker: boolean
  squatted: boolean
  sequelKey: number
}

export type SetShared = (update: (s: Shared) => Shared) => void

export const INITIAL_SHARED: Shared = { sequel: false, sticker: false, squatted: false, sequelKey: 0 }

export const PARAMS = new URLSearchParams(window.location.search)
