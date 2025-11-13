import React from 'react'
import './Overlay.css'

interface OverlayProps {
  isMobile?: boolean
}

export function Overlay({ isMobile = false }: OverlayProps) {
  return (
    <div className="portfolio-overlay">
    </div>
  )
}
