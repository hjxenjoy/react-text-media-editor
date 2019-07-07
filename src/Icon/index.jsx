import React from 'react'

const SvgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentcolor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: '1',
}

export function ToggleIcon(props) {
  return (
    <span className={`rtme-icon${props.active ? ' rtme-icon-active' : ''}`} onClick={props.onClick}>
      <svg {...SvgProps}>
        <path d="M17 12L7 12M12 17L12 7" />
      </svg>
    </span>
  )
}

export function UploadImage(props) {
  return (
    <span className="rtme-icon" onClick={props.onClick}>
      <svg {...SvgProps}>
        <path d="M8 7l.74-1.11A2 2 0 0 1 10.404 5h3.192a2 2 0 0 1 1.664.89L16 7h5v11H3V7h5z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </span>
  )
}

export function UploadVideo(props) {
  return (
    <span className="rtme-icon" onClick={props.onClick}>
      <svg {...SvgProps}>
        <path strokeLinecap="round" d="M16 10.087l5-1.578v7.997l-4.998-1.578" />
        <path d="M16 7H3v11h13z" />
      </svg>
    </span>
  )
}

export function MoveIcon(props) {
  return (
    <span className="rtme-move-icon" onClick={props.onClick}>
      <svg {...SvgProps}>
        <path d="M6 7L18 7M6 12L18 12M6 17L18 17" />
      </svg>
    </span>
  )
}
