import React, { useState, useMemo, useEffect, Suspense, useRef, useCallback } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { RoundedBox, Text, MeshTransmissionMaterial, useTexture, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import emailjs from '@emailjs/browser'
import {
  PROJECT_SECTIONS,
  PROJECT_SECTIONS_ARRAY,
  ProjectPanel1,
  ProjectPanel2,
  ProjectPanel3,
  ProjectPanel4,
  ProjectPanel5
} from './ProjectContent'
import {
  ExperiencePanel1,
  ExperiencePanel2,
  ExperiencePanel3,
  ExperiencePanel4,
  ExperiencePanel5
} from './ExperienceContent'

// Base Z position for all UI elements - adjust to move everything forward/back
// Lower values = closer to camera, Higher values = further from camera
const BASE_Z_POSITION = 1.5

interface IconProps {
  position: [number, number, number]
  color: string
  iconType?: string
  label?: string
  onClick?: () => void
}

// Project data and panels moved to ProjectContent.tsx


// Rounded circular disc with beveled edges (VisionOS-style)
function RoundedDisc({
  radius = 0.10,
  depth = 0.02,
  bevel = 0.006,
  color = '#ffffff',
  ...props
}: {
  radius?: number
  depth?: number
  bevel?: number
  color?: string
  [key: string]: any
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.absarc(0, 0, radius, 0, Math.PI * 2, false)
    return s
  }, [radius])

  const extrude = useMemo(
    () => ({
      depth,
      bevelEnabled: true,
      bevelSegments: 8,
      bevelSize: bevel,
      bevelThickness: bevel,
      curveSegments: 64,
      steps: 1
    }),
    [depth, bevel]
  )

  return (
    <mesh
      rotation={[0, 0, 0]}
      castShadow
      receiveShadow
      {...props}
    >
      <extrudeGeometry args={[shape, extrude]} />
      <meshStandardMaterial
        color={color}
        metalness={0.0}
        roughness={1.0}
      />
    </mesh>
  )
}

// Simple 3D Person Icon - sphere head + semicircle body
function PersonIcon() {
  return (
    <group position={[0, 0, 0.02]} rotation={[0, 0, 0]} scale={1.5}>
      {/* Head - sphere */}
  <mesh position={[0, 0.025, 0]} castShadow>
    {/* Sphere radius: increase to make head bigger (e.g., 0.02), decrease for smaller (e.g., 0.01) */}
    <sphereGeometry args={[0.015, 32, 32]} />
    <meshStandardMaterial color="#D4A574" metalness={0.0} roughness={1.0} />
  </mesh>
  {/* Body - flattened sphere (semicircle shape) */}
  {/* scale: [width, height, depth] - adjust to change body proportions */}
  <mesh position={[0, -0.01, 0]} scale={[1.2, 0.6, 1]} castShadow>
    {/* Sphere radius: increase to make body bigger overall (e.g., 0.04), decrease for smaller (e.g., 0.02) */}
    <sphereGeometry args={[0.03, 32, 32]} />
    <meshStandardMaterial color="#CC5500" metalness={0.0} roughness={1.0} />
  </mesh>
    </group>
  )
}

// 3D Folder Icon - warm yellow folder with white interior
function FolderIcon() {
  return (
    <group position={[0, 0, 0.02]} rotation={[0, 0, 0]} scale={[2.25, 2.25, 2.25]}>
      {/* Back panel - slightly raised */}
      <RoundedBox 
        position={[0, 0, 0.004]} 
        args={[0.06, 0.045, 0.008]} 
        radius={0.003}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial 
          color="#DAA520" 
          metalness={0.0} 
          roughness={1.0}
        />
      </RoundedBox>
      
      {/* Front panel - slightly lower to show white interior */}
      <RoundedBox 
        position={[0, -0.002, 0]} 
        args={[0.06, 0.043, 0.008]} 
        radius={0.003}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial 
          color="#DAA520" 
          metalness={0.0} 
          roughness={1.0}
        />
      </RoundedBox>
      
      {/* White interior - visible between panels */}
      <RoundedBox 
        position={[0, 0.01, 0.002]} 
        args={[0.058, 0.01, 0.004]} 
        radius={0.002}
        smoothness={2}
        castShadow
      >
        <meshStandardMaterial 
          color="#FFFFFF" 
          metalness={0.0} 
          roughness={1.0}
        />
      </RoundedBox>
      
      {/* Tab on upper left */}
      <RoundedBox 
        position={[-0.02, 0.02, 0.004]} 
        args={[0.015, 0.008, 0.008]} 
        radius={0.002}
        smoothness={2}
        castShadow
      >
        <meshStandardMaterial 
          color="#DAA520" 
          metalness={0.0} 
          roughness={1.0}
        />
      </RoundedBox>
    </group>
  )
}

// 3D Paper Icon - light grey document with folded corner and text lines
function PaperIcon() {
  const textLines = [
    { position: [-0.01, 0.015, 0.0035] as [number, number, number], width: 0.02 },
    { position: [0, 0.005, 0.0035] as [number, number, number], width: 0.03 },
    { position: [0, -0.005, 0.0035] as [number, number, number], width: 0.03 },
    { position: [0, -0.015, 0.0035] as [number, number, number], width: 0.04 },
  ]
  
  return (
    <group position={[0, 0, 0.02]} rotation={[0, 0, 0]} scale={[2, 2, 2]}>
      <RoundedBox 
        position={[0, 0, 0]} 
        args={[0.05, 0.06, 0.006]} 
        radius={0.002}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial color="#E8E8E8" metalness={0.0} roughness={1.0} />
      </RoundedBox>
      
      {textLines.map((line, i) => (
        <RoundedBox 
          key={i}
          position={line.position}
          args={[line.width, 0.002, 0.003]}
          radius={0.0005}
          smoothness={2}
          castShadow
        >
          <meshStandardMaterial color="#808080" metalness={0.0} roughness={1.0} />
        </RoundedBox>
      ))}
    </group>
  )
}

// 3D Envelope Icon - classic envelope with triangular top flap
function EnvelopeIcon() {
  return (
    <group position={[0, 0, 0.02]} rotation={[0, 0, 0]} scale={[1.5, 1.5, 1.5]}>
      {/* Main envelope body - simple rectangle */}
      <RoundedBox 
        position={[0, 0, 0]} 
        args={[0.06, 0.045, 0.012]} 
        radius={0.003}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial 
          color="#FFFFFF" 
          metalness={0.0} 
          roughness={1.0}
        />
      </RoundedBox>
      
      {/* Top triangular flap - 3D upside down triangle in front */}
      <group position={[-0.0005, 0.018, 0.0003]} rotation={[-Math.PI * 0.2, 0, 0]}>
        {/* Front face */}
        <mesh castShadow receiveShadow>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={3}
              array={new Float32Array([
                -0.03, 0, 0.008,      // Top left
                0.03, 0, 0.008,       // Top right
                0, -0.02, 0.008       // Bottom point (upside down)
              ])}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-normal"
              count={3}
              array={new Float32Array([
                0, 0, 1,
                0, 0, 1,
                0, 0, 1
              ])}
              itemSize={3}
            />
            <bufferAttribute
              attach="index"
              count={3}
              array={new Uint16Array([0, 1, 2])}
              itemSize={1}
            />
          </bufferGeometry>
          <meshStandardMaterial 
            color="#FFFFFF" 
            metalness={0.0} 
            roughness={1.0}
            emissive="#FFFFFF"
            emissiveIntensity={3}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Back face */}
        <mesh castShadow receiveShadow>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={3}
              array={new Float32Array([
                -0.03, 0, -0.008,      // Top left
                0.03, 0, -0.008,       // Top right
                0, -0.02, -0.008       // Bottom point (upside down)
              ])}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-normal"
              count={3}
              array={new Float32Array([
                0, 0, -1,
                0, 0, -1,
                0, 0, -1
              ])}
              itemSize={3}
            />
            <bufferAttribute
              attach="index"
              count={3}
              array={new Uint16Array([0, 2, 1])}
              itemSize={1}
            />
          </bufferGeometry>
          <meshStandardMaterial 
            color="#FFFFFF" 
            metalness={0.0} 
            roughness={1.0}
            emissive="#FFFFFF"
            emissiveIntensity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Side faces - creating thickness */}
        {/* Left side */}
        <mesh castShadow receiveShadow>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={4}
              array={new Float32Array([
                -0.03, 0, -0.008,
                -0.03, 0, 0.008,
                0, -0.02, 0.008,
                0, -0.02, -0.008
              ])}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-normal"
              count={4}
              array={new Float32Array([
                -0.866, 0.5, 0,
                -0.866, 0.5, 0,
                -0.866, 0.5, 0,
                -0.866, 0.5, 0
              ])}
              itemSize={3}
            />
            <bufferAttribute
              attach="index"
              count={6}
              array={new Uint16Array([0, 1, 2, 0, 2, 3])}
              itemSize={1}
            />
          </bufferGeometry>
          <meshStandardMaterial 
            color="#FFFFFF" 
            metalness={0.0} 
            roughness={1.0}
            emissive="#FFFFFF"
            emissiveIntensity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Right side */}
        <mesh castShadow receiveShadow>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={4}
              array={new Float32Array([
                0.03, 0, -0.008,
                0.03, 0, 0.008,
                0, -0.02, 0.008,
                0, -0.02, -0.008
              ])}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-normal"
              count={4}
              array={new Float32Array([
                0.866, 0.5, 0,
                0.866, 0.5, 0,
                0.866, 0.5, 0,
                0.866, 0.5, 0
              ])}
              itemSize={3}
            />
            <bufferAttribute
              attach="index"
              count={6}
              array={new Uint16Array([0, 2, 1, 0, 3, 2])}
              itemSize={1}
            />
          </bufferGeometry>
          <meshStandardMaterial 
            color="#A9A9A9" 
            metalness={0.0} 
            roughness={1.0}
            emissive="#A9A9A9"
            emissiveIntensity={0}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Top edge */}
        <mesh castShadow receiveShadow>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={4}
              array={new Float32Array([
                -0.03, 0, -0.008,
                -0.03, 0, 0.008,
                0.03, 0, 0.008,
                0.03, 0, -0.008
              ])}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-normal"
              count={4}
              array={new Float32Array([
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0
              ])}
              itemSize={3}
            />
            <bufferAttribute
              attach="index"
              count={6}
              array={new Uint16Array([0, 1, 2, 0, 2, 3])}
              itemSize={1}
            />
          </bufferGeometry>
          <meshStandardMaterial 
            color="#FFFFFF" 
            metalness={0.0} 
            roughness={1.0}
            emissive="#A9A9A9"
            emissiveIntensity={1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  )
}

// 3D Briefcase Icon - warm brown/orange-brown with black handle and clasp
function BriefcaseIcon() {
  return (
    <group position={[0, 0, 0.02]} rotation={[0, 0, 0]} scale={[1.5, 1.5, 1.5]}>
      {/* Main body - wider than tall */}
      <RoundedBox 
        position={[0, -0.012, 0]} 
        args={[0.07, 0.048, 0.012]} 
        radius={0.004}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial 
          color="#CD853F" 
          metalness={0.0} 
          roughness={1.0}
        />
      </RoundedBox>
      
      {/* Front flap - slightly raised with curved bottom */}
      <RoundedBox 
        position={[0, -0.006, 0.008]} 
        args={[0.068, 0.03, 0.004]} 
        radius={0.003}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial 
          color="#CD853F" 
          metalness={0.0} 
          roughness={1.0}
        />
      </RoundedBox>
      
      {/* Black clasp - vertical rectangular on front flap */}
      <RoundedBox 
        position={[0, -0.006, 0.012]} 
        args={[0.008, 0.018, 0.004]} 
        radius={0.001}
        smoothness={2}
        castShadow
      >
        <meshStandardMaterial 
          color="#000000" 
          metalness={0.0} 
          roughness={1.0}
        />
      </RoundedBox>
      
      {/* Black handle - arched on top center, attached to briefcase */}
      <group position={[0, 0.012, 0.006]}>
        {/* Left connector - sits directly on top of briefcase */}
        <RoundedBox 
          position={[-0.02, 0.0045, 0]} 
          args={[0.006, 0.009, 0.008]} 
          radius={0.001}
          smoothness={2}
          castShadow
        >
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.0} 
            roughness={1.0}
          />
        </RoundedBox>
        
        {/* Right connector - sits directly on top of briefcase */}
        <RoundedBox 
          position={[0.02, 0.0045, 0]} 
          args={[0.006, 0.009, 0.008]} 
          radius={0.001}
          smoothness={2}
          castShadow
        >
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.0} 
            roughness={1.0}
          />
        </RoundedBox>
        
        {/* Arched handle - connects seamlessly to connectors, taller */}
        <mesh position={[0, 0.009, 0]} rotation={[0, 0, 0]} castShadow>
          <torusGeometry args={[0.02, 0.003, 8, 16, Math.PI]} />
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.0} 
            roughness={1.0}
          />
        </mesh>
      </group>
    </group>
  )
}

// GitHub Icon - loads GLB model (for use inside FloatingIcon)
function GitHubIconModel() {
  const { scene } = useGLTF('/assets/github.glb')
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = false
      }
    })
  }, [scene])
  
  return (
    <group position={[0, 0, -0.5]} scale={[2, 2, 2]}>
      <primitive object={scene} />
    </group>
  )
}

function GitHubIcon() {
  return (
    <Suspense fallback={null}>
      <GitHubIconModel />
    </Suspense>
  )
}

// LinkedIn Icon - loads GLB model (for use inside FloatingIcon)
function LinkedInIconModel() {
  const { scene } = useGLTF('/assets/linkedin.glb')
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = false
      }
    })
  }, [scene])
  
  return (
    <group position={[0, 0, 0.1]} scale={[0.15, 0.15, 0.15]}>
      <primitive object={scene} />
    </group>
  )
}

function LinkedInIcon() {
  return (
    <Suspense fallback={null}>
      <LinkedInIconModel />
    </Suspense>
  )
}

// Unified Standalone Icon Component
interface StandaloneIconProps {
  position: [number, number, number]
  label: string
  onClick?: () => void
  modelPath: string
  groupPosition: [number, number, number]
  groupScale: [number, number, number]
  groupRotation?: [number, number, number]
  clickedScale?: number
}

function StandaloneIcon({ 
  position, 
  label, 
  onClick, 
  modelPath, 
  groupPosition, 
  groupScale, 
  groupRotation = [0, 0, 0],
  clickedScale = 0.85
}: StandaloneIconProps) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const { scene } = useGLTF(modelPath)
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = false
      }
    })
  }, [scene])
  
  const { positionZ, scale } = useSpring({
    positionZ: clicked ? position[2] - 0.03 : hovered ? position[2] - 0.015 : position[2],
    scale: clicked ? clickedScale : hovered ? 0.9 : 1.0,
    config: { tension: 300, friction: 20 }
  })

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 150)
    if (onClick) onClick()
  }

  return (
    <Suspense fallback={null}>
      <animated.group 
        position-x={position[0]}
        position-y={position[1]}
        position-z={positionZ}
        scale={scale}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        <group position={groupPosition} scale={groupScale} rotation={groupRotation}>
          <primitive object={scene} />
        </group>
        
        {label && (
          <Text
            position={[0, -0.15, 0]}
            fontSize={0.025}
            color="#FFFFFF"
            anchorX="center"
            outlineWidth={0.0002}
            outlineColor="#ffffff"
          >
            {label}
          </Text>
        )}
      </animated.group>
    </Suspense>
  )
}

// Standalone GitHub Icon Component (no white disc base)
function StandaloneGitHubIcon({ position, label, onClick }: { position: [number, number, number]; label: string; onClick?: () => void }) {
  return (
    <StandaloneIcon
      position={position}
      label={label}
      onClick={onClick}
      modelPath="/assets/github.glb"
      groupPosition={[0, 0, 0.05]}
      groupScale={[0.4, 0.4, 0.4]}
      groupRotation={[-0.05, -0.33, 0]}
      clickedScale={1}
    />
  )
}

// Standalone LinkedIn Icon Component (no white disc base)
function StandaloneLinkedInIcon({ position, label, onClick }: { position: [number, number, number]; label: string; onClick?: () => void }) {
  return (
    <StandaloneIcon
      position={position}
      label={label}
      onClick={onClick}
      modelPath="/assets/linkedin.glb"
      groupPosition={[0, 0, -0.01]}
      groupScale={[0.125, 0.125, 0.125]}
      clickedScale={0.85}
    />
  )
}

function FloatingIcon({ position, color, iconType, label, onClick }: IconProps) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  
  // Animate Z position and scale on hover and click
  const { positionZ, scale } = useSpring({
    positionZ: clicked ? position[2] - 0.03 : hovered ? position[2] - 0.015 : position[2],
    scale: clicked ? 0.85 : hovered ? 0.9 : 1.0,
    config: { tension: 300, friction: 20 }
  })

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 150)
    if (onClick) onClick()
  }

  return (
    <animated.group 
      position-x={position[0]}
      position-y={position[1]}
      position-z={positionZ}
      scale={scale}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Base circular disc with beveled edges (VisionOS-style) */}
      <RoundedDisc color={color} radius={0.10} depth={0.008} bevel={0.010} />
      
      {/* 3D Icon */}
      {iconType === 'person' && <PersonIcon />}
      {iconType === 'folder' && <FolderIcon />}
      {iconType === 'briefcase' && <BriefcaseIcon />}
      {iconType === 'paper' && <PaperIcon />}
      {iconType === 'envelope' && <EnvelopeIcon />}
      
      {/* 3D Text Label */}
      {label && (
        <Text
          position={[0, -0.15, 0]}
          fontSize={0.025}
          color="#FFFFFF"
          anchorX="center"
          outlineWidth={0.0002}
          outlineColor="#ffffff"
        >
          {label}
        </Text>
      )}
    </animated.group>
  )
}

// Profile Image Component
function ProfileImage({ imagePath, position, radius = 0.12 }: { imagePath: string; position: [number, number, number]; radius?: number }) {
  const texture = useTexture(imagePath)
  
  // Calculate aspect ratio and adjust texture to fit properly in circle
  useEffect(() => {
    if (texture.image) {
      const aspectRatio = texture.image.width / texture.image.height
      
      if (aspectRatio > 1) {
        // Image is wider than tall
        texture.repeat.set(1 / aspectRatio, 1)
        texture.offset.set((1 - 1 / aspectRatio) / 2, -1)
      } else {
        // Image is taller than wide
        texture.repeat.set(1, aspectRatio)
        texture.offset.set(0, (1 - aspectRatio) / 1.75)
      }
      texture.needsUpdate = true
    }
  }, [texture])
  
  return (
    <mesh
      position={position}
      castShadow
    >
      <circleGeometry args={[radius, 64]} />
      <meshStandardMaterial 
        map={texture}
        metalness={0.0}
        roughness={1.0}
      />
    </mesh>
  )
}

// Home Toggle Button Component
interface HomeToggleButtonProps {
  position: [number, number, number]
  showDots: boolean
  onClick: () => void
}

function HomeToggleButton({ position, showDots, onClick }: HomeToggleButtonProps) {
  const [hovered, setHovered] = useState(false)
  
  // Create house icon texture - simple triangle and square
  const houseTexture = useMemo(() => {
    if (showDots) return null
    
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return null
    
    ctx.clearRect(0, 0, 512, 512)
    ctx.fillStyle = 'white'
    
    // Square body
    const bodyX = 128
    const bodyY = 256
    const bodyW = 256
    const bodyH = 180
    ctx.fillRect(bodyX, bodyY, bodyW, bodyH)
    
    // Triangle roof
    ctx.beginPath()
    ctx.moveTo(100, 256)      // bottom left
    ctx.lineTo(256, 120)      // top center
    ctx.lineTo(412, 256)      // bottom right
    ctx.closePath()
    ctx.fill()
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [showDots])
  
  // Glassmorphism effect on hover
  const buttonSpring = useSpring({
    buttonOpacity: hovered ? 0.3 : 0.5,
    buttonScale: hovered ? 1.05 : 1,
    emissiveIntensity: hovered ? 0.2 : 0,
    config: { tension: 300, friction: 20 }
  })
  
  const buttonRadius = 0.04
  const panelDepth = 0.01
  
  return (
    <animated.group
      position={position}
      scale={buttonSpring.buttonScale}
    >
      <mesh 
        castShadow 
        receiveShadow 
        rotation={[Math.PI / 2, 0, 0]}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <cylinderGeometry args={[buttonRadius, buttonRadius, panelDepth, 32]} />
        <animated.meshPhysicalMaterial
          color="#FFFFFF"
          metalness={0.1}
          roughness={0.2}
          opacity={buttonSpring.buttonOpacity}
          transparent={true}
          transmission={0.3}
          thickness={0.5}
          emissive="#FFFFFF"
          emissiveIntensity={buttonSpring.emissiveIntensity}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Icon - either dots or house */}
      {showDots ? (
        // 4 squares in 2 rows x 2 columns - centered on button
        <>
          {(() => {
            const squareSize = 0.0175        // Change size here
            const squareColor = "#FFFFFF"   // Change color here
            const rows = 2
            const cols = 2
            const horizontalSpacing = 0.025
            const verticalSpacing = 0.025
            
            return (
              <group position={[0, 0, panelDepth / 2 + 0.006]}>
                {Array.from({ length: rows }).map((_, row) =>
                  Array.from({ length: cols }).map((_, col) => (
                    <lineSegments 
                      key={`${row}-${col}`}
                      position={[
                        (col - 0.5) * horizontalSpacing,  // -0.5, 0.5 for 2 columns
                        (0.5 - row) * verticalSpacing,     // 0.5, -0.5 for 2 rows
                        0
                      ]}
                    >
                      <edgesGeometry args={[new THREE.BoxGeometry(squareSize, squareSize, 0.001)]} />
                      <lineBasicMaterial color={squareColor} linewidth={2} />
                    </lineSegments>
                  ))
                )}
              </group>
            )
          })()}
        </>
      ) : (
        // House icon - manually drawn
        houseTexture ? (
          <mesh position={[0, 0.005, panelDepth / 2 + 0.005]}>
            <planeGeometry args={[buttonRadius * 1.5, buttonRadius * 1.5]} />
            <meshBasicMaterial 
              map={houseTexture}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
        ) : null
      )}
    </animated.group>
  )
}

// Social Media Button Component
interface SocialButtonProps {
  position: [number, number, number]
  icon: 'github' | 'linkedin'
  url: string
}

function SocialButton({ position, icon, url }: SocialButtonProps) {
  const [hovered, setHovered] = useState(false)
  
  // Load logo texture - load actual image for GitHub
  const [logoTexture, setLogoTexture] = useState<THREE.CanvasTexture | null>(null)
  
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return
    
    ctx.clearRect(0, 0, 512, 512)
    
    if (icon === 'github') {
      // Load GitHub octocat logo
      const img = new Image()
      img.crossOrigin = 'anonymous'
      // GitHub mark SVG as data URL (official octocat silhouette)
      img.src = 'data:image/svg+xml;base64,' + btoa(`
        <svg width="512" height="512" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
      `)
      
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 512, 512)
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true
        setLogoTexture(texture)
      }
    } else {
      // LinkedIn logo
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 420px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('in', 256, 256)
      
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      setLogoTexture(texture)
    }
  }, [icon])
  
  // Glassmorphism effect on hover
  const buttonSpring = useSpring({
    buttonOpacity: hovered ? 0.3 : 0.5,
    buttonScale: hovered ? 1.05 : 1,
    emissiveIntensity: hovered ? 0.2 : 0,
    config: { tension: 300, friction: 20 }
  })
  
  const buttonRadius = 0.035
  const panelDepth = 0.01
  
  const handleClick = () => {
    window.open(url, '_blank')
  }
  
  return (
    <animated.group
      position={position}
      scale={buttonSpring.buttonScale}
      onClick={handleClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[buttonRadius, buttonRadius, panelDepth, 32]} />
        <animated.meshPhysicalMaterial
          color={icon === 'linkedin' ? '#0077B5' : '#520065'}
          metalness={0.1}
          roughness={0.2}
          opacity={buttonSpring.buttonOpacity}
          transparent={true}
          transmission={0.3}
          thickness={0.5}
          emissive="#FFFFFF"
          emissiveIntensity={buttonSpring.emissiveIntensity}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Logo Icon */}
      {logoTexture && (
        <mesh position={[0, 0, panelDepth / 2 + 0.005]}>
          <circleGeometry args={[buttonRadius * 0.7, 32]} />
          <meshBasicMaterial 
            map={logoTexture}
            transparent={true}
            opacity={0.9}
          />
        </mesh>
      )}
    </animated.group>
  )
}

// Contact Form Panel Component
interface ContactFormPanelProps {
  onBack: () => void
}

function ContactFormPanel({ onBack }: ContactFormPanelProps) {
  const [backHovered, setBackHovered] = useState(false)
  const [activeField, setActiveField] = useState<'name' | 'email' | 'message' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  
  // Panel dimensions - same as FloatingPanel
  const panelWidth = 1.2
  const panelHeight = 0.9
  const panelPosition: [number, number, number] = [0.55, 0.375, BASE_Z_POSITION]
  
  // Back button properties
  const backButtonRadius = 0.025
  const backButtonPosition: [number, number, number] = [
    panelPosition[0] - panelWidth / 2 + 0.05,
    panelPosition[1] + panelHeight / 2 - 0.05,
    panelPosition[2] + 0.02
  ]
  
  // Animate panel appearance
  const { scale, opacity } = useSpring({
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: { tension: 280, friction: 26 }
  })
  
  const glassSpring = useSpring({
    buttonOpacity: backHovered ? 0.3 : 0.5,
    buttonScale: backHovered ? 1.05 : 1,
    emissiveIntensity: backHovered ? 0.2 : 0,
    config: { tension: 300, friction: 20 }
  })
  
  // Handle keyboard input when a field is active
  useEffect(() => {
    if (!activeField) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        setFormData(prev => ({
          ...prev,
          [activeField]: prev[activeField].slice(0, -1)
        }))
      } else if (e.key === 'Enter' && activeField !== 'message') {
        // Move to next field or submit
        if (activeField === 'name') {
          setActiveField('email')
        } else if (activeField === 'email') {
          setActiveField('message')
        }
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        // Regular character input
        setFormData(prev => ({
          ...prev,
          [activeField]: prev[activeField] + e.key
        }))
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeField])
  
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) return
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      await emailjs.send(
        'service_znehpa8',      // Replace with your EmailJS service ID
        'template_eyn1wkg',     // Replace with your EmailJS template ID
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          to_email: 'nbmendoza1432@gmail.com', // Replace with your email address
        },
        'jleOZNLVNkX7SjI01'       // Replace with your EmailJS public key
      )
      
      // Success - reset form
      setFormData({ name: '', email: '', message: '' })
      setActiveField(null)
    } catch (error) {
      // Error handling - you can add user feedback here if needed
      console.error('Failed to send email:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Input field component
  const InputField = ({ 
    label, 
    value, 
    field, 
    position, 
    width = 0.5, 
    height = 0.06,
    multiline = false 
  }: { 
    label: string
    value: string
    field: 'name' | 'email' | 'message'
    position: [number, number, number]
    width?: number
    height?: number
    multiline?: boolean
  }) => {
    const isActive = activeField === field
    const [hovered, setHovered] = useState(false)
    
    const fieldSpring = useSpring({
      opacity: isActive ? 0.6 : hovered ? 0.55 : 0.5,
      scale: isActive ? 1.02 : hovered ? 1.01 : 1,
      config: { tension: 300, friction: 20 }
    })
    
    return (
      <group position={position}>
        {/* Glassmorphic input field background */}
        <animated.mesh 
          position={[0, 0, 0.01]}
          scale={fieldSpring.scale}
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation()
            setActiveField(field)
          }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <extrudeGeometry args={[
            (() => {
              const radius = 0.02
              const shape = new THREE.Shape()
              shape.moveTo(-width/2 + radius, -height/2)
              shape.lineTo(width/2 - radius, -height/2)
              shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius)
              shape.lineTo(width/2, height/2 - radius)
              shape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2)
              shape.lineTo(-width/2 + radius, height/2)
              shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius)
              shape.lineTo(-width/2, -height/2 + radius)
              shape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2)
              shape.closePath()
              return shape
            })(),
            {
              depth: 0.01,
              bevelEnabled: false,
              curveSegments: 32
            }
          ]} />
          <animated.meshPhysicalMaterial
            color="#000000"
            metalness={0.0}
            roughness={0.5}
            opacity={fieldSpring.opacity}
            transparent={true}
            transmission={0}
            thickness={2.0}
            clearcoat={1.0}
            clearcoatRoughness={0.6}
            ior={2}
            attenuationDistance={0.5}
            attenuationColor="#FFFFFF"
            depthWrite={false}
          />
        </animated.mesh>
        
        {/* Label */}
        <Text
          position={[-width/2 + 0.01, height/2 + 0.03, 0.015]}
          fontSize={0.022}
          color="#FFFFFF"
          anchorX="left"
          anchorY="bottom"
        >
          {label}
        </Text>
        
        {/* Input value text */}
        <Text
          position={[-width/2 + 0.02, 0, 0.015]}
          fontSize={0.025}
          color="#FFFFFF"
          anchorX="left"
          anchorY="middle"
          maxWidth={width - 0.04}
        >
          {value}
        </Text>
        
        {/* Cursor when active - positioned after text */}
        {isActive && (
          <mesh position={[-width/2 + 0.02 + (value.length * 0.015), 0, 0.015]}>
            <boxGeometry args={[0.002, 0.03, 0.001]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        )}
      </group>
    )
  }
  
  // Send button component
  const SendButton = ({ position }: { position: [number, number, number] }) => {
    const [hovered, setHovered] = useState(false)
    const [clicked, setClicked] = useState(false)
    
    const buttonSpring = useSpring({
      buttonOpacity: hovered ? 0.4 : 0.5,
      buttonScale: clicked ? 0.95 : hovered ? 1.05 : 1,
      emissiveIntensity: hovered ? 0.3 : 0,
      config: { tension: 300, friction: 20 }
    })
    
    const buttonWidth = 0.3
    const buttonHeight = 0.06
    
    return (
      <animated.group
        position={position}
        scale={buttonSpring.buttonScale}
        onClick={(e) => {
          e.stopPropagation()
          setClicked(true)
          setTimeout(() => {
            setClicked(false)
            handleSubmit()
          }, 150)
        }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <mesh castShadow receiveShadow>
          <extrudeGeometry args={[
            (() => {
              const radius = 0.02
              const shape = new THREE.Shape()
              shape.moveTo(-buttonWidth/2 + radius, -buttonHeight/2)
              shape.lineTo(buttonWidth/2 - radius, -buttonHeight/2)
              shape.quadraticCurveTo(buttonWidth/2, -buttonHeight/2, buttonWidth/2, -buttonHeight/2 + radius)
              shape.lineTo(buttonWidth/2, buttonHeight/2 - radius)
              shape.quadraticCurveTo(buttonWidth/2, buttonHeight/2, buttonWidth/2 - radius, buttonHeight/2)
              shape.lineTo(-buttonWidth/2 + radius, buttonHeight/2)
              shape.quadraticCurveTo(-buttonWidth/2, buttonHeight/2, -buttonWidth/2, buttonHeight/2 - radius)
              shape.lineTo(-buttonWidth/2, -buttonHeight/2 + radius)
              shape.quadraticCurveTo(-buttonWidth/2, -buttonHeight/2, -buttonWidth/2 + radius, -buttonHeight/2)
              shape.closePath()
              return shape
            })(),
            {
              depth: 0.01,
              bevelEnabled: false,
              curveSegments: 32
            }
          ]} />
          <animated.meshPhysicalMaterial
            color="#4A90E2"
            metalness={0.0}
            roughness={0}
            opacity={buttonSpring.buttonOpacity}
            transparent={true}
            transmission={0}
            thickness={3.0}
            clearcoat={1.0}
            clearcoatRoughness={0}
            ior={1}
            emissive="#4A90E2"
            emissiveIntensity={buttonSpring.emissiveIntensity}
            depthWrite={false}
          />
        </mesh>
        
        <Text
          position={[0, 0, 0.015]}
          fontSize={0.025}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Send
        </Text>
      </animated.group>
    )
  }
  
  return (
    <animated.group scale={scale}>
      {/* Main Panel - same as FloatingPanel */}
      <mesh 
        position={panelPosition}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation()
          setActiveField(null)
        }}
      >
        <extrudeGeometry args={[
          (() => {
            const width = panelWidth
            const height = panelHeight
            const radius = 0.08
            
            const shape = new THREE.Shape()
            shape.moveTo(-width/2 + radius, -height/2)
            shape.lineTo(width/2 - radius, -height/2)
            shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius)
            shape.lineTo(width/2, height/2 - radius)
            shape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2)
            shape.lineTo(-width/2 + radius, height/2)
            shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius)
            shape.lineTo(-width/2, -height/2 + radius)
            shape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2)
            shape.closePath()
            
            return shape
          })(),
          {
            depth: 0.01,
            bevelEnabled: false,
            curveSegments: 32
          }
        ]} />
        <MeshTransmissionMaterial
          color="white"
          metalness={0}
          roughness={0.01}
          ior={1.8}
          thickness={0}
          reflectivity={1}
          chromaticAberration={0.1}
          clearcoat={0.4}
          resolution={512}
          clearcoatRoughness={0.05}
          iridescence={0.9}
          iridescenceIOR={0.1}
          iridescenceThicknessRange={[0, 140]}
          samples={2}
        />
      </mesh>
      
      {/* Back Button */}
      <animated.group
        position={backButtonPosition}
        scale={glassSpring.buttonScale}
        onClick={onBack}
        onPointerEnter={() => setBackHovered(true)}
        onPointerLeave={() => setBackHovered(false)}
      >
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[backButtonRadius, backButtonRadius, 0.02, 32]} />
          <animated.meshPhysicalMaterial
            color="#808080"
            metalness={0.1}
            roughness={0.2}
            opacity={glassSpring.buttonOpacity}
            transparent={true}
            transmission={0}
            thickness={0.5}
            emissive="#FFFFFF"
            emissiveIntensity={glassSpring.emissiveIntensity}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.025}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          ←
        </Text>
      </animated.group>
      
      {/* Title */}
      <Text
        position={[panelPosition[0], panelPosition[1] + 0.35, panelPosition[2] + 0.02]}
        fontSize={0.05}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Contact Me
      </Text>
      
      {/* Email Address - Right Side */}
      <Text
        position={[panelPosition[0] + 0.1, panelPosition[1] + 0.2, panelPosition[2] + 0.02]}
        fontSize={0.025}
        color="#FFFFFF"
        anchorX="left"
        anchorY="middle"
      >
        Email: nbmendoza1432@gmail.com
      </Text>
      
      {/* Input Fields */}
      <InputField
        label="Name"
        value={formData.name}
        field="name"
        position={[panelPosition[0] - 0.25, panelPosition[1] + 0.2, panelPosition[2] + 0.02]}
        width={0.5}
        height={0.06}
      />
      
      <InputField
        label="Email"
        value={formData.email}
        field="email"
        position={[panelPosition[0] - 0.25, panelPosition[1] + 0.05, panelPosition[2] + 0.02]}
        width={0.5}
        height={0.06}
      />
      
      <InputField
        label="Message"
        value={formData.message}
        field="message"
        position={[panelPosition[0] - 0.25, panelPosition[1] - 0.15, panelPosition[2] + 0.02]}
        width={0.5}
        height={0.12}
        multiline={true}
      />
      
      {/* Send Button */}
      <SendButton position={[panelPosition[0] - 0.35, panelPosition[1] - 0.3, panelPosition[2] + 0.02]} />
    </animated.group>
  )
}

// Small Menu Panel - appears when stacked panels (Projects/Experience) are open
interface SmallMenuPanelProps {
  activePanelIndex: number
  totalPanels?: number
}

function SmallMenuPanel({ activePanelIndex, totalPanels = 5 }: SmallMenuPanelProps) {
  // Small panel dimensions
  const panelWidth = 0.25
  const panelHeight = 0.05
  const panelPosition: [number, number, number] = [0.4, 0.15, BASE_Z_POSITION + 0.02] // Positioned to the right of main panel
  
  // Animate panel appearance
  const { scale, opacity } = useSpring({
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: { tension: 280, friction: 26 }
  })
  
  return (
    <animated.group scale={scale} rotation={[0, 0, Math.PI / 2]}>      {/* Small Menu Panel */}
      <mesh 
        position={panelPosition}
        castShadow
        receiveShadow
        onClick={(e) => e.stopPropagation()}
      >
        <extrudeGeometry args={[
          (() => {
            const width = panelWidth
            const height = panelHeight
            const radius = 0.03  // Rounded corners
            
            const shape = new THREE.Shape()
            shape.moveTo(-width/2 + radius, -height/2)
            shape.lineTo(width/2 - radius, -height/2)
            shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius)
            shape.lineTo(width/2, height/2 - radius)
            shape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2)
            shape.lineTo(-width/2 + radius, height/2)
            shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius)
            shape.lineTo(-width/2, -height/2 + radius)
            shape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2)
            shape.closePath()
            
            return shape
          })(),
          {
            depth: 0.01,
            bevelEnabled: false,
            curveSegments: 32
          }
        ]} />
        <MeshTransmissionMaterial
          color="white"
          metalness={0}
          roughness={0.01}
          ior={1.8}
          thickness={0}
          reflectivity={1}
          chromaticAberration={0.1}
          clearcoat={0.4}
          resolution={512}
          clearcoatRoughness={0.05}
          iridescence={0.9}
          iridescenceIOR={0.1}
          iridescenceThicknessRange={[0, 140]}
          samples={2}
        />
      </mesh>
      
      {/* Five Dots - animated based on active panel */}
      <group position={[panelPosition[0], panelPosition[1], panelPosition[2] + 0.015]}>
        {Array.from({ length: totalPanels }).map((_, index) => {
          // Calculate position for each dot
          // index 0 = leftmost dot (panel 0), index 4 = rightmost dot (panel 4)
          const spacing = 0.045
          const positionX = (index - (totalPanels - 1) / 2) * spacing
          
          // Determine if this dot is active (matches the active panel index)
          // Reverse mapping: panel 0 (top) -> dot index 4 (top visually), panel 4 (bottom) -> dot index 0 (bottom visually)
          const isActive = (totalPanels - 1 - index) === activePanelIndex
          
          // Animate color based on active state
          const { color } = useSpring({
            color: isActive ? '#FFFFFF' : '#D3D3D3',
            config: { tension: 300, friction: 25 }
          })
          
          return (
            <animated.mesh key={index} position={[positionX, 0, 0]}>
              <circleGeometry args={[0.01, 32]} />
              <animated.meshBasicMaterial color={color} />
            </animated.mesh>
          )
        })}
      </group>
    </animated.group>
  )
}

// Clipping Wrapper Component - applies clipping planes to all children
function ClippingWrapper({ 
  children, 
  clippingPlanes 
}: { 
  children: React.ReactNode
  clippingPlanes: THREE.Plane[]
}) {
  const groupRef = useRef<THREE.Group>(null)
  
  useEffect(() => {
    if (!groupRef.current) return
    
    const applyClipping = () => {
      if (!groupRef.current) return
      
      // Update world matrix to transform planes correctly
      groupRef.current.updateMatrixWorld(true)
      const worldMatrix = groupRef.current.matrixWorld
      
      // Transform clipping planes from local space to world space
      const worldPlanes = clippingPlanes.map(plane => {
        const worldPlane = plane.clone()
        // Transform plane normal and point to world space
        const normal = plane.normal.clone().transformDirection(worldMatrix)
        const point = new THREE.Vector3()
        plane.coplanarPoint(point)
        point.applyMatrix4(worldMatrix)
        normal.normalize()
        worldPlane.setFromNormalAndCoplanarPoint(normal, point)
        return worldPlane
      })
      
      // Traverse all children and apply clipping planes to materials
      groupRef.current?.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.Material
          if (Array.isArray(material)) {
            material.forEach(mat => {
              if (mat instanceof THREE.Material) {
                mat.clippingPlanes = worldPlanes
                mat.clipShadows = true
                mat.needsUpdate = true
              }
            })
          } else if (material instanceof THREE.Material) {
            material.clippingPlanes = worldPlanes
            material.clipShadows = true
            material.needsUpdate = true
          }
        }
      })
    }
    
    // Apply clipping immediately
    applyClipping()
    
    // Also apply on next frame to catch dynamically added content
    const timeoutId = setTimeout(applyClipping, 0)
    
    return () => clearTimeout(timeoutId)
  }, [clippingPlanes, children])
  
  return <group ref={groupRef}>{children}</group>
}

// 3D Floating Rectangle Panel
interface FloatingPanelProps {
  label: string
  onBack: () => void
  content?: {
    image?: string
    text?: string
    name?: string
  }
  hideBackButton?: boolean
  onActivePanelChange?: (index: number) => void
  activePanelIndex?: number
}

function FloatingPanel({ label, onBack, content, hideBackButton = false, onActivePanelChange, activePanelIndex }: FloatingPanelProps) {
  const [backHovered, setBackHovered] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [scrollOffset, setScrollOffset] = useState(0) // Continuous scroll offset in 3D units
  const [targetScrollOffset, setTargetScrollOffset] = useState(0) // Target offset for smooth momentum scrolling
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const momentumRef = useRef<number>(0) // Momentum for smooth scrolling
  
  // Panel dimensions - covers the icon area
  const panelWidth = 1.2  // Width to cover all icons
  const panelHeight = 0.9  // Height to cover all icons
  const panelDepth = 0.02 // Same thickness as icon discs
  
  // Panel position - center of icon area
  const panelPosition: [number, number, number] = [0.55, 0.375, BASE_Z_POSITION]
  const totalProjectSections = PROJECT_SECTIONS_ARRAY.length
  
  const isProjectsPanel = label === 'Projects'
  const isExperiencePanel = label === 'Experience'
  const isStackedPanel = isProjectsPanel || isExperiencePanel
  
  // Scroll settings for iOS-style panel stacking
  const scrollSensitivity = 0.002 // How much 3D units per pixel of scroll
  const panelSpacing = 1.0 // Vertical spacing between panels
  const depthOffset = 0.15 // How much panels move back in Z when scrolling

  const stackedPanels = isProjectsPanel
    ? [ProjectPanel1, ProjectPanel2, ProjectPanel3, ProjectPanel4, ProjectPanel5]
    : isExperiencePanel
    ? [ExperiencePanel1, ExperiencePanel2, ExperiencePanel3, ExperiencePanel4, ExperiencePanel5]
    : []

  const totalPanels = stackedPanels.length
  const maxScrollOffset = totalPanels > 0 ? (totalPanels - 1) * panelSpacing : 0 // Maximum scroll offset
  
  // Spring animation for smooth scrolling - Framer Motion-like config
  const { scrollY } = useSpring({
    scrollY: targetScrollOffset, // Positive scroll moves content up
    config: { 
      tension: 280,  // Lower tension for smoother, less aggressive animation (Framer Motion-like)
      friction: 30   // Balanced friction for natural deceleration
    }
  })
  
  // Calculate active panel index based on scroll offset
  useEffect(() => {
    if (!isStackedPanel || !onActivePanelChange) return
    
    // Calculate which panel is closest to the center based on target scroll offset
    // Panel 0 is at scroll 0, Panel 1 is at scroll 1.0, etc.
    const closestPanel = Math.round(targetScrollOffset / panelSpacing)
    const activeIndex = Math.max(0, Math.min(totalPanels - 1, closestPanel))
    onActivePanelChange(activeIndex)
  }, [isStackedPanel, onActivePanelChange, targetScrollOffset, panelSpacing, totalPanels])
  
  const panelShape = useMemo(() => {
    const radius = 0.08
    const shape = new THREE.Shape()
    shape.moveTo(-panelWidth / 2 + radius, -panelHeight / 2)
    shape.lineTo(panelWidth / 2 - radius, -panelHeight / 2)
    shape.quadraticCurveTo(panelWidth / 2, -panelHeight / 2, panelWidth / 2, -panelHeight / 2 + radius)
    shape.lineTo(panelWidth / 2, panelHeight / 2 - radius)
    shape.quadraticCurveTo(panelWidth / 2, panelHeight / 2, panelWidth / 2 - radius, panelHeight / 2)
    shape.lineTo(-panelWidth / 2 + radius, panelHeight / 2)
    shape.quadraticCurveTo(-panelWidth / 2, panelHeight / 2, -panelWidth / 2, panelHeight / 2 - radius)
    shape.lineTo(-panelWidth / 2, -panelHeight / 2 + radius)
    shape.quadraticCurveTo(-panelWidth / 2, -panelHeight / 2, -panelWidth / 2 + radius, -panelHeight / 2)
    shape.closePath()
    return shape
  }, [panelWidth, panelHeight])

  // Clipping planes to constrain content within panel bounds
  // Planes are defined relative to the group's local coordinate system (group origin at 0,0,0)
  // In Three.js, clipping planes clip everything where normal · point + constant > 0
  // So we want planes that clip outside the panel, meaning normals point outward
  const clippingPlanes = useMemo(() => {
    const halfWidth = panelWidth / 2
    const halfHeight = panelHeight / 2
    
    // Define planes that clip content OUTSIDE the panel
    // Each plane's normal points outward, and constant is set so the plane is at the boundary
    return [
      new THREE.Plane(new THREE.Vector3(0, -1, 0), halfHeight),   // Top: clips where y > halfHeight (normal points down)
      new THREE.Plane(new THREE.Vector3(0, 1, 0), halfHeight),    // Bottom: clips where y < -halfHeight (normal points up)
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), halfWidth),     // Right: clips where x > halfWidth (normal points left)
      new THREE.Plane(new THREE.Vector3(1, 0, 0), halfWidth),     // Left: clips where x < -halfWidth (normal points right)
    ]
  }, [panelWidth, panelHeight])

  useEffect(() => {
    setScrollOffset(0)
    setTargetScrollOffset(0)
    momentumRef.current = 0
  }, [label])

  // Snap to nearest panel position
  const snapToNearestPanel = useCallback((currentOffset: number) => {
    // Calculate which panel is closest
    let nearestPanelIndex = 0
    let minDistance = Infinity
    
    for (let i = 0; i < totalPanels; i++) {
      const panelPosition = i * panelSpacing
      const distance = Math.abs(currentOffset - panelPosition)
      if (distance < minDistance) {
        minDistance = distance
        nearestPanelIndex = i
      }
    }
    
    // Snap to the nearest panel position
    const snapPosition = nearestPanelIndex * panelSpacing
    return Math.max(0, Math.min(maxScrollOffset, snapPosition))
  }, [totalPanels, panelSpacing, maxScrollOffset])

  // Momentum scrolling animation loop - runs continuously when panel is open
  useEffect(() => {
    if (!isStackedPanel) return

    let animationFrameId: number
    const friction = 0.92 // Momentum decay factor (Framer Motion-like)
    const minVelocity = 0.001 // Minimum velocity to continue animation
    let snapTimeoutId: NodeJS.Timeout | null = null

    const animate = () => {
      if (Math.abs(momentumRef.current) > minVelocity) {
        // Apply momentum
        setTargetScrollOffset(prev => {
          const newOffset = prev + momentumRef.current
          const clamped = Math.max(0, Math.min(maxScrollOffset, newOffset))
          
          // If we hit a boundary, stop momentum
          if (clamped !== newOffset) {
            momentumRef.current = 0
            return clamped
          }
          
          return newOffset
        })
        
        // Decay momentum
        momentumRef.current *= friction
        
        // Clear any pending snap
        if (snapTimeoutId) {
          clearTimeout(snapTimeoutId)
          snapTimeoutId = null
        }
        
        animationFrameId = requestAnimationFrame(animate)
      } else {
        // Momentum has stopped - snap to nearest panel after a short delay
        if (!snapTimeoutId) {
          snapTimeoutId = setTimeout(() => {
            setTargetScrollOffset(prev => {
              const snapped = snapToNearestPanel(prev)
              return snapped
            })
            snapTimeoutId = null
          }, 150) // Small delay before snapping
        }
      }
    }

    // Start animation loop
    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      if (snapTimeoutId) {
        clearTimeout(snapTimeoutId)
      }
    }
  }, [isStackedPanel, maxScrollOffset, panelSpacing, totalPanels, snapToNearestPanel])

  useEffect(() => {
    if (!isStackedPanel) return

    let snapTimeoutId: NodeJS.Timeout | null = null

    const handleWheel = (e: WheelEvent) => {
      // Only handle scroll when hovering over the panel
      if (!isHovered) return
      
      e.preventDefault()
      e.stopPropagation()
      
      const scrollDelta = e.deltaY * scrollSensitivity
      
      // Add to momentum for smooth scrolling
      momentumRef.current += scrollDelta * 0.5
      
      // Clamp momentum to prevent excessive scrolling
      momentumRef.current = Math.max(-0.1, Math.min(0.1, momentumRef.current))
      
      // Update target scroll offset immediately for responsive feel
      setTargetScrollOffset(prev => {
        const newOffset = prev + scrollDelta
        return Math.max(0, Math.min(maxScrollOffset, newOffset))
      })
      
      // Update actual scroll offset for immediate feedback
      setScrollOffset(prev => {
        const newOffset = prev + scrollDelta
        return Math.max(0, Math.min(maxScrollOffset, newOffset))
      })
      
      // Clear any pending snap when user is actively scrolling
      if (snapTimeoutId) {
        clearTimeout(snapTimeoutId)
        snapTimeoutId = null
      }
      
      // Set up snap after user stops scrolling
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        // User has stopped scrolling - snap to nearest panel
        setTargetScrollOffset(prev => {
          const snapped = snapToNearestPanel(prev)
          return snapped
        })
      }, 200) // Wait 200ms after last scroll event
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (snapTimeoutId) {
        clearTimeout(snapTimeoutId)
      }
    }
  }, [isStackedPanel, scrollSensitivity, maxScrollOffset, panelSpacing, totalPanels, snapToNearestPanel, isHovered])

  // Back button properties
  const backButtonRadius = 0.025
  const backButtonPosition: [number, number, number] = [
    panelPosition[0] - panelWidth / 2 + 0.05,  // Top-left corner
    panelPosition[1] + panelHeight / 2 - 0.05,
    panelPosition[2] + 0.02  // Slightly in front of panel
  ]
  
  // Animate panel appearance
  const { scale, opacity } = useSpring({
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: { tension: 280, friction: 26 }
  })
  
  // Glassmorphism effect on hover
  const glassSpring = useSpring({
    buttonOpacity: backHovered ? 0.3 : 0.5,
    buttonScale: backHovered ? 1.05 : 1,
    emissiveIntensity: backHovered ? 0.2 : 0,
    config: { tension: 300, friction: 20 }
  })
  
  return (
    <animated.group scale={scale}>
      {/* Main Panel - Floating Transparent Glass with Custom Rounded Shape (hidden for stacked panels) */}
      {!isStackedPanel && (
        <mesh 
          position={panelPosition}
          castShadow
          receiveShadow
          onClick={(e) => e.stopPropagation()}
        >
          <extrudeGeometry args={[
            panelShape,
            {
              depth: 0.01,
              bevelEnabled: false,
              curveSegments: 32
            }
          ]} />
          <MeshTransmissionMaterial
            color="white"
            metalness={0}
            roughness={0.01}
            ior={1.8}
            thickness={0}
            reflectivity={1}
            chromaticAberration={0.1}
            clearcoat={0.4}
            resolution={512}
            clearcoatRoughness={0.05}
            iridescence={0.9}
            iridescenceIOR={0.1}
            iridescenceThicknessRange={[0, 140]}
            samples={2}
          />
        </mesh>
      )}
      
      {/* Back Button - Glassmorphic circular disc (hidden for home panel and stacked panels) */}
      {!hideBackButton && !isStackedPanel && (
        <animated.group
          position={backButtonPosition}
          scale={glassSpring.buttonScale}
          onClick={onBack}
          onPointerEnter={() => setBackHovered(true)}
          onPointerLeave={() => setBackHovered(false)}
        >
          <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[backButtonRadius, backButtonRadius, panelDepth, 32]} />
            <animated.meshPhysicalMaterial
              color="#808080"
              metalness={0.1}
              roughness={0.2}
              opacity={glassSpring.buttonOpacity}
              transparent={true}
              transmission={0.3}
              thickness={0.5}
              emissive="#FFFFFF"
              emissiveIntensity={glassSpring.emissiveIntensity}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
            />
          </mesh>
          
          {/* Back Arrow - Simple left arrow */}
          <Text
            position={[0, 0, panelDepth / 2 + 0.005]}
            fontSize={0.025}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            ←
          </Text>
        </animated.group>
      )}
      
      {/* Content Area - Scrollable for Projects Panel */}
      {content && (
        <group 
          onClick={(e) => e.stopPropagation()}
          position={[0, 0, 0]}
        >
          
          {/* Greeting Section - "Hi I'm" */}
          {content.name && (
            <group>
              {/* Profile Image - Circular on the right side - BIGGER */}
              {content.image && (
                <>
                  <ProfileImage 
                    imagePath={content.image}
                    position={[panelPosition[0] + 0.2, panelPosition[1] + 0.05, panelPosition[2] + 0.015]}
                    radius={0.25}
                  />
                  
                  {/* Social Media Buttons Below Profile */}
                  <SocialButton
                    position={[panelPosition[0] + 0.13, panelPosition[1] - 0.275, panelPosition[2] + 0.02]}
                    icon="github"
                    url="https://github.com/legitHacker23"
                  />
                  <SocialButton
                    position={[panelPosition[0] + 0.27, panelPosition[1] - 0.275, panelPosition[2] + 0.02]}
                    icon="linkedin"
                    url="https://www.linkedin.com/in/noahmndza/"
                  />
                </>
              )}
              
              {/* "Greeting */}
              <Text
                position={[panelPosition[0] - 0.425, panelPosition[1] + 0.265, panelPosition[2] + 0.02]}
                fontSize={0.04}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
              >
                Hello, I'm
              </Text>
              
              {/* Glassmorphic rounded rectangle in front of name */}
              <mesh 
                position={[panelPosition[0] - 0.335, panelPosition[1] + 0.175, panelPosition[2] + 0.01]}
                castShadow
                receiveShadow
              >
                <extrudeGeometry args={[
                  (() => {
                    const width = 0.37
                    const height = 0.07
                    const radius = 0.03
                    
                    const shape = new THREE.Shape()
                    shape.moveTo(-width/2 + radius, -height/2)
                    shape.lineTo(width/2 - radius, -height/2)
                    shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius)
                    shape.lineTo(width/2, height/2 - radius)
                    shape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2)
                    shape.lineTo(-width/2 + radius, height/2)
                    shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius)
                    shape.lineTo(-width/2, -height/2 + radius)
                    shape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2)
                    shape.closePath()

                    return shape
                  })(),
                  {
                    depth: 0.01,
                    bevelEnabled: false,
                    curveSegments: 32
                  }
                ]} />
                <meshPhysicalMaterial
                  color="#F0F0F0"
                  metalness={0.0}
                  roughness={0.5}
                  opacity={0.5}
                  transparent={true}
                  transmission={0.7}
                  thickness={2.0}
                  clearcoat={1.0}
                  clearcoatRoughness={0.6}
                  ior={2}
                  attenuationDistance={0.5}
                  attenuationColor="#FFFFFF"
                  depthWrite={false}
                />
              </mesh>
              
              {/* Name text on top of glass oval - shifted left to match */}
              <Text
                position={[panelPosition[0] - 0.335, panelPosition[1] + 0.175, panelPosition[2] + 0.015]}
                fontSize={0.04}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
              >
                {content.name}
              </Text>
            </group>
          )}
          
          {isStackedPanel ? (
            <group 
              position={[panelPosition[0], panelPosition[1], panelPosition[2] + 0.02]}
            >
              {/* Invisible plane to catch hover events for scrolling */}
              <mesh
                position={[0, 0, 0]}
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
              >
                <planeGeometry args={[panelWidth, panelHeight * 1.5]} />
                <meshBasicMaterial visible={false} />
              </mesh>
              
              {/* iOS-style stacked panels (Projects or Experience) */}
              {stackedPanels.map((PanelComponent, index) => {
                // Calculate position based on scroll offset
                const baseY = -index * panelSpacing
                const transitionStart = index * panelSpacing
                const transitionEnd = (index + 1) * panelSpacing
                const shouldRenderPanel = !isStackedPanel || activePanelIndex === undefined
                  ? true
                  : Math.abs(index - activePanelIndex) <= 1
                
                // Animated Y position
                const panelY = useSpring({
                  y: scrollY.to((s) => {
                    return baseY + s
                  }),
                  z: scrollY.to((s) => {
                    if (s >= transitionStart && s <= transitionEnd) {
                      const t = (s - transitionStart) / (transitionEnd - transitionStart)
                      return -depthOffset * t
                    } else if (s > transitionEnd) {
                      return -depthOffset
                    } else if (s < transitionStart) {
                      return -depthOffset
                    }
                    return 0
                  }),
                  scale: scrollY.to((s) => {
                    let z = 0
                    if (s >= transitionStart && s <= transitionEnd) {
                      const t = (s - transitionStart) / (transitionEnd - transitionStart)
                      z = -depthOffset * t
                    } else if (s > transitionEnd) {
                      z = -depthOffset
                    } else if (s < transitionStart) {
                      z = -depthOffset
                    }
                    return 1 - (Math.abs(z) / depthOffset) * 0.1
                  }),
                  config: { tension: 280, friction: 30 }
                })
                
                // Back button position for first panel only
                const backButtonPosition: [number, number, number] = [
                  -panelWidth / 2 + 0.05,
                  panelHeight / 2 - 0.05,
                  0.02
                ]
                
                return (
                  <animated.group
                    key={index}
                    position-y={panelY.y}
                    position-z={panelY.z}
                    scale={panelY.scale}
                  >
                    {shouldRenderPanel && (
                      <>
                        {/* Individual panel with glass effect */}
                        <mesh 
                          position={[0, 0, 0]}
                          castShadow
                          receiveShadow
                        >
                          <extrudeGeometry args={[
                            panelShape,
                            {
                              depth: 0.01,
                              bevelEnabled: false,
                              curveSegments: 32
                            }
                          ]} />
                          <MeshTransmissionMaterial
                            color="white"
                            metalness={0}
                            roughness={0.01}
                            ior={1.8}
                            thickness={0}
                            reflectivity={1}
                            chromaticAberration={0.1}
                            clearcoat={0.4}
                            resolution={256}
                            clearcoatRoughness={0.05}
                            iridescence={0.9}
                            iridescenceIOR={0.1}
                            iridescenceThicknessRange={[0, 140]}
                            samples={2}
                          />
                        </mesh>
                        
                        {/* Back Button - Only on first panel (index 0) */}
                        {index === 0 && (
                          <animated.group
                            position={backButtonPosition}
                            scale={glassSpring.buttonScale}
                            onClick={onBack}
                            onPointerEnter={() => setBackHovered(true)}
                            onPointerLeave={() => setBackHovered(false)}
                          >
                            <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
                              <cylinderGeometry args={[backButtonRadius, backButtonRadius, panelDepth, 32]} />
                              <animated.meshPhysicalMaterial
                                color="#808080"
                                metalness={0.1}
                                roughness={0.2}
                                opacity={glassSpring.buttonOpacity}
                                transparent={true}
                                transmission={0.3}
                                thickness={0.5}
                                emissive="#FFFFFF"
                                emissiveIntensity={glassSpring.emissiveIntensity}
                                clearcoat={1.0}
                                clearcoatRoughness={0.1}
                              />
                            </mesh>
                            
                            {/* Back Arrow - Simple left arrow */}
                            <Text
                              position={[0, 0, panelDepth / 2 + 0.005]}
                              fontSize={0.025}
                              color="#FFFFFF"
                              anchorX="center"
                              anchorY="middle"
                            >
                              ←
                            </Text>
                          </animated.group>
                        )}
                        
                        {/* Section content inside panel */}
                        <PanelComponent position={[0, 0, 0.025]} />
                      </>
                    )}
                  </animated.group>
                )
              })}
            </group>
          ) : (
            content.text && (
              <Text
                position={[panelPosition[0] - 0.2925, panelPosition[1] - 0.075, panelPosition[2] + 0.02]}
                fontSize={0.027}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
                maxWidth={panelWidth - 0.75}
                lineHeight={1.3}
                textAlign="left"
              >
                {content.text}
              </Text>
            )
          )}
        </group>
      )}
    </animated.group>
  )
}

export function FloatingIcons() {
  // State to track home vs icons view
  const [showingHome, setShowingHome] = useState(true)
  
  // State to track active panel index for Projects panel
  const [activePanelIndex, setActivePanelIndex] = useState(4)
  
  const [panelState, setPanelState] = useState<{ 
    isOpen: boolean
    label: string
    content?: {
      image?: string
      text?: string
      name?: string
    }
  }>({
    isOpen: false,
    label: ''
  })
  
  // Define content for each panel
  const panelContent: Record<string, { image?: string; text?: string; name?: string }> = {
    'Home': {
      name: 'Noah Mendoza',
      image: '/assets/profilepic.png',
      text: 'I\'m a Data Science student at the University of Texas at Austin. My experience spans MIT, Harvard, and Rice University.\n\nI\'ve built systems ranging from a posture detection app with 98% accuracy to an AWS Youtube trend prediction platform processing over 75,000 ingestion events.'
    },
    'Experience': {
      text: 'Experience content coming soon...'
    },
    'Projects': {
      text: 'Projects content rendered via sections.'
    },
    'Resume': {
      text: 'Resume content coming soon...'
    },
    'Contact Me': {
      text: 'Contact information coming soon...'
    }
  }


  // Icon positions arranged in a grid pattern, centered in view
  // Position format: [X, Y, Z]
  // X: left(-) / right(+)
  // Y: down(-) / up(+)
  // Z: toward camera(-) / away from camera(+)
  
  // Icons with white disc base
  const icons = [
    // Top row (3 icons)
    { position: [0.2, 0.55, BASE_Z_POSITION] as [number, number, number], color: '#FFFFFF', iconType: 'folder', label: 'Experience' }, // Top-left - Experience
    { position: [0.55, 0.55, BASE_Z_POSITION] as [number, number, number], color: '#FFFFFF', iconType: 'briefcase', label: 'Projects' }, // Top-middle - Work
    { position: [0.9, 0.55, BASE_Z_POSITION] as [number, number, number], color: '#6D8196', iconType: 'paper', label: 'Resume' }, // Top-right - Resume
    
    // Bottom row (1 icon with white disc)
    { position: [0.2, 0.2, BASE_Z_POSITION] as [number, number, number], color: '#6D8196', iconType: 'envelope', label: 'Contact Me' }, // Bottom-left - Contact Me
  ]
  
  // Standalone GLB icons (no white disc)
  const standaloneIcons = [
    { position: [0.55, 0.2, BASE_Z_POSITION] as [number, number, number], label: 'GitHub', type: 'github' }, // Bottom-middle - GitHub
    { position: [0.9, 0.2, BASE_Z_POSITION] as [number, number, number], label: 'LinkedIn', type: 'linkedin' }, // Bottom-right - LinkedIn
  ]

  const handleIconClick = (label: string) => {
    // Handle external links for GitHub and LinkedIn
    if (label === 'GitHub') {
      window.open('https://github.com/legitHacker23', '_blank', 'noopener,noreferrer')
      return
    }
    if (label === 'LinkedIn') {
      window.open('https://www.linkedin.com/in/noahmndza', '_blank', 'noopener,noreferrer')
      return
    }
    
    // Handle regular panels
    setPanelState({ 
      isOpen: true, 
      label,
      content: panelContent[label]
    })
  }

  const handleBack = () => {
    setPanelState({ isOpen: false, label: '' })
  }

  const handleToggleHome = () => {
    if (showingHome) {
      // Going from home to icons
      setShowingHome(false)
    } else {
      // Going from icons to home
      setShowingHome(true)
      // Close any open panel
      setPanelState({ isOpen: false, label: '' })
    }
  }

  // Animate icons group - same as panel animation
  const iconsSpring = useSpring({
    from: { scale: 0.8 },
    to: { scale: !showingHome && !panelState.isOpen ? 1 : 0.8 },
    reset: !showingHome && !panelState.isOpen,
    config: { tension: 280, friction: 26 }
  })

  return (
    <group>
      {/* Home Panel - shown initially and when showingHome is true */}
      {showingHome && !panelState.isOpen && (
        <FloatingPanel
          label="Home"
          onBack={() => {}} // No back button for home panel
          content={panelContent['Home']}
          hideBackButton={true}
        />
      )}
      
      {/* Icons group - shown when not showing home and no panel is open */}
      {!showingHome && !panelState.isOpen && (
        <animated.group 
          scale={iconsSpring.scale}
          position={[0.2, 0.55, 0]}
        >
          {/* Regular icons with white disc base */}
          {icons.map((icon, index) => (
            <FloatingIcon
              key={index}
              position={[icon.position[0] - 0.2, icon.position[1] - 0.55, icon.position[2]]}
              color={icon.color}
              iconType={icon.iconType}
              label={icon.label}
              onClick={() => handleIconClick(icon.label)}
            />
          ))}
          
          {/* Standalone GLB icons (no white disc) */}
          {standaloneIcons.map((icon, index) => {
            if (icon.type === 'github') {
              return (
                <StandaloneGitHubIcon
                  key={`standalone-${index}`}
                  position={[icon.position[0] - 0.2, icon.position[1] - 0.55, icon.position[2]]}
                  label={icon.label}
                  onClick={() => handleIconClick(icon.label)}
                />
              )
            } else if (icon.type === 'linkedin') {
              return (
                <StandaloneLinkedInIcon
                  key={`standalone-${index}`}
                  position={[icon.position[0] - 0.2, icon.position[1] - 0.55, icon.position[2]]}
                  label={icon.label}
                  onClick={() => handleIconClick(icon.label)}
                />
              )
            }
            return null
          })}
        </animated.group>
      )}
      
      {/* Show selected panel when open (from clicking an icon) */}
      {!showingHome && panelState.isOpen && (
        panelState.label === 'Contact Me' ? (
          <ContactFormPanel
            onBack={handleBack}
          />
        ) : (
          <>
            <FloatingPanel
              label={panelState.label}
              onBack={handleBack}
              content={panelState.content}
              onActivePanelChange={setActivePanelIndex}
              activePanelIndex={activePanelIndex}
            />
            {/* Small Menu Panel - show when stacked panels (Projects/Experience) are open */}
            {(panelState.label === 'Projects' || panelState.label === 'Experience') && (
              <SmallMenuPanel activePanelIndex={activePanelIndex} />
            )}
          </>
        )
      )}
      
      {/* Home Toggle Button - always visible */}
      <HomeToggleButton
        position={
          panelState.isOpen &&
          (panelState.label === 'Projects' || panelState.label === 'Experience')
            ? [-0.155, 0.175, BASE_Z_POSITION]
            : [0.55, -0.2, BASE_Z_POSITION]
        }
        showDots={showingHome}
        onClick={handleToggleHome}
      />    </group>
  )
}

// Preload GLB models for better performance
useGLTF.preload('/assets/github.glb')
useGLTF.preload('/assets/linkedin.glb')
