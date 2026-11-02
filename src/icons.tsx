import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

const base = (size = 24) => ({ width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true })

export const Back = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M15 4.5 7.5 12 15 19.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Search = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="10.8" cy="10.8" r="6.6" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const Heart = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path
      fill="currentColor"
      d="M12 20.6c-.3 0-.6-.1-.8-.3C6.3 16.2 2.6 13.1 2.6 8.9 2.6 6 4.8 3.8 7.6 3.8c1.8 0 3.4.9 4.4 2.3 1-1.4 2.6-2.3 4.4-2.3 2.8 0 5 2.2 5 5.1 0 4.2-3.7 7.3-8.6 11.4-.2.2-.5.3-.8.3Z"
    />
  </svg>
)

export const HeartOutline = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
      d="M12 19.6C7.2 15.6 3.6 12.6 3.6 8.9c0-2.4 1.8-4.1 4-4.1 1.7 0 3.1 1 3.9 2.4h1c.8-1.4 2.2-2.4 3.9-2.4 2.2 0 4 1.7 4 4.1 0 3.7-3.6 6.7-8.4 10.7Z"
    />
  </svg>
)

export const Dislike = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
      d="M12 19.6C7.2 15.6 3.6 12.6 3.6 8.9c0-2.4 1.8-4.1 4-4.1 1.7 0 3.1 1 3.9 2.4l-1.4 3.2 2.6 1.6-1.6 3.4"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
      d="M13.6 6.4c.8-1 1.8-1.6 2.8-1.6 2.2 0 4 1.7 4 4.1 0 3.5-3.2 6.4-7.6 10.1"
    />
  </svg>
)

export const Comment = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path
      fill="currentColor"
      d="M12 3C6.6 3 2.6 6.5 2.6 11c0 2.5 1.2 4.6 3.2 6.1l-.6 3.4c-.1.5.4.9.9.6l3.4-1.9c.8.2 1.6.3 2.5.3 5.4 0 9.4-3.5 9.4-8S17.4 3 12 3Z"
    />
    <circle cx="7.9" cy="11" r="1.25" fill="rgba(0,0,0,.38)" />
    <circle cx="12" cy="11" r="1.25" fill="rgba(0,0,0,.38)" />
    <circle cx="16.1" cy="11" r="1.25" fill="rgba(0,0,0,.38)" />
  </svg>
)

export const Star = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path
      fill="currentColor"
      d="M12 2.8c.4 0 .7.2.9.6l2.3 4.7 5.1.8c.8.1 1.1 1.1.5 1.7l-3.7 3.6.9 5.1c.1.8-.7 1.4-1.4 1l-4.6-2.4-4.6 2.4c-.7.4-1.5-.2-1.4-1l.9-5.1L3.2 10.6c-.6-.6-.3-1.6.5-1.7l5.1-.8 2.3-4.7c.2-.4.5-.6.9-.6Z"
    />
  </svg>
)

export const Share = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path fill="currentColor" d="M13.4 4.2c0-.6.7-.9 1.2-.5l7 6.3c.4.3.4.9 0 1.2l-7 6.3c-.5.4-1.2.1-1.2-.5v-3.2c-5 0-8.1 1.6-10 4.8-.2.4-.8.2-.8-.2.5-5.7 3.9-9.6 10.8-10.3V4.2Z" />
  </svg>
)

export const Thumb = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path fill="currentColor" d="M7 10.2h-2.4c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1H7v-10Zm1.6 10h8.3c1 0 1.8-.7 2-1.6l1.4-6.4c.3-1.3-.7-2.4-2-2.4h-4.1l.6-3.1c.2-1-.4-2-1.4-2.3-.4-.1-.8.1-1 .4l-3.8 5.6v9.8Z" />
  </svg>
)

export const ChevronRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m9.5 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronLeft = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m14.5 6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronDown = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m6 9.5 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ImageIc = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="9" cy="9.6" r="1.6" fill="currentColor" />
    <path d="m4.5 17.5 5-4.6 3.4 3 2.6-2.2 4 3.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
)

export const At = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M15.6 12v1.4c0 1.6 1 2.6 2.3 2.6 1.4 0 2.4-1.2 2.4-3.6a8.3 8.3 0 1 0-3.3 6.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const Smile = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="9" cy="10" r="1.2" fill="currentColor" />
    <circle cx="15" cy="10" r="1.2" fill="currentColor" />
    <path d="M8.3 14.2c.9 1.4 2.2 2.1 3.7 2.1s2.8-.7 3.7-2.1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const Close = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m6.5 6.5 11 11m0-11-11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const Expand = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M9 4.5H5.5a1 1 0 0 0-1 1V9M15 4.5h3.5a1 1 0 0 1 1 1V9M9 19.5H5.5a1 1 0 0 1-1-1V15M15 19.5h3.5a1 1 0 0 0 1-1V15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
)

export const Chapters = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 7h14M5 12h14M5 17h9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
)

export const Bars = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M6 16v-3M10 16V8M14 16v-6M18 16V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const Hash = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M9.5 4 8 20M16 4l-1.5 16M4.5 9h15.5M4 15h15.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
)

export const Pin = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
)

export const Globe = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3.8 12h16.4M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5s1.1-6.1 3.5-8.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)

export const Gear = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="5.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="2.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 3.4v3M12 17.6v3M20.6 12h-3M6.4 12h-3M18.1 5.9l-2.1 2.1M8 16l-2.1 2.1M18.1 18.1 16 16M8 8 5.9 5.9"
      stroke="currentColor"
      strokeWidth="2.6"
    />
  </svg>
)

export const LinkIc = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M10.4 13.6a3.6 3.6 0 0 0 5.1 0l3-3a3.6 3.6 0 0 0-5.1-5.1l-1.1 1.1" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    <path d="M13.6 10.4a3.6 3.6 0 0 0-5.1 0l-3 3a3.6 3.6 0 0 0 5.1 5.1l1.1-1.1" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
)

export const Menu = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4.5 6.5h15M4.5 12h15M4.5 17.5h15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const Check = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m5.5 12.5 4 4 9-9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Plus = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
)

export const Reset = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v3.6h3.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Swap = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M7 7.5h11.5L15 4M17 16.5H5.5L9 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Mascot({ size = 24, standing = false, body = '#FE2C55' }: { size?: number; standing?: boolean; body?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <ellipse cx="16" cy="29.6" rx="9" ry="1.5" fill="rgba(0,0,0,.14)" />
      {standing ? (
        <>
          <rect x="11.2" y="22" width="3.2" height="7" rx="1.6" fill="#3A2A22" />
          <rect x="17.6" y="22" width="3.2" height="7" rx="1.6" fill="#3A2A22" />
          <path d="M9.5 24.5c0-5.6 2.9-8.6 6.5-8.6s6.5 3 6.5 8.6Z" fill={body} />
          <path d="M9.6 19.2 6.8 15.6M22.4 19.2l2.8-3.6" stroke="#FFD9B3" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M7.4 28.6c0-7 3.8-10.4 8.6-10.4s8.6 3.4 8.6 10.4Z" fill={body} />
          <path d="M10.2 24.4c3.6 2.2 8 2.2 11.6 0" fill="none" stroke="#FFD9B3" strokeWidth="2.3" strokeLinecap="round" />
        </>
      )}
      <circle cx="16" cy={standing ? 10 : 12.2} r="6.6" fill="#FFD9B3" />
      <path
        d={standing ? 'M9.4 9.4c.6-4.4 3.4-6.4 6.6-6.4s6 2 6.6 6.4c-2-1.5-4.2-2.1-6.6-2.1s-4.6.6-6.6 2.1Z' : 'M9.4 11.6c.6-4.4 3.4-6.4 6.6-6.4s6 2 6.6 6.4c-2-1.5-4.2-2.1-6.6-2.1s-4.6.6-6.6 2.1Z'}
        fill="#3A2A22"
      />
      <circle cx="13.6" cy={standing ? 10.8 : 13} r=".95" fill="#3A2A22" />
      <circle cx="18.4" cy={standing ? 10.8 : 13} r=".95" fill="#3A2A22" />
      {standing ? (
        <path d="M14 13.4c1.2 1 2.8 1 4 0" fill="none" stroke="#3A2A22" strokeWidth="1" strokeLinecap="round" />
      ) : (
        <circle cx="16" cy="15.4" r=".7" fill="#3A2A22" />
      )}
    </svg>
  )
}

export function AppIcon({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" aria-hidden>
      <rect width="38" height="38" rx="9" fill="#111" />
      <g transform="translate(10 7)">
        <path d="M9.6 1v15.2a4.6 4.6 0 1 1-4.6-4.6" fill="none" stroke="#25F4EE" strokeWidth="3.4" strokeLinecap="round" transform="translate(-1.2 -1.2)" />
        <path d="M9.6 1c.4 3.3 2.7 5.4 6 5.7" fill="none" stroke="#25F4EE" strokeWidth="3.4" strokeLinecap="round" transform="translate(-1.2 -1.2)" />
        <path d="M9.6 1v15.2a4.6 4.6 0 1 1-4.6-4.6" fill="none" stroke="#FE2C55" strokeWidth="3.4" strokeLinecap="round" transform="translate(1.2 1.2)" />
        <path d="M9.6 1c.4 3.3 2.7 5.4 6 5.7" fill="none" stroke="#FE2C55" strokeWidth="3.4" strokeLinecap="round" transform="translate(1.2 1.2)" />
        <path d="M9.6 1v15.2a4.6 4.6 0 1 1-4.6-4.6" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M9.6 1c.4 3.3 2.7 5.4 6 5.7" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
      </g>
    </svg>
  )
}
