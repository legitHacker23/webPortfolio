import React, { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PerspectiveCamera } from 'three'
import { Environment } from './Environment'
import { FloatingIcons } from './FloatingIcons'

function ShadowLight({ shadowMapSize }: { shadowMapSize: number }) {
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const { gl } = useThree()
  
  useEffect(() => {
    // Enable shadows on renderer
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
    
    if (lightRef.current) {
      // Set shadow camera target to icon area (center of icon positions)
      // Icons are at Z=1, positions range X: 0.2-0.9, Y: 0.2-0.55
      lightRef.current.target.position.set(0.55, 0.375, 1)
      lightRef.current.target.updateMatrixWorld()
      
      // Update shadow camera to focus tightly on icon area
      if (lightRef.current.shadow.camera) {
        const shadowCam = lightRef.current.shadow.camera as THREE.OrthographicCamera
        // Tight bounds around icon area: X: 0.2-0.9, Y: 0.2-0.55, Z: 0.5-1.5
        shadowCam.left = -0.4
        shadowCam.right = 1.5
        shadowCam.top = 0.7
        shadowCam.bottom = -0.1
        shadowCam.near = 0.5
        shadowCam.far = 2.5
        shadowCam.updateProjectionMatrix()
      }
    }
  }, [gl])
  
  useFrame(() => {
    if (lightRef.current) {
      // Keep shadow camera updated
      if (lightRef.current.shadow.camera) {
        lightRef.current.shadow.camera.updateProjectionMatrix()
      }
    }
  })
  
  return (
    <directionalLight
      ref={lightRef}
      position={[-5, 6, 8]}
      intensity={5.0}
      color="#fffef8"
      castShadow
      shadow-mapSize-width={shadowMapSize}
      shadow-mapSize-height={shadowMapSize}
      shadow-bias={-0.0001}
      shadow-normalBias={0.02}
      shadow-radius={4}
    />
  )
}

// Camera base position and settings
const CAMERA_BASE_POSITION: [number, number, number] = [0.4, 0.5, 3.6]
const CAMERA_TARGET = new THREE.Vector3(0.5, 0, 0)
const CAMERA_FOV = 40
const MAX_OFFSET = 0.1 // Maximum camera offset in X and Y
const EASE = 0.1 // Smoothing factor for camera movement

function DragCameraRig() {
  const { camera, gl, pointer } = useThree()
  const isDragging = useRef(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })
  const spherical = useRef(new THREE.Spherical())
  const target = useRef(new THREE.Vector3(...CAMERA_TARGET))
  const baseSpherical = useRef(new THREE.Spherical())
  const targetPosition = useRef(new THREE.Vector3(...CAMERA_BASE_POSITION))
  const currentPosition = useRef(new THREE.Vector3(...CAMERA_BASE_POSITION))
  const lastMouseMoveTime = useRef(Date.now())
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousPointer = useRef({ x: 0, y: 0 })
  const isResetting = useRef(false)

  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return
    
    // Initialize camera position
    camera.position.set(...CAMERA_BASE_POSITION)
    camera.up.set(0, 1, 0)
    camera.fov = CAMERA_FOV
    camera.lookAt(CAMERA_TARGET)
    camera.updateProjectionMatrix()

    // Initialize spherical coordinates from camera position
    const offset = new THREE.Vector3().subVectors(camera.position, target.current)
    spherical.current.setFromVector3(offset)
    baseSpherical.current.copy(spherical.current)
    
    // Initialize position refs
    targetPosition.current.set(...CAMERA_BASE_POSITION)
    currentPosition.current.set(...CAMERA_BASE_POSITION)
  }, [camera])

  const resetCamera = () => {
    if (!(camera instanceof PerspectiveCamera) || isDragging.current) return
    
    // Set flag to indicate we're resetting
    isResetting.current = true
    
    // Reset spherical coordinates to original
    const basePosVec = new THREE.Vector3(...CAMERA_BASE_POSITION)
    const offset = new THREE.Vector3().subVectors(basePosVec, CAMERA_TARGET)
    baseSpherical.current.setFromVector3(offset)
    
    // Set target position to original (will be smoothly animated in useFrame)
    targetPosition.current.set(...CAMERA_BASE_POSITION)
  }

  useEffect(() => {
    const canvas = gl.domElement

    const handleMouseDown = (event: MouseEvent) => {
      // Only start dragging on left mouse button
      if (event.button === 0) {
        isDragging.current = true
        previousMousePosition.current = { x: event.clientX, y: event.clientY }
        canvas.style.cursor = 'grabbing'
        
        // Cancel any ongoing reset
        isResetting.current = false
        
        // Clear reset timeout when dragging starts
        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current)
          resetTimeoutRef.current = null
        }
      }
    }

    const handleMouseUp = () => {
      isDragging.current = false
      canvas.style.cursor = 'default'
      // Update base spherical when drag ends
      baseSpherical.current.copy(spherical.current)
      // Sync position refs with current camera position
      currentPosition.current.copy(camera.position)
      targetPosition.current.copy(camera.position)
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!(camera instanceof PerspectiveCamera)) return

      // Update last mouse movement time
      lastMouseMoveTime.current = Date.now()
      
      // Clear existing reset timeout
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
        resetTimeoutRef.current = null
      }
      
      // Set new reset timeout
      resetTimeoutRef.current = setTimeout(() => {
        resetCamera()
      }, 500)

      if (isDragging.current) {
        // Drag mode: rotate camera
        const deltaX = event.clientX - previousMousePosition.current.x
        const deltaY = event.clientY - previousMousePosition.current.y

        // Rotate camera around target
        const rotateSpeed = 0.005
        spherical.current.theta -= deltaX * rotateSpeed
        spherical.current.phi -= deltaY * rotateSpeed

        // Clamp phi to prevent flipping
        spherical.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.current.phi))

        // Update camera position based on spherical coordinates
        const offset = new THREE.Vector3()
        offset.setFromSpherical(spherical.current)
        camera.position.copy(target.current).add(offset)
        camera.lookAt(target.current)

        previousMousePosition.current = { x: event.clientX, y: event.clientY }
      }
    }

    const handleMouseLeave = () => {
      isDragging.current = false
      canvas.style.cursor = 'default'
      // Update base spherical when mouse leaves
      baseSpherical.current.copy(spherical.current)
      // Sync position refs with current camera position
      currentPosition.current.copy(camera.position)
      targetPosition.current.copy(camera.position)
      
      // Clear reset timeout when mouse leaves
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
        resetTimeoutRef.current = null
      }
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
    }
  }, [camera, gl])

  useFrame(() => {
    if (!(camera instanceof PerspectiveCamera)) return
    if (isDragging.current) return // Don't apply parallax while dragging

    // Handle reset animation
    if (isResetting.current) {
      // Use faster lerp for reset animation (more responsive)
      const resetEase = 0.12
      currentPosition.current.lerp(targetPosition.current, resetEase)
      camera.position.copy(currentPosition.current)
      camera.lookAt(CAMERA_TARGET)
      
      // Check if we've reached the target position (within a small threshold)
      const distance = currentPosition.current.distanceTo(targetPosition.current)
      if (distance < 0.001) {
        // Reset complete - update spherical coordinates and clear flag
        const offset = new THREE.Vector3().subVectors(camera.position, target.current)
        spherical.current.setFromVector3(offset)
        isResetting.current = false
      }
      return
    }

    // Check if pointer has moved (for parallax tracking)
    const pointerMoved = 
      Math.abs(pointer.x - previousPointer.current.x) > 0.001 ||
      Math.abs(pointer.y - previousPointer.current.y) > 0.001

    if (pointerMoved) {
      // Update last mouse movement time
      lastMouseMoveTime.current = Date.now()
      
      // Cancel any ongoing reset
      isResetting.current = false
      
      // Clear existing reset timeout
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
        resetTimeoutRef.current = null
      }
      
      // Set new reset timeout
      resetTimeoutRef.current = setTimeout(() => {
        resetCamera()
      }, 1000)
      
      previousPointer.current = { x: pointer.x, y: pointer.y }
    }

    // Get the base position from current spherical coordinates
    const baseOffset = new THREE.Vector3().setFromSpherical(baseSpherical.current)
    const basePos = target.current.clone().add(baseOffset)

    // Parallax effect: calculate target position based on mouse pointer
    // pointer.x and pointer.y range from -1 to +1
    // Inverted: mouse left = camera looks left (negative X offset)
    const targetX = basePos.x - pointer.x * MAX_OFFSET
    const targetY = basePos.y - pointer.y * MAX_OFFSET
    const targetZ = basePos.z

    targetPosition.current.set(targetX, targetY, targetZ)

    // Smoothly lerp current position toward target
    currentPosition.current.lerp(targetPosition.current, EASE)

    // Apply the smoothed position to camera
    camera.position.copy(currentPosition.current)
    camera.lookAt(CAMERA_TARGET)
  })

  return null
}

export function HeroStage({ isMobile = false }: { isMobile?: boolean }) {
  const shadowMapSize = isMobile ? 1024 : 2048
  const dprSetting: [number, number] = [1, isMobile ? 1 : 1.15]

  return (
    <Canvas
      dpr={dprSetting}
      shadows
      camera={{ position: CAMERA_BASE_POSITION, fov: CAMERA_FOV }}
      gl={{ 
        antialias: true, 
        alpha: false,
        powerPreference: 'high-performance',
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.NoToneMapping,
        toneMappingExposure: 2.0,
        localClippingEnabled: true  // Enable clipping planes
      }}
      frameloop="always"
      style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#ffffff' }}
    >
      {/* Natural window lighting */}
      <color attach="background" args={['#f8f9fa']} />
      
      {/* Soft ambient base */}
      {/* <ambientLight intensity={1.2} color="#f0f2f5" /> */}
      
      {/* Sky hemisphere for natural feel */}
      {/* <hemisphereLight 
        args={['#e3f2fd', '#f5f5f5', 1.0]} 
        position={[0, 10, 0]}
      /> */}

      {/* Main window light - bright sunlight from left window */}
      <ShadowLight shadowMapSize={shadowMapSize} />
      
      {/* Secondary window light - softer from back window */}
      {/* <directionalLight 
        position={[-3, 4, 10]} 
        intensity={2.5} 
        color="#f8fbff" 
        castShadow={false}
      /> */}
      
      {/* Bounce light from floor/walls */}
      {/* <directionalLight 
        position={[2, -3, 5]} 
        intensity={1.0} 
        color="#ffffff" 
        castShadow={false}
      /> */}
      
      {/* Fill light to soften shadows */}
      {/* <pointLight 
        position={[0, 2, 2]} 
        intensity={1.5} 
        color="#ffffff"
        distance={10}
        decay={2}
      /> */}

      {/* Environment */}
      <Suspense fallback={null}>
        <Environment scale={1} position={[0, 0, 0]} />
      </Suspense>

      {/* Ceiling/Roof - matches environment room style */}
      <mesh position={[1, 1.5, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
        <planeGeometry args={[3.5, 3.5]} />
        <meshStandardMaterial 
          color="#d0d0d0"
          roughness={0.8}
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right Wall - matches environment room style */}
      <mesh position={[1.9, 0.5, 0.5]} rotation={[0, -Math.PI / 2, 0]} receiveShadow castShadow>
        <planeGeometry args={[3.5, 2.4]} />
        <meshStandardMaterial 
          color="#d0d0d0"
          roughness={0.8}
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating Icons */}
      <Suspense fallback={null}>
        <FloatingIcons />
      </Suspense>

      <DragCameraRig />
    </Canvas>
  )
}
