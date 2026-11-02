import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Person } from './data'
import { Comment, Heart, HeartOutline, Mascot, Share, Star } from './icons'

export function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <>
      <div className="island" />
      <div className={`statusbar${dark ? ' dark' : ''}`}>
        <span>20:36</span>
        <span className="sb-right">
          <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden>
            <rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" />
            <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
            <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" />
          </svg>
          <span className="sb-5g">5G</span>
          <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden>
            <rect x="0.5" y="0.5" width="23" height="12" rx="3.6" fill="none" stroke="currentColor" opacity=".45" />
            <rect x="2.2" y="2.2" width="17" height="8.6" rx="2.2" fill="currentColor" />
            <path d="M25 4.3v4.4c.9-.3 1.5-1.2 1.5-2.2s-.6-1.9-1.5-2.2Z" fill="currentColor" opacity=".5" />
          </svg>
        </span>
      </div>
    </>
  )
}

export function useToast(initial?: string): [ReactNode, (text: string, ms?: number) => void] {
  const [toast, setToast] = useState<{ text: string; key: number } | null>(initial ? { text: initial, key: 0 } : null)
  const timer = useRef<number | undefined>(undefined)
  const show = useCallback((text: string, ms = 1800) => {
    window.clearTimeout(timer.current)
    setToast({ text, key: Date.now() })
    timer.current = window.setTimeout(() => setToast(null), ms)
  }, [])
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const node = toast ? (
    <div className="toast" key={toast.key}>
      {toast.text}
    </div>
  ) : null
  return [node, show]
}

export function Avatar({ person, size = 36, className = '' }: { person: Person; size?: number; className?: string }) {
  return (
    <span
      className={`emoji-av ${className}`}
      style={{ width: size, height: size, background: person.color, fontSize: Math.round(size * 0.52) }}
    >
      {person.img ? <img src={person.img} alt="" /> : person.emoji}
    </span>
  )
}

export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[蹲后续\]|#[^\s#]+)/g).filter(Boolean)
  return (
    <>
      {parts.map((part, i) => {
        if (part === '[蹲后续]') {
          return (
            <span className="emo" key={i} title="蹲后续">
              <Mascot size={20} />
            </span>
          )
        }
        if (part.startsWith('#')) {
          return (
            <span className="hashtag" key={i}>
              {part}
            </span>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

export function QuoteCard({
  cover,
  label,
  author,
  meta,
  title,
  likes,
  onClick,
  tone = 'gray',
}: {
  cover: string
  label: string
  author?: string
  meta?: string
  title: string
  likes: string
  onClick?: () => void
  tone?: 'gray' | 'white'
}) {
  const aside = meta ?? (author ? `@${author}` : '')
  return (
    <button className={`quote quote-${tone}`} onClick={onClick}>
      <img src={cover} alt="" />
      <span className="q-main">
        <span className="q-from">
          <b>{label}</b>
          {aside && ` · ${aside}`}
        </span>
        <span className="q-title">{title}</span>
      </span>
      <span className="q-like">
        <HeartOutline size={15} />
        {likes}
      </span>
    </button>
  )
}

export function RightRail({
  person,
  likes,
  comments,
  stars,
  shares,
  onComment,
}: {
  person: Person
  likes: string
  comments: string
  stars: string
  shares: string
  onComment: () => void
}) {
  const [liked, setLiked] = useState(false)
  const [starred, setStarred] = useState(false)
  const [followed, setFollowed] = useState(false)
  return (
    <div className="rail">
      <div className="rail-av">
        <Avatar person={person} size={48} />
        {!followed && (
          <button className="rail-follow" onClick={() => setFollowed(true)}>
            +
          </button>
        )}
      </div>
      <button className={`rail-act${liked ? ' liked' : ''}`} onClick={() => setLiked((v) => !v)}>
        <Heart size={38} />
        <span>{likes}</span>
      </button>
      <button className="rail-act" onClick={onComment} data-testid="open-comments">
        <Comment size={37} />
        <span>{comments}</span>
      </button>
      <button className={`rail-act${starred ? ' starred' : ''}`} onClick={() => setStarred((v) => !v)}>
        <Star size={37} />
        <span>{stars}</span>
      </button>
      <button className="rail-act">
        <Share size={36} />
        <span>{shares}</span>
      </button>
      <div className="rail-disc-wrap">
        <div className="rail-disc">
          <Avatar person={person} size={26} />
        </div>
        <span className="rail-same">拍同款</span>
      </div>
    </div>
  )
}

export function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className={`switch${on ? ' on' : ''}`} onClick={() => onChange(!on)} aria-pressed={on}>
      <span />
    </button>
  )
}
