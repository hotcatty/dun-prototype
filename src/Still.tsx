import { useState } from 'react'
import { Creator, type CreatorStill } from './Creator'
import { INITIAL_SHARED, PARAMS, type Settings, type Shared } from './types'
import { Viewer, type ViewerStill } from './Viewer'

interface StillSpec {
  settings?: Partial<Settings>
  shared?: Partial<Shared>
  viewer?: ViewerStill
  creator?: CreatorStill
}

const SEQUEL: Partial<Shared> = { sequel: true, sticker: true, squatted: true }

const SCREENS: Record<string, StillSpec> = {
  '01': { viewer: {} },
  '02': { viewer: { sheet: 'comments' } },
  '03': { shared: { squatted: true }, viewer: { sheet: 'comments', toast: '蹲上了，更新后会第一时间收到通知' } },
  '04': { creator: { page: 'album' } },
  '05': { creator: { page: 'publish' } },
  '06': { creator: { page: 'publish', picker: true } },
  '07': { creator: { page: 'publish', quote: 'p1' } },
  '08': { creator: { page: 'posted', upload: 'done', sticker: true, toast: '发布成功，已通知蹲后续提示' } },
  '09': { shared: SEQUEL, viewer: { notif: true } },
  '10': { shared: SEQUEL, viewer: { stack: ['p1', 'p2'] } },
  '11': { shared: SEQUEL, viewer: { stack: ['p1', 'p2'], sheet: 'comments' } },
  '12': { shared: SEQUEL, viewer: {} },
  '13': { shared: SEQUEL, viewer: { sheet: 'comments' } },
  '14': { shared: SEQUEL, viewer: { sheet: 'expand' } },
  '15': { settings: { chapters: true }, shared: SEQUEL, viewer: { progress: 0.7 } },
  '16': { settings: { chapters: true }, viewer: { progress: 0.7, toast: '已定位至最后章节' } },
  '17a': { viewer: { sheet: 'comments', draft: '[蹲后续]' } },
  '17b': { shared: { squatted: true }, viewer: { sheet: 'comments', mine: ['蹲后续'], toast: '蹲上了，更新后会第一时间收到通知' } },
  '18a': { settings: { someoneDun: false }, creator: { page: 'publish', quote: 'p1' } },
  '18b': { settings: { someoneDun: false }, shared: { sequel: true }, viewer: { sheet: 'comments' } },
  '19': { shared: SEQUEL, viewer: { autoNext: true } },
  '20': { creator: { comments: true } },
  '21': { creator: { page: 'camera', fromComment: true, quote: 'p1' } },
  '22': { creator: { page: 'preview', stickers: true, fromComment: true, quote: 'p1' } },
  '23': { creator: { page: 'preview', sticker: true, fromComment: true, quote: 'p1' } },
  '24': { creator: { page: 'posted', upload: 'up', sticker: true } },
  '25': { settings: { someoneDun: false }, creator: { page: 'publish', picker: true } },
}

const id = PARAMS.get('screen') ?? ''
export const STILL: StillSpec | undefined = Object.hasOwn(SCREENS, id) ? SCREENS[id] : undefined

export function Still({ spec }: { spec: StillSpec }) {
  const settings: Settings = { someoneDun: true, idChip: true, chapters: false, ...spec.settings }
  const [shared, setShared] = useState<Shared>({ ...INITIAL_SHARED, ...spec.shared })
  return (
    <div className="still">
      {spec.creator ? (
        <Creator settings={settings} setShared={setShared} framed onPublished={() => undefined} still={spec.creator} />
      ) : (
        <Viewer settings={settings} shared={shared} setShared={setShared} framed active still={spec.viewer ?? {}} />
      )}
    </div>
  )
}
