import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { Avatar, QuoteCard, RichText, RightRail, StatusBar, useToast } from './Common'
import {
  COMMENTS_P1_DUN,
  COMMENTS_P1_HOT,
  CREATOR,
  DUN_COUNT,
  IMG,
  ME,
  RECS,
  SEQUEL_HINT,
  SQUATTERS,
  commentsP2,
  getVideos,
  type CommentData,
  type VideoData,
  type VideoId,
} from './data'
import * as I from './icons'
import { PARAMS, type SetShared, type Settings, type Shared } from './types'

type Sheet = null | 'comments' | 'expand' | 'chapters'

export interface ViewerStill {
  stack?: VideoId[]
  sheet?: Sheet
  progress?: number
  notif?: boolean
  autoNext?: boolean
  toast?: string
  mine?: string[]
  draft?: string
}

const DUN_RE = /\[蹲后续\]|蹲.{0,3}(后续|更新)|求后续|等后续|蹲一个|^蹲+[!！~。.]*$/
const SQUAT_TOAST = '蹲上了，更新后会第一时间收到通知'
const QUICK_EMOJI = ['😂', '😭', '🥺', '👍', '🙏', '❤️', '🔥']
const AUTOPLAY = PARAMS.get('autoplay') !== '0'
const DURATION: Record<VideoId, number> = { p1: 40000, p2: 30000 }

export function useSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 390, h: 844 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

function useLatest<T>(value: T) {
  const ref = useRef(value)
  useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}

function useClock(running: boolean, duration: number, resetKey: string, onEnd: () => void, initial = 0) {
  const [p, setP] = useState(initial)
  const pRef = useRef(initial)
  const keyRef = useRef(resetKey)
  const onEndRef = useLatest(onEnd)
  useEffect(() => {
    if (keyRef.current === resetKey) return
    keyRef.current = resetKey
    pRef.current = 0
    setP(0)
  }, [resetKey])
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      const next = pRef.current + 250 / duration
      if (next >= 1) {
        pRef.current = 0
        setP(0)
        onEndRef.current()
      } else {
        pRef.current = next
        setP(next)
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [running, duration, onEndRef])
  const seek = (value: number) => {
    pRef.current = value
    setP(value)
  }
  return [p, seek] as const
}

interface ViewerProps {
  settings: Settings
  shared: Shared
  setShared: SetShared
  framed: boolean
  active: boolean
  still?: ViewerStill
}

export function Viewer({ settings, shared, setShared, framed, active, still }: ViewerProps) {
  const videos = useMemo(() => getVideos(settings.someoneDun), [settings.someoneDun])
  const [stack, setStack] = useState<VideoId[]>(still?.stack ?? ['p1'])
  const [navs, setNavs] = useState(0)
  const [dir, setDir] = useState<'up' | 'down'>('up')
  const [sheet, setSheet] = useState<Sheet>(still?.sheet ?? null)
  const [paused, setPaused] = useState(false)
  const [notif, setNotif] = useState(still?.notif ?? false)
  const [autoNext, setAutoNext] = useState(still?.autoNext ?? false)
  const [mine, setMine] = useState<Record<VideoId, CommentData[]>>(() => ({
    p1: (still?.mine ?? []).map((text, i) => ({ id: `s${i}`, person: ME, text, meta: '刚刚 · 浙江', likes: '0' })),
    p2: [],
  }))
  const [bannerOff, setBannerOff] = useState(false)
  const [toast, showToast] = useToast(still?.toast)
  const screenRef = useRef<HTMLDivElement>(null)
  const size = useSize(screenRef)

  const vid = stack[stack.length - 1]
  const v = videos[vid]
  const chapters = settings.chapters ? v.chapters : []
  const [p, seek] = useClock(
    active && !paused && !still,
    DURATION[vid],
    `${vid}:${stack.length}`,
    () => {
      if (vid === 'p1' && shared.sequel && AUTOPLAY && !sheet) setAutoNext(true)
    },
    still?.progress,
  )
  const chapIdx = chapters.reduce((acc, c, i) => (p >= c.at ? i : acc), 0)
  const atLast = chapters.length > 0 && chapIdx === chapters.length - 1

  const go = (to: VideoId, toastText?: string) => {
    setSheet(null)
    setAutoNext(false)
    setPaused(false)
    setNotif(false)
    if (toastText) showToast(toastText)
    if (vid === to) return
    setNavs((n) => n + 1)
    if (stack.length > 1 && stack[stack.length - 2] === to) {
      setDir('down')
      setStack(stack.slice(0, -1))
    } else {
      setDir(to === 'p2' ? 'up' : 'down')
      setStack([...stack, to])
    }
  }
  const goRef = useLatest(go)

  const back = () => {
    if (stack.length < 2) return
    setSheet(null)
    setNavs((n) => n + 1)
    setDir('down')
    setStack(stack.slice(0, -1))
  }

  const lastSequelKey = useRef(shared.sequelKey)
  useEffect(() => {
    if (shared.sequelKey === lastSequelKey.current) return
    lastSequelKey.current = shared.sequelKey
    if (!shared.sequel || !shared.squatted) return
    const t = window.setTimeout(() => setNotif(true), 1600)
    return () => window.clearTimeout(t)
  }, [shared.sequelKey, shared.sequel, shared.squatted])

  const frozen = still !== undefined
  useEffect(() => {
    if (!notif || frozen) return
    const t = window.setTimeout(() => setNotif(false), 9000)
    return () => window.clearTimeout(t)
  }, [notif, frozen])

  useEffect(() => {
    if (!autoNext || frozen) return
    const t = window.setTimeout(() => goRef.current('p2'), 3200)
    return () => window.clearTimeout(t)
  }, [autoNext, frozen, goRef])

  const squat = (on: boolean) => {
    setShared((s) => ({ ...s, squatted: on }))
    if (on) showToast(SQUAT_TOAST)
    else showToast('已取消蹲后续')
  }

  const sendComment = (text: string) => {
    const c: CommentData = { id: `m${Date.now()}`, person: ME, text, meta: '刚刚 · 浙江', likes: '0' }
    setMine((m) => ({ ...m, [vid]: [c, ...m[vid]] }))
    if (vid === 'p1' && !shared.sequel && !shared.squatted && DUN_RE.test(text)) squat(true)
  }

  const nextChapter = () => {
    if (!atLast) {
      const ni = chapIdx + 1
      seek(chapters[ni].at + 0.002)
      if (ni === chapters.length - 1) showToast('已定位至最后章节')
      return
    }
    showToast('已定位至最后章节')
  }

  const showSequelBar = vid === 'p1' && shared.sequel
  const chapH = chapters.length > 0 ? 62 : 0
  const seqH = showSequelBar ? 36 : 0
  const safeTop = framed ? 47 : 0
  const cmtTop = Math.round(size.h * 0.32)
  const expTop = Math.round(size.h * 0.3)
  const sheetOpen = sheet === 'comments' || sheet === 'expand'
  const pvTop = safeTop + 10
  const pvH = Math.max(120, (sheet === 'expand' ? expTop : cmtTop) - pvTop)
  const pvW = (pvH * 9) / 16
  const mediaStyle = sheetOpen
    ? { top: pvTop, left: (size.w - pvW) / 2, width: pvW, height: pvH }
    : { top: 0, left: 0, width: size.w, height: size.h }

  const linked = vid === 'p1' ? (shared.sequel ? videos.p2 : null) : videos.p1
  const linkedLabel = vid === 'p1' ? '后续' : '上集'

  let idChip = null
  if (chapters.length > 0) {
    idChip = (
      <span className="chip chap-chip">
        <button onClick={() => setSheet('chapters')}>
          <I.Chapters size={13} />
          章节
        </button>
        <i />
        <button onClick={nextChapter}>下一章</button>
      </span>
    )
  } else if (settings.idChip && vid === 'p1' && shared.sequel) {
    idChip = (
      <button className="chip pop-in" onClick={() => go('p2', '已为你接上后续')}>
        后续
        <I.ChevronRight size={12} />
      </button>
    )
  } else if (settings.idChip && vid === 'p2') {
    idChip = (
      <button className="chip" onClick={() => go('p1')}>
        <I.ChevronLeft size={12} />
        上集
      </button>
    )
  }

  return (
    <div
      className="screen viewer"
      ref={screenRef}
      style={
        {
          '--top': `${safeTop}px`,
          '--rel': `${chapH + seqH || 34}px`,
          '--chap': `${chapH}px`,
          '--seq': `${seqH}px`,
        } as CSSProperties
      }
    >
      {framed && <StatusBar />}

      <div className={`vpage${navs > 0 ? ` enter-${dir}` : ''}`} key={`${vid}:${stack.length}`}>
        <div
          className={`media${sheetOpen ? ' small' : ''}`}
          style={mediaStyle}
          onClick={() => (sheet ? setSheet(null) : setPaused((x) => !x))}
        >
          <img className={`frame${paused ? ' paused' : ''}`} src={v.cover} alt="" />
          {vid === 'p2' && shared.sticker && (
            <button
              className="sticker"
              onClick={(e) => {
                e.stopPropagation()
                if (!sheet) go('p1')
              }}
            >
              <span className="st-row">
                <span className="st-emo">🐱</span>
                <b>{settings.someoneDun ? `${DUN_COUNT}人蹲的后续来了` : '后续来了'}</b>
              </span>
              <span className="st-sub">上集：{videos.p1.title}</span>
            </button>
          )}
          {paused && !sheet && (
            <span className="play-ic">
              <svg viewBox="0 0 24 24" width="64" height="64" aria-hidden>
                <path d="M8 5.5v13l10.5-6.5Z" fill="rgba(255,255,255,.75)" />
              </svg>
            </span>
          )}
        </div>

        <div className={`ov${sheetOpen ? ' hidden' : ''}`} style={{ top: safeTop }}>
          <div className="topbar">
            <button className="tb-back" onClick={back}>
              <I.Back size={26} />
            </button>
            <div className="tb-search">
              <I.Search size={17} />
              <span className={vid === 'p1' ? 'q' : 'q ph'}>{v.search}</span>
              <i />
              <b>搜索</b>
            </div>
          </div>
        </div>
        <div className={`pv-search${sheetOpen ? ' show' : ''}`} style={{ top: safeTop + 14 }}>
          <I.Search size={26} />
        </div>

        <div className={`ov ov-bottom${sheetOpen ? ' hidden' : ''}`}>
          <RightRail
            person={CREATOR}
            likes={v.likes}
            comments={v.comments}
            stars={v.stars}
            shares={v.shares}
            onComment={() => setSheet('comments')}
          />
          <div className="left">
            <span className="danmu">弹</span>
            <span className="recommend">
              <I.Thumb size={14} />
              {v.recommend}
              <I.ChevronRight size={13} />
            </span>
            <div className="id-row">
              <b className="id-name">@{CREATOR.name}</b>
              {idChip}
              <span className="id-date">· {v.date}</span>
            </div>
            <div className="cap" onClick={() => setSheet('expand')}>
              <RichText text={v.short} />
              <span className="cap-more">
                展开
                <I.ChevronDown size={13} />
              </span>
            </div>
          </div>
          {chapters.length > 0 && (
            <ChapterStrip chapters={chapters} idx={chapIdx} p={p} smooth={!frozen} onSeek={seek} />
          )}
          {showSequelBar ? (
            <button className="sequel-bar" data-testid="sequel-bar" onClick={() => go('p2', '已为你接上后续')}>
              <I.Menu size={16} />
              <span>
                更新 · {SEQUEL_HINT}
              </span>
              <em>
                看后续
                <I.ChevronRight size={14} />
              </em>
            </button>
          ) : (
            chapters.length === 0 && (
              <button className="related">
                <I.Search size={15} />
                <span>
                  相关搜索 · <em>{v.related}</em>
                </span>
                <I.ChevronRight size={15} />
              </button>
            )
          )}
          <div className="vinput" onClick={() => setSheet('comments')}>
            <span>期待你的评论</span>
            <I.ImageIc size={24} />
            <I.At size={24} />
            <I.Smile size={24} />
          </div>
          {autoNext && (
            <div className="autonext">
              <span className="an-ring" />
              即将播放后续
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setAutoNext(false)
                }}
              >
                取消
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`scrim${sheetOpen ? ' on' : ''}`} style={{ height: sheet === 'expand' ? expTop : cmtTop }} onClick={() => setSheet(null)} />

      <CommentSheet
        open={sheet === 'comments'}
        top={cmtTop}
        video={v}
        comments={vid === 'p1' ? (settings.someoneDun ? COMMENTS_P1_DUN : COMMENTS_P1_HOT) : commentsP2(settings.someoneDun)}
        mine={mine[vid]}
        draft={still?.draft}
        onClose={() => setSheet(null)}
        onSend={sendComment}
        slot={
          vid === 'p1' ? (
            shared.sequel ? (
              <div className="slot">
                <QuoteCard
                  cover={videos.p2.cover}
                  label="后续"
                  meta={videos.p2.date}
                  title={videos.p2.title}
                  likes={videos.p2.likes}
                  onClick={() => go('p2')}
                />
              </div>
            ) : settings.someoneDun && !bannerOff ? (
              <DunTag
                label={`${DUN_COUNT}人在等待后续`}
                action="蹲后续"
                done={shared.squatted}
                doneLabel="已蹲"
                testId="squat"
                onAction={() => squat(!shared.squatted)}
                onClose={() => setBannerOff(true)}
              />
            ) : null
          ) : (
            <div className="slot">
              <QuoteCard
                cover={videos.p1.cover}
                label="上集"
                meta="2天前"
                title={videos.p1.title}
                likes={videos.p1.likes}
                onClick={() => go('p1')}
              />
            </div>
          )
        }
      />

      <ExpandSheet
        open={sheet === 'expand'}
        top={expTop}
        video={v}
        linked={linked}
        linkedLabel={linkedLabel}
        onOpenLinked={() => go(vid === 'p1' ? 'p2' : 'p1')}
      />

      <ChapterSheet
        open={sheet === 'chapters'}
        video={v}
        chapters={chapters}
        idx={chapIdx}
        onPick={(at) => {
          seek(at + 0.002)
          setSheet(null)
        }}
        onClose={() => setSheet(null)}
      />

      {toast}

      {notif && (
        <button className="notif" style={{ top: safeTop + 6 }} onClick={() => go('p2')}>
          <I.AppIcon size={38} />
          <span className="n-main">
            <span className="n-top">
              <b>起来了，你蹲的后续来了</b>
              <span>现在</span>
            </span>
            <span className="n-body">
              @{CREATOR.name}：{videos.p2.title}
            </span>
          </span>
          <img className="n-thumb" src={IMG.p2} alt="" />
        </button>
      )}
    </div>
  )
}

export function DunTag({
  label,
  action,
  done = false,
  doneLabel = '已蹲',
  testId,
  onAction,
  onClose,
}: {
  label: string
  action: string
  done?: boolean
  doneLabel?: string
  testId?: string
  onAction: () => void
  onClose: () => void
}) {
  return (
    <div className="slot dun-slot">
      <div className="dun-tag">
        <span className="crowd">
          {SQUATTERS.slice(0, 4).map((person) => (
            <span key={person.name}>
              <Avatar person={person} size={26} />
            </span>
          ))}
        </span>
        <span className="dun-txt">{label}</span>
        <button className={`dun-btn${done ? ' done' : ''}`} data-testid={testId} onClick={onAction}>
          {done ? doneLabel : action}
        </button>
        <button className="dun-x" onClick={onClose} aria-label="关闭">
          <I.Close size={12} />
        </button>
      </div>
    </div>
  )
}

function CommentRow({ c, fresh = false }: { c: CommentData; fresh?: boolean }) {
  return (
    <div className={`c-row${fresh ? ' fresh' : ''}`}>
      <Avatar person={c.person} size={36} />
      <div className="c-main">
        <div className="c-name">{c.person.name}</div>
        <div className="c-text">
          <RichText text={c.text} />
        </div>
        {c.image && <img className="c-img" src={c.image} alt="" />}
        <div className="c-meta">
          <span>{c.meta}</span>
          <span className="c-reply">回复</span>
          <span className="c-acts">
            <span>
              <I.HeartOutline size={17} />
              {c.likes === '0' ? '' : c.likes}
            </span>
            <I.Dislike size={17} />
          </span>
        </div>
        {c.authorLiked && <span className="c-authorliked">作者赞过</span>}
        {c.replies && (
          <div className="c-more">
            <i />
            展开 {c.replies} 条回复
            <I.ChevronDown size={13} />
          </div>
        )}
      </div>
    </div>
  )
}

function CommentSheet({
  open,
  top,
  video,
  comments,
  mine,
  draft = '',
  slot,
  onClose,
  onSend,
}: {
  open: boolean
  top: number
  video: VideoData
  comments: CommentData[]
  mine: CommentData[]
  draft?: string
  slot: ReactNode
  onClose: () => void
  onSend: (text: string) => void
}) {
  const [text, setText] = useState(draft)
  const [composing, setComposing] = useState(draft !== '')
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) return
    setComposing(false)
    setText('')
  }, [open])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [video.id])

  const send = () => {
    const t = text.trim()
    if (!t) return
    onSend(t)
    setText('')
    setComposing(false)
    inputRef.current?.blur()
    bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`sheet cmt${open ? ' open' : ''}`} style={{ top }}>
      <div className="cmt-head">
        <div className="cmt-tabs">
          <b>评论 {video.comments}</b>
          <span>AI 解析</span>
        </div>
        <button className="round">
          <I.Expand size={16} />
        </button>
        <button className="round" onClick={onClose}>
          <I.Close size={16} />
        </button>
      </div>
      <div className="cmt-body" ref={bodyRef}>
        {slot}
        {mine.map((c, i) => (
          <CommentRow key={c.id} c={c} fresh={i === 0} />
        ))}
        {comments.map((c) => (
          <CommentRow key={c.id} c={c} />
        ))}
        <div className="cmt-end">暂时没有更多了</div>
      </div>
      <div className="composer">
        {composing && (
          <div className="quick-emoji">
            <button className="qe-dun" onMouseDown={(e) => e.preventDefault()} onClick={() => setText((t) => `${t}[蹲后续]`)}>
              <I.Mascot size={30} />
            </button>
            {QUICK_EMOJI.map((e) => (
              <button key={e} onMouseDown={(ev) => ev.preventDefault()} onClick={() => setText((t) => t + e)}>
                {e}
              </button>
            ))}
          </div>
        )}
        <div className="cmp-row">
          <div className="cmp-pill">
            <input
              ref={inputRef}
              value={text}
              placeholder={video.placeholder}
              data-testid="comment-input"
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setComposing(true)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            {!text && (
              <>
                <I.ImageIc size={24} />
                <I.At size={24} />
              </>
            )}
            <button className="cmp-emoji" onMouseDown={(e) => e.preventDefault()} onClick={() => setComposing((x) => !x)}>
              <I.Smile size={24} />
            </button>
          </div>
          {text && (
            <button className="send" onMouseDown={(e) => e.preventDefault()} onClick={send}>
              发送
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ExpandSheet({
  open,
  top,
  video,
  linked,
  linkedLabel,
  onOpenLinked,
}: {
  open: boolean
  top: number
  video: VideoData
  linked: VideoData | null
  linkedLabel: string
  onOpenLinked: () => void
}) {
  const cards = [
    ...(linked ? [{ cover: linked.cover, title: linked.title, person: CREATOR, likes: linked.likes, tag: linkedLabel, onClick: onOpenLinked }] : []),
    ...RECS.map((r) => ({ ...r, tag: '', onClick: undefined })),
  ].slice(0, 4)
  const columns = [cards.filter((_, i) => i % 2 === 0), cards.filter((_, i) => i % 2 === 1)]
  const year = '2026年'
  return (
    <div className={`sheet exp${open ? ' open' : ''}`} style={{ top }}>
      <div className="grab" />
      <div className="exp-body">
        <div className="exp-author">
          <Avatar person={CREATOR} size={28} />
          <b>{CREATOR.name}</b>
          <span>关注</span>
        </div>
        <p className="exp-cap">
          <RichText text={`${video.caption} ${video.tags.join(' ')}`} /> <span className="exp-date">{year + video.date}</span>
        </p>
        <div className="grid">
          {columns.map((col, ci) => (
            <div className="col" key={ci}>
              {col.map((card, i) => (
                <button className="rc" key={card.title} onClick={card.onClick}>
                  <span className={`rc-cover${(ci + i) % 2 ? ' tall' : ''}`}>
                    <img src={card.cover} alt="" />
                    {card.tag && <span className="rc-tag">{card.tag}</span>}
                  </span>
                  <span className="rc-title">{card.title}</span>
                  <span className="rc-foot">
                    <Avatar person={card.person} size={18} />
                    <span className="rc-name">{card.person.name}</span>
                    <span className="rc-like">
                      <I.HeartOutline size={15} />
                      {card.likes}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChapterStrip({
  chapters,
  idx,
  p,
  smooth,
  onSeek,
}: {
  chapters: VideoData['chapters']
  idx: number
  p: number
  smooth: boolean
  onSeek: (at: number) => void
}) {
  const stripRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const strip = stripRef.current
    const chip = strip?.children[idx] as HTMLElement | undefined
    if (strip && chip) strip.scrollTo({ left: chip.offsetLeft - 12, behavior: smooth ? 'smooth' : 'instant' })
  }, [idx, smooth])
  const bounds = [...chapters.map((c) => c.at), 1]
  return (
    <div className="chap-strip">
      <div className="chap-chips" ref={stripRef}>
        {chapters.map((c, i) => (
          <button key={c.time} className={`cc${i === idx ? ' on' : ''}`} onClick={() => onSeek(c.at + 0.002)}>
            {i === idx && <I.Bars size={15} />}
            {c.time} {c.title}
          </button>
        ))}
      </div>
      <div className="seg-bar">
        {chapters.map((c, i) => {
          const start = c.at
          const end = bounds[i + 1]
          const fill = Math.min(1, Math.max(0, (p - start) / (end - start)))
          return (
            <span key={c.time} style={{ flexGrow: end - start }}>
              <i style={{ width: `${fill * 100}%` }} />
            </span>
          )
        })}
      </div>
    </div>
  )
}

function ChapterSheet({
  open,
  video,
  chapters,
  idx,
  onPick,
  onClose,
}: {
  open: boolean
  video: VideoData
  chapters: VideoData['chapters']
  idx: number
  onPick: (at: number) => void
  onClose: () => void
}) {
  return (
    <>
      <div className={`scrim dim${open ? ' on' : ''}`} onClick={onClose} />
      <div className={`sheet chap${open ? ' open' : ''}`}>
        <div className="chap-head">
          <b>章节</b>
          <span>共{chapters.length}节</span>
          <button className="round" onClick={onClose}>
            <I.Close size={16} />
          </button>
        </div>
        {chapters.map((c, i) => (
          <button key={c.time} className={`chap-row${i === idx ? ' on' : ''}`} onClick={() => onPick(c.at)}>
            <img src={video.cover} alt="" style={{ objectPosition: `50% ${20 + i * 30}%` }} />
            <span className="cr-time">{c.time}</span>
            <span className="cr-title">{c.title}</span>
            {i === idx && <I.Bars size={16} />}
          </button>
        ))}
      </div>
    </>
  )
}
