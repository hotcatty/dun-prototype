import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Switch } from './Common'
import { Creator } from './Creator'
import * as I from './icons'
import { INITIAL_SHARED, PARAMS, type SetShared, type Settings, type Shared } from './types'
import { Viewer } from './Viewer'

type Mode = 'dual' | 'single' | 'mobile'
type Side = 'viewer' | 'creator'

const PHONE_W = 414
const PHONE_H = 868
const GAP = 56
const TOP_H = 84

function measure(): { mode: Mode; scale: number } {
  const w = window.innerWidth
  const h = window.innerHeight
  const forced = PARAMS.get('layout')
  const touch = window.matchMedia('(pointer: coarse)').matches
  const mode: Mode =
    forced === 'dual' || forced === 'single' || forced === 'mobile'
      ? forced
      : w <= 520 && touch
        ? 'mobile'
        : w >= 860
          ? 'dual'
          : 'single'
  const stageW = mode === 'dual' ? PHONE_W * 2 + GAP : PHONE_W
  const scale = Math.min(1, (w - 24) / stageW, (h - 16) / (PHONE_H + TOP_H))
  return { mode, scale }
}

export function App() {
  const [{ mode, scale }, setLayout] = useState(measure)
  const [settings, setSettings] = useState<Settings>({
    someoneDun: PARAMS.get('dun') !== '0',
    idChip: PARAMS.get('chip') !== '0',
    chapters: PARAMS.get('chapters') === '1',
  })
  const [shared, setSharedState] = useState<Shared>(INITIAL_SHARED)
  const [resetKey, setResetKey] = useState(0)
  const [side, setSide] = useState<Side>(PARAMS.get('side') === 'creator' ? 'creator' : 'viewer')
  const switchTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const onResize = () => setLayout(measure())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const setShared: SetShared = useCallback((update) => setSharedState(update), [])

  const reset = () => {
    window.clearTimeout(switchTimer.current)
    setSharedState(INITIAL_SHARED)
    setResetKey((k) => k + 1)
  }

  const changeSetting = (key: keyof Settings, value: boolean) => {
    setSettings((s) => ({ ...s, [key]: value }))
    if (key === 'someoneDun') reset()
  }

  const onPublished = () => {
    if (mode === 'dual') return
    window.clearTimeout(switchTimer.current)
    switchTimer.current = window.setTimeout(() => setSide('viewer'), 1200)
  }

  const framed = mode !== 'mobile'
  const viewer = (
    <Viewer
      key={`v${resetKey}`}
      settings={settings}
      shared={shared}
      setShared={setShared}
      framed={framed}
      active={mode === 'dual' || side === 'viewer'}
    />
  )
  const creator = (
    <Creator key={`c${resetKey}`} settings={settings} setShared={setShared} framed={framed} onPublished={onPublished} />
  )

  const toggles = (
    <>
      <label className="ctl">
        ID 旁按钮
        <Switch on={settings.idChip} onChange={(v) => changeSetting('idChip', v)} />
      </label>
      <label className="ctl">
        章节
        <Switch on={settings.chapters} onChange={(v) => changeSetting('chapters', v)} />
      </label>
      <label className="ctl">
        评论区有人蹲
        <Switch on={settings.someoneDun} onChange={(v) => changeSetting('someoneDun', v)} />
      </label>
    </>
  )
  const sideSwitch = (
    <span className="seg">
      <button className={side === 'viewer' ? 'on' : ''} onClick={() => setSide('viewer')}>
        观众
      </button>
      <button className={side === 'creator' ? 'on' : ''} onClick={() => setSide('creator')}>
        作者
      </button>
    </span>
  )

  if (mode === 'mobile') {
    return (
      <div className="app mobile">
        <Phone hidden={side !== 'viewer'}>{viewer}</Phone>
        <Phone hidden={side !== 'creator'}>{creator}</Phone>
        <MobileMenu sideSwitch={sideSwitch} toggles={toggles} onReset={reset} />
      </div>
    )
  }

  const stageW = mode === 'dual' ? PHONE_W * 2 + GAP : PHONE_W
  const stageH = PHONE_H + TOP_H
  return (
    <div className={`app ${mode}`}>
      <div className="stage-wrap" style={{ width: stageW * scale, height: stageH * scale }}>
        <div className="stage" style={{ width: stageW, height: stageH, transform: `scale(${scale})` }}>
          <div className="controls">
            {mode === 'single' && sideSwitch}
            <button className="ctl-btn" onClick={reset}>
              <I.Reset size={14} />
              重置
            </button>
            {toggles}
          </div>
          <div className="phones">
            <Phone label={mode === 'dual' ? '观众' : undefined} hidden={mode === 'single' && side !== 'viewer'}>
              {viewer}
            </Phone>
            <Phone label={mode === 'dual' ? '作者 · @三楼的小满' : undefined} hidden={mode === 'single' && side !== 'creator'}>
              {creator}
            </Phone>
          </div>
        </div>
      </div>
    </div>
  )
}

function Phone({ label, hidden = false, children }: { label?: string; hidden?: boolean; children: ReactNode }) {
  return (
    <div className={`phone-col${hidden ? ' offstage' : ''}`}>
      {label && <div className="phone-label">{label}</div>}
      <div className="phone">{children}</div>
    </div>
  )
}

function MobileMenu({ sideSwitch, toggles, onReset }: { sideSwitch: ReactNode; toggles: ReactNode; onReset: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="m-handle" onClick={() => setOpen((o) => !o)} aria-label="切换">
        <I.Swap size={14} />
      </button>
      {open && (
        <>
          <div className="m-scrim" onClick={() => setOpen(false)} />
          <div className="m-menu" onClick={(e) => e.target instanceof HTMLButtonElement && e.target.closest('.seg') && setOpen(false)}>
            {sideSwitch}
            <button
              className="ctl-btn"
              onClick={() => {
                onReset()
                setOpen(false)
              }}
            >
              <I.Reset size={14} />
              重置
            </button>
            {toggles}
          </div>
        </>
      )}
    </>
  )
}
