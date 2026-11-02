import { useEffect, useRef, useState } from 'react'
import { Creator } from './Creator'
import { INITIAL_SHARED, type Settings, type Shared } from './types'
import { Viewer } from './Viewer'

export type Flow = 'guest' | 'passive' | 'active'

interface Step {
  side: 'viewer' | 'creator'
  cue: string
  ms: number
  patch?: (s: Shared) => Shared
}

const squatOn = (s: Shared): Shared => ({ ...s, squatted: true })
const squatOff = (s: Shared): Shared => ({ ...s, squatted: false })
const sequelOn = (s: Shared): Shared => ({
  ...s,
  sequel: true,
  sticker: true,
  squatted: true,
  sequelKey: s.sequelKey + 1,
})

const FLOWS: Record<Flow, Step[]> = {
  guest: [
    { side: 'viewer', cue: 'video', ms: 1500 },
    { side: 'viewer', cue: 'comments', ms: 1600 },
    { side: 'viewer', cue: 'squat-btn', ms: 1900, patch: squatOn },
    { side: 'viewer', cue: 'reset-squat', ms: 1400, patch: squatOff },
    { side: 'viewer', cue: 'draft', ms: 1500 },
    { side: 'viewer', cue: 'send', ms: 1900, patch: squatOn },
    { side: 'viewer', cue: 'close', ms: 1300 },
    { side: 'viewer', cue: 'notif', ms: 2500, patch: sequelOn },
    { side: 'viewer', cue: 'open-notif', ms: 1800 },
    { side: 'viewer', cue: 'sequel-comments', ms: 1700 },
    { side: 'viewer', cue: 'back', ms: 1600 },
    { side: 'viewer', cue: 'comments', ms: 1700 },
    { side: 'viewer', cue: 'expand', ms: 1800 },
    { side: 'viewer', cue: 'close', ms: 1200 },
    { side: 'viewer', cue: 'autoplay', ms: 1700 },
    { side: 'viewer', cue: 'wait', ms: 4600 },
  ],
  passive: [
    { side: 'creator', cue: 'home', ms: 1500 },
    { side: 'creator', cue: 'comments', ms: 1700 },
    { side: 'creator', cue: 'create', ms: 1600 },
    { side: 'creator', cue: 'album', ms: 1500 },
    { side: 'creator', cue: 'preview', ms: 1500 },
    { side: 'creator', cue: 'stickers', ms: 1500 },
    { side: 'creator', cue: 'apply', ms: 1700 },
    { side: 'creator', cue: 'edit', ms: 1800 },
    { side: 'creator', cue: 'publish', ms: 3800 },
    { side: 'viewer', cue: 'show-notif', ms: 2400 },
    { side: 'viewer', cue: 'open-notif', ms: 1800 },
    { side: 'viewer', cue: 'sequel-comments', ms: 1700 },
  ],
  active: [
    { side: 'creator', cue: 'home', ms: 1500 },
    { side: 'creator', cue: 'plus', ms: 1600 },
    { side: 'creator', cue: 'album', ms: 1500 },
    { side: 'creator', cue: 'preview', ms: 1500 },
    { side: 'creator', cue: 'edit', ms: 1700 },
    { side: 'creator', cue: 'quote', ms: 1700 },
    { side: 'creator', cue: 'pick-quote', ms: 1700 },
    { side: 'creator', cue: 'publish', ms: 3800 },
    { side: 'viewer', cue: 'linked', ms: 1700 },
    { side: 'viewer', cue: 'comments', ms: 1800 },
  ],
}

const PHONE_W = 414
const PHONE_H = 868

function useFit() {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const fit = () => {
      const next = Math.min(1, (window.innerWidth - 20) / PHONE_W, (window.innerHeight - 52) / PHONE_H)
      setScale(next > 0 ? next : 1)
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return scale
}

function fresh(flow: Flow): Shared {
  return flow === 'passive' ? { ...INITIAL_SHARED, squatted: true } : { ...INITIAL_SHARED }
}

export function Menu({ onPlay, onFree }: { onPlay: (flow: Flow) => void; onFree: () => void }) {
  return (
    <div className="app menu">
      <div className="menu-list">
        <button type="button" data-testid="menu-guest" onClick={() => onPlay('guest')}>
          观众客态交互流程
        </button>
        <button type="button" data-testid="menu-passive" onClick={() => onPlay('passive')}>
          作者被动创作交互流程
        </button>
        <button type="button" data-testid="menu-active" onClick={() => onPlay('active')}>
          作者主动创作交互流程
        </button>
        <button type="button" className="alt" data-testid="menu-free" onClick={onFree}>
          自己操作
        </button>
      </div>
    </div>
  )
}

export function Play({ flow, onBack }: { flow: Flow; onBack: () => void }) {
  const steps = FLOWS[flow]
  const scale = useFit()
  const patched = useRef('')
  const [gen, setGen] = useState(0)
  const [i, setI] = useState(0)
  const [done, setDone] = useState(false)
  const [shared, setShared] = useState<Shared>(() => fresh(flow))
  const step = steps[i]
  const settings: Settings = {
    someoneDun: flow !== 'active',
    idChip: false,
    chapters: false,
  }

  useEffect(() => {
    if (done) return
    const t = window.setTimeout(() => {
      if (i >= steps.length - 1) setDone(true)
      else setI((n) => n + 1)
    }, step.ms)
    return () => window.clearTimeout(t)
  }, [done, i, gen, step.ms, steps.length])

  useEffect(() => {
    const token = `${gen}:${i}`
    if (patched.current === token) return
    patched.current = token
    if (step.patch) setShared((s) => step.patch!(s))
  }, [gen, i, step])

  const replay = () => {
    patched.current = ''
    setShared(fresh(flow))
    setI(0)
    setDone(false)
    setGen((g) => g + 1)
  }

  const viewerOn = step.side === 'viewer'
  return (
    <div className="app play" data-flow={flow} data-cue={step.cue} data-done={done ? '1' : '0'}>
      <div className="play-bar">
        <button type="button" onClick={onBack}>
          返回
        </button>
        <button type="button" onClick={replay}>
          重播
        </button>
      </div>
      <div className="stage-wrap" style={{ width: PHONE_W * scale, height: PHONE_H * scale }}>
        <div className="stage" style={{ width: PHONE_W, height: PHONE_H, transform: `scale(${scale})` }}>
          <div className="phones">
            <div className="phone play-phone">
              <div className={`play-slot${viewerOn ? '' : ' off'}`}>
                <Viewer
                  key={`v${gen}`}
                  settings={settings}
                  shared={shared}
                  setShared={setShared}
                  framed
                  active={viewerOn}
                  scripted
                  demoNonce={viewerOn ? i : -1}
                  demoCue={viewerOn ? step.cue : ''}
                />
              </div>
              <div className={`play-slot${viewerOn ? ' off' : ''}`}>
                <Creator
                  key={`c${gen}`}
                  settings={settings}
                  setShared={setShared}
                  framed
                  onPublished={() => undefined}
                  scripted
                  demoNonce={viewerOn ? -1 : i}
                  demoCue={viewerOn ? '' : step.cue}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
