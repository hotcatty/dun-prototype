import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Avatar, RichText, RightRail, StatusBar, useToast } from './Common'
import { COMMENTS_P1_DUN, COMMENTS_P1_HOT, CREATOR, DUN_COUNT, IMG, WORKS, getVideos, type CommentData } from './data'
import * as I from './icons'
import type { SetShared, Settings } from './types'
import { DunTag } from './Viewer'

type Page = 'home' | 'camera' | 'album' | 'preview' | 'publish' | 'posted'

const ALBUM = [
  { src: IMG.p2, dur: '01:52', flip: false },
  { src: IMG.rec2, dur: '00:27', flip: false },
  { src: IMG.rec1, dur: '00:19', flip: false },
  { src: IMG.p1, dur: '01:46', flip: false },
  { src: IMG.rec3, dur: '00:12', flip: false },
  { src: IMG.rec1, dur: '00:33', flip: true },
  { src: IMG.rec3, dur: '00:08', flip: true },
  { src: IMG.rec2, dur: '00:41', flip: true },
  { src: IMG.p1, dur: '00:15', flip: true },
]

const CAM_TOOLS = ['翻转', '闪光灯', '设置', '麦克风', '倒计时', '美颜']

export interface CreatorStill {
  page?: Page
  picker?: boolean
  quote?: string
  upload?: 'up' | 'done'
  toast?: string
  comments?: boolean
  stickers?: boolean
  sticker?: boolean
  fromComment?: boolean
}

interface CreatorProps {
  settings: Settings
  setShared: SetShared
  framed: boolean
  onPublished: () => void
  still?: CreatorStill
}

export function Creator({ settings, setShared, framed, onPublished, still }: CreatorProps) {
  const videos = useMemo(() => getVideos(settings.someoneDun), [settings.someoneDun])
  const [page, setPage] = useState<Page>(still?.page ?? 'home')
  const [picked, setPicked] = useState(0)
  const [picker, setPicker] = useState(still?.picker ?? false)
  const [quote, setQuote] = useState<string | null>(still?.quote ?? null)
  const [fromComment, setFromComment] = useState(still?.fromComment ?? false)
  const [stickerOn, setStickerOn] = useState(still?.sticker ?? false)
  const [stickers, setStickers] = useState(still?.stickers ?? false)
  const [comments, setComments] = useState(still?.comments ?? false)
  const [authorBannerOff, setAuthorBannerOff] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [upload, setUpload] = useState<null | 'up' | 'done'>(still?.upload ?? null)
  const [pct, setPct] = useState(still?.upload === 'up' ? 89 : 0)
  const [toast, showToast] = useToast(still?.toast)
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const safeTop = framed ? 47 : 0
  const quoted = WORKS.find((w) => w.id === quote)
  const clip = ALBUM[picked]
  const frozen = still !== undefined
  const authorComments = settings.someoneDun ? COMMENTS_P1_DUN : COMMENTS_P1_HOT

  const openActive = () => {
    setComments(false)
    setFromComment(false)
    setQuote(null)
    setStickerOn(false)
    setStickers(false)
    setPage('camera')
  }

  const openPassive = () => {
    setComments(false)
    setFromComment(true)
    setQuote('p1')
    setStickerOn(false)
    setPage('camera')
  }

  const useClip = (index: number) => {
    setPicked(index)
    setStickers(false)
    setPage('preview')
  }

  const publish = () => {
    if (frozen) return
    const linked = quote === 'p1'
    const notify = linked && settings.someoneDun
    const withSticker = notify && stickerOn
    setPicker(false)
    setStickers(false)
    setPage('posted')
    setUpload('up')
    setPct(8)
    const started = Date.now()
    const tick = window.setInterval(() => {
      const t = Math.min(1, (Date.now() - started) / 1400)
      setPct(Math.round(8 + t * 92))
      if (t < 1) return
      window.clearInterval(tick)
      setPct(100)
      setUpload('done')
      if (linked) {
        setShared((s) => ({ ...s, sequel: true, sticker: withSticker, sequelKey: s.sequelKey + 1 }))
        onPublished()
      }
      showToast(notify ? '发布成功，已通知蹲后续提示' : '发布成功', 2600)
      timers.current.push(window.setTimeout(() => setUpload(null), 2800))
    }, 80)
    timers.current.push(tick)
  }

  const feed = page === 'posted' ? videos.p2 : videos.p1
  const feedCover = page === 'posted' ? clip.src : videos.p1.cover

  return (
    <div className="screen creator" style={{ '--top': `${safeTop}px` } as CSSProperties}>
      {framed && <StatusBar dark={page === 'publish'} />}

      {(page === 'home' || page === 'posted') && (
        <div className="cpage home">
          <div className="media" style={comments ? { top: safeTop + 10, left: '34.5%', width: '31%', height: '28%' } : { inset: 0 }}>
            <img className="frame" src={feedCover} alt="" />
            {page === 'posted' && stickerOn && (
              <span className="sticker">
                <span className="st-row">
                  <span className="st-emo">🐱</span>
                  <b>{settings.someoneDun ? `${DUN_COUNT}人蹲的后续来了` : '后续来了'}</b>
                </span>
                <span className="st-sub">上集：{videos.p1.title}</span>
              </span>
            )}
          </div>
          {upload === 'up' && (
            <div className="up-float" style={{ top: safeTop + 58 }}>
              <span className="up-ring" style={{ '--p': `${pct}%` } as CSSProperties}>
                <img src={clip.src} alt="" />
                <b>{pct}%</b>
              </span>
            </div>
          )}
          <div className={`ov${comments ? ' hidden' : ''}`} style={{ top: safeTop }}>
            {page === 'posted' ? (
              <div className="topbar">
                <button className="tb-back" onClick={() => setPage('home')}>
                  <I.Back size={26} />
                </button>
                <div className="tb-search">
                  <I.Search size={17} />
                  <span className="q">{videos.p1.search}</span>
                  <b>搜索</b>
                </div>
              </div>
            ) : (
              <div className="home-top">
                <I.Menu size={24} />
                <div className="home-tabs">
                  <span>同城</span>
                  <span>关注</span>
                  <span>商城</span>
                  <b>推荐</b>
                </div>
                <I.Search size={24} />
              </div>
            )}
          </div>
          {comments && (
            <div className="pv-search show" style={{ top: safeTop + 14 }}>
              <I.Search size={26} />
            </div>
          )}
          <div className={`ov ov-bottom${comments ? ' hidden' : ''}`}>
            <RightRail
              person={CREATOR}
              likes={feed.likes}
              comments={feed.comments}
              stars={feed.stars}
              shares={feed.shares}
              onComment={() => page === 'home' && setComments(true)}
            />
            <div className="left">
              <div className="id-row">
                <b className="id-name">@{CREATOR.name}</b>
                <span className="id-date">· {feed.date}</span>
              </div>
              <div className="cap">
                <RichText text={page === 'posted' ? feed.short : videos.p1.short} />
              </div>
            </div>
            {page === 'home' && (
              <nav className="tabbar">
                <b>首页</b>
                <span>朋友</span>
                <button className="plus" onClick={openActive} data-testid="plus">
                  <span>
                    <I.Plus size={18} />
                  </span>
                </button>
                <span className="msg">
                  消息<i>3</i>
                </span>
                <span>我</span>
              </nav>
            )}
            {page === 'posted' && (
              <button className="related">
                <I.Search size={15} />
                <span>
                  相关搜索 · <em>{videos.p2.related}</em>
                </span>
                <I.ChevronRight size={15} />
              </button>
            )}
            {page === 'posted' && (
              <div className="vinput">
                <span>期待你的评论</span>
                <I.ImageIc size={24} />
                <I.At size={24} />
                <I.Smile size={24} />
              </div>
            )}
          </div>

          <div className={`sheet cmt${comments ? ' open' : ''}`} style={{ top: '32%' }}>
            <div className="cmt-head">
              <div className="cmt-tabs">
                <b>评论 {videos.p1.comments}</b>
                <span>AI 解析</span>
              </div>
              <button className="round" onClick={() => setComments(false)}>
                <I.Close size={16} />
              </button>
            </div>
            <div className="cmt-body">
              {settings.someoneDun && !authorBannerOff && (
                <DunTag
                  label={`${DUN_COUNT}人在等你的后续`}
                  action="去创作"
                  testId="go-create"
                  onAction={openPassive}
                  onClose={() => setAuthorBannerOff(true)}
                />
              )}
              {authorComments.map((c) => (
                <AuthorComment key={c.id} c={c} />
              ))}
            </div>
            <div className="composer">
              <div className="cmp-row">
                <div className="cmp-pill">
                  <input readOnly placeholder={videos.p1.placeholder} />
                  <I.ImageIc size={24} />
                  <I.At size={24} />
                  <I.Smile size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {page === 'camera' && (
        <div className="cpage camera">
          <button
            className="cam-x"
            style={{ top: safeTop + 8 }}
            onClick={() => {
              setPage('home')
              if (fromComment) setComments(true)
            }}
          >
            <I.Close size={22} />
          </button>
          <div className="cam-music">♪ 选择音乐</div>
          <div className="cam-tools">
            {CAM_TOOLS.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
          <div className="cam-modes">
            <span>分段拍</span>
            <span>照片</span>
            <b>视频</b>
          </div>
          <div className="cam-shot">
            <span />
            <button className="cam-rec" data-testid="record" onClick={() => useClip(0)} aria-label="拍摄" />
            <button className="cam-album" data-testid="open-album" onClick={() => setPage('album')}>
              <img src={IMG.p2} alt="" />
              相册
            </button>
          </div>
        </div>
      )}

      {page === 'album' && (
        <div className="cpage album">
          <div className="al-top">
            <button onClick={() => setPage('camera')}>
              <I.Close size={24} />
            </button>
            <b>
              最近项目
              <I.ChevronDown size={14} />
            </b>
            <span />
          </div>
          <div className="al-tabs">
            <b>全部</b>
            <span>视频</span>
            <span>图片</span>
          </div>
          <div className="al-grid">
            {ALBUM.map((a, i) => (
              <button key={i} className={`al-cell${picked === i ? ' on' : ''}`} onClick={() => setPicked(i)}>
                <img src={a.src} alt="" style={a.flip ? { transform: 'scaleX(-1)', objectPosition: '30% 60%' } : undefined} />
                <span className="al-dur">{a.dur}</span>
                <span className="al-check">{picked === i ? 1 : ''}</span>
              </button>
            ))}
          </div>
          <div className="al-bottom">
            <span>已选 1 个</span>
            <button className="red-btn" data-testid="album-next" onClick={() => useClip(picked)}>
              下一步
            </button>
          </div>
        </div>
      )}

      {page === 'preview' && (
        <div className="cpage preview">
          <div className="media" style={{ inset: 0 }}>
            <img className="frame" src={clip.src} alt="" style={clip.flip ? { transform: 'scaleX(-1)' } : undefined} />
            {stickerOn && (
              <span className="sticker">
                <span className="st-row">
                  <span className="st-emo">🐱</span>
                  <b>{DUN_COUNT}人蹲的后续来了</b>
                </span>
                <span className="st-sub">上集：{videos.p1.title}</span>
              </span>
            )}
          </div>
          <div className="pv-top" style={{ top: safeTop + 6 }}>
            <button onClick={() => setPage('album')}>
              <I.Back size={26} />
            </button>
            <span className="pv-music">♪ 可爱无限循环</span>
            <I.Gear size={22} />
          </div>
          <div className="pv-tools">
            <span>文字</span>
            <button data-testid="open-stickers" onClick={() => setStickers(true)}>
              贴纸
            </button>
            <span>话题</span>
            <span>标记</span>
          </div>
          <div className="pv-bottom">
            <button className="red-btn" data-testid="preview-next" onClick={() => setPage('publish')}>
              下一步
            </button>
          </div>
          {stickers && (
            <>
              <div className="scrim dim on" onClick={() => setStickers(false)} />
              <div className="sheet stick open">
                <div className="pk-head">
                  <b>贴纸</b>
                </div>
                <div className="st-grid">
                  {settings.someoneDun && (
                    <button
                      className="st-sequel"
                      data-testid="sequel-sticker"
                      onClick={() => {
                        setStickerOn(true)
                        setStickers(false)
                      }}
                    >
                      <span>
                        🐱 {DUN_COUNT}人蹲的后续来了
                        <small>上集：{videos.p1.short}</small>
                      </span>
                      后续贴图
                    </button>
                  )}
                  {['🍳', '🍒', '🎵', '⭐', '🧋', '💙', '🐱', '💛'].map((emo) => (
                    <button key={emo} onClick={() => setStickers(false)}>
                      {emo}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {page === 'publish' && (
        <div className="cpage publish">
          <div className="pb-top">
            <button onClick={() => setPage('preview')}>
              <I.Back size={24} />
            </button>
            <span>预览</span>
          </div>
          <div className="pb-scroll">
            <div className="pb-desc">
              <div className="pb-fields">
                <input className="pb-title" value={title} placeholder="添加标题" onChange={(e) => setTitle(e.target.value)} />
                <textarea value={desc} placeholder="添加作品描述..." onChange={(e) => setDesc(e.target.value)} />
              </div>
              <div className="pb-cover">
                <img src={clip.src} alt="" />
                <span>选封面</span>
              </div>
            </div>
            <div className="pb-chips">
              <span>
                <I.Hash size={14} />
                话题
              </span>
              <span>
                <I.At size={14} />
                朋友
              </span>
            </div>
            <button className="pb-row" onClick={() => setPicker(true)} data-testid="quote-row">
              <I.LinkIc size={21} />
              <span className="pr-label">引用我的作品</span>
              {quoted ? (
                <span className="quote-chip">
                  <b>后续</b>
                  <em>{quoted.title}</em>
                  <i
                    onClick={(e) => {
                      e.stopPropagation()
                      setQuote(null)
                    }}
                  >
                    <I.Close size={12} />
                  </i>
                </span>
              ) : (
                <I.ChevronRight size={16} />
              )}
            </button>
            <button className="pb-row">
              <I.Pin size={21} />
              <span className="pr-label">选择地点</span>
              <I.ChevronRight size={16} />
            </button>
            <button className="pb-row">
              <I.Globe size={21} />
              <span className="pr-label">公开 · 所有人可见</span>
              <I.ChevronRight size={16} />
            </button>
          </div>
          <div className="pb-bottom">
            <button className="gray-btn">限时日常</button>
            <button className="red-btn" onClick={publish} data-testid="publish">
              发作品
            </button>
          </div>
          {picker && (
            <>
              <div className="scrim dim on" onClick={() => setPicker(false)} />
              <div className="sheet pick open">
                <div className="grab" />
                <div className="pk-head">
                  <b>引用我的作品</b>
                </div>
                {WORKS.map((w) => (
                  <button
                    key={w.id}
                    className="pk-row"
                    onClick={() => {
                      setQuote(w.id)
                      setPicker(false)
                    }}
                  >
                    <img src={w.cover} alt="" />
                    <span className="pk-main">
                      <span className="pk-title">{w.title}</span>
                      <span className="pk-meta">
                        {w.date} · {w.likes}
                        {w.id === 'p1' && settings.someoneDun && <em className="pk-wait">{DUN_COUNT}人在蹲后续</em>}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {toast}
    </div>
  )
}

function AuthorComment({ c }: { c: CommentData }) {
  return (
    <div className="c-row">
      <Avatar person={c.person} size={36} />
      <div className="c-main">
        <div className="c-name">{c.person.name}</div>
        <div className="c-text">
          <RichText text={c.text} />
        </div>
        <div className="c-meta">
          <span>{c.meta}</span>
          <span className="c-reply">回复</span>
        </div>
      </div>
    </div>
  )
}
