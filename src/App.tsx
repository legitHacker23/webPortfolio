import { useState, useEffect } from 'react'
import { HeroStage } from './scene/HeroStage'
import { Overlay } from './scene/Overlay'

export default function App() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        (window.innerWidth < 768 && 'ontouchstart' in window)
      setIsMobile(isMobileDevice)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <HeroStage />
      <Overlay isMobile={isMobile} />
    </div>
  )
}


