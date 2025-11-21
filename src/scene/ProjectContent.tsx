// src/scene/ProjectContent.tsx
import React, { Suspense } from 'react'
import { Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Project data
export const PROJECT_SECTIONS = [
  {
    title: 'Rice University AI Course Catalog',
    // description: 'Built an intelligent course-search platform using FAISS vector retrieval and OpenAI, enabling students to ask complex academic questions and receive real-time, context-aware results. Implemented a WebSocket architecture for instant AI responses and created a full RAG pipeline for indexing thousands of course descriptions. Tech stack: Python, FAISS, OpenAI, React, WebSockets.',
    image: '/assets/rice.png'
  },
  {
    title: 'Project 2: AWS YouTube Trend Prediction',
    description: 'A cloud-based platform that processes over 75,000 ingestion events to predict trending YouTube videos. Built with AWS services including Lambda, S3, and DynamoDB.'
  },
  {
    title: 'Project 3: Data Analysis Dashboard',
    description: 'An interactive dashboard for visualizing and analyzing large datasets. Features real-time updates and custom filtering capabilities.'
  }
]

// Project Screenshot Component
function ProjectScreenshotInternal({ imagePath, position, width = 1, height = 1 }: { 
  imagePath: string
  position: [number, number, number]
  width?: number
  height?: number 
}) {
  const texture = useTexture(imagePath)
  
  // Reset texture to fill the panel (no aspect ratio preservation)
  React.useEffect(() => {
    if (texture) {
      texture.repeat.set(1, 1)
      texture.offset.set(0, 0)
      texture.needsUpdate = true
    }
  }, [texture])
  
  // Shader material with image and bottom fade gradient
  const material = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uFadeStart: { value: 0.85 }, // Start fade at 30% from bottom
        uFadeEnd: { value: 0.0 }    // Full black at bottom
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uFadeStart;
        uniform float uFadeEnd;
        varying vec2 vUv;
        
        void main() {
          vec4 texColor = texture2D(uTexture, vUv);
          
          // Calculate fade based on vertical position (vUv.y: 0 = bottom, 1 = top)
          float fadeFactor = smoothstep(uFadeEnd, uFadeStart, vUv.y);
          
          // Apply black fade at bottom
          vec3 finalColor = mix(vec3(0.0, 0.0, 0.0), texColor.rgb, fadeFactor);
          
          gl_FragColor = vec4(finalColor, texColor.a);
        }
      `
    })
  }, [texture])
  
  // Update texture uniform when it loads
  React.useEffect(() => {
    if (material && texture) {
      material.uniforms.uTexture.value = texture
    }
  }, [material, texture])
  
  return (
    <mesh
      position={position}
      castShadow
    >
      <planeGeometry args={[width, height]} />
      <primitive object={material} />
    </mesh>
  )
}

function ProjectScreenshot({ imagePath, position, width = 1, height = 0.3 }: { 
  imagePath: string
  position: [number, number, number]
  width?: number
  height?: number 
}) {
  return (
    <Suspense fallback={null}>
      <ProjectScreenshotInternal
        imagePath={imagePath}
        position={position}
        width={width}
        height={height}
      />
    </Suspense>
  )
}

// Project Panel 1 - Rice University AI Course Catalog (with image)
interface ProjectPanel1Props {
  position: [number, number, number]
}

export function ProjectPanel1({ position }: ProjectPanel1Props) {
  const section = PROJECT_SECTIONS[0]
  
  return (
    <group position={position}>
      {/* Image on the right - behind text */}
      <ProjectScreenshot
        imagePath={section.image!}
        position={[0, 0, 0]}
        width={1.2}
        height={0.9}
      />
      
      {/* Title on the left - in front of image */}
      <Text
        position={[-0.5, -0.15, 0.02]}
        fontSize={0.035}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        fontWeight="bold"
        maxWidth={0.35}
      >
        {section.title}
      </Text>
      
      {/* Description on the left, below title - in front of image */}
      <Text
        position={[-0.5, 0.225, 0.02]}
        fontSize={0.024}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        maxWidth={0.35}
        lineHeight={1.3}
        textAlign="left"
      >
        {section.description}
      </Text>
    </group>
  )
}

// Project Panel 2 - AWS YouTube Trend Prediction
interface ProjectPanel2Props {
  position: [number, number, number]
}

export function ProjectPanel2({ position }: ProjectPanel2Props) {
  const section = PROJECT_SECTIONS[1]
  
  return (
    <group position={position}>
      {/* Title */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.04}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        fontWeight="bold"
        maxWidth={0.75}
      >
        {section.title}
      </Text>
      
      {/* Description */}
      <Text
        position={[0, -0.12, 0]}
        fontSize={0.027}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        maxWidth={0.75}
        lineHeight={1.3}
        textAlign="left"
      >
        {section.description}
      </Text>
    </group>
  )
}

// Project Panel 3 - Data Analysis Dashboard
interface ProjectPanel3Props {
  position: [number, number, number]
}

export function ProjectPanel3({ position }: ProjectPanel3Props) {
  const section = PROJECT_SECTIONS[2]
  
  return (
    <group position={position}>
      {/* Title */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.04}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        fontWeight="bold"
        maxWidth={0.75}
      >
        {section.title}
      </Text>
      
      {/* Description */}
      <Text
        position={[0, -0.12, 0]}
        fontSize={0.027}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        maxWidth={0.75}
        lineHeight={1.3}
        textAlign="left"
      >
        {section.description}
      </Text>
    </group>
  )
}

// Project Panel 4 - Machine Learning Pipeline
interface ProjectPanel4Props {
  position: [number, number, number]
}

export function ProjectPanel4({ position }: ProjectPanel4Props) {
  const section = PROJECT_SECTIONS[3]
  
  return (
    <group position={position}>
      {/* Title */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.04}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        fontWeight="bold"
        maxWidth={0.75}
      >
        {section.title}
      </Text>
      
      {/* Description */}
      <Text
        position={[0, -0.12, 0]}
        fontSize={0.027}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        maxWidth={0.75}
        lineHeight={1.3}
        textAlign="left"
      >
        {section.description}
      </Text>
    </group>
  )
}

// Project Panel 5 - Web Application Framework
interface ProjectPanel5Props {
  position: [number, number, number]
}

export function ProjectPanel5({ position }: ProjectPanel5Props) {
  const section = PROJECT_SECTIONS[4]
  
  return (
    <group position={position}>
      {/* Title */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.04}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        fontWeight="bold"
        maxWidth={0.75}
      >
        {section.title}
      </Text>
      
      {/* Description */}
      <Text
        position={[0, -0.12, 0]}
        fontSize={0.027}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        maxWidth={0.75}
        lineHeight={1.3}
        textAlign="left"
      >
        {section.description}
      </Text>
    </group>
  )
}

// Section Border Component
function SectionBorder({ 
  width, 
  height, 
  position 
}: { 
  width: number
  height: number
  position: [number, number, number]
}) {
  const borderThickness = 0.005
  const radius = 0.08  // Match panel radius
  
  const borderShape = React.useMemo(() => {
    const outerShape = new THREE.Shape()
    outerShape.moveTo(-width / 2 + radius, -height / 2)
    outerShape.lineTo(width / 2 - radius, -height / 2)
    outerShape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius)
    outerShape.lineTo(width / 2, height / 2 - radius)
    outerShape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2)
    outerShape.lineTo(-width / 2 + radius, height / 2)
    outerShape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius)
    outerShape.lineTo(-width / 2, -height / 2 + radius)
    outerShape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2)
    outerShape.closePath()
    
    // Create inner shape for border effect
    const innerWidth = width - borderThickness * 2
    const innerHeight = height - borderThickness * 2
    const innerRadius = Math.max(0.01, radius - borderThickness)
    
    const innerShape = new THREE.Shape()
    innerShape.moveTo(-innerWidth / 2 + innerRadius, -innerHeight / 2)
    innerShape.lineTo(innerWidth / 2 - innerRadius, -innerHeight / 2)
    innerShape.quadraticCurveTo(innerWidth / 2, -innerHeight / 2, innerWidth / 2, -innerHeight / 2 + innerRadius)
    innerShape.lineTo(innerWidth / 2, innerHeight / 2 - innerRadius)
    innerShape.quadraticCurveTo(innerWidth / 2, innerHeight / 2, innerWidth / 2 - innerRadius, innerHeight / 2)
    innerShape.lineTo(-innerWidth / 2 + innerRadius, innerHeight / 2)
    innerShape.quadraticCurveTo(-innerWidth / 2, innerHeight / 2, -innerWidth / 2, innerHeight / 2 - innerRadius)
    innerShape.lineTo(-innerWidth / 2, -innerHeight / 2 + innerRadius)
    innerShape.quadraticCurveTo(-innerWidth / 2, -innerHeight / 2, -innerWidth / 2 + innerRadius, -innerHeight / 2)
    innerShape.closePath()
    
    // Subtract inner from outer to create border frame
    outerShape.holes.push(innerShape)
    
    return outerShape
  }, [width, height, borderThickness, radius])
  
  return (
    <mesh position={position}>
      <extrudeGeometry args={[borderShape, { depth: 0.002, bevelEnabled: false }]} />
      <meshStandardMaterial
        color="#FFFFFF"
        opacity={0.6}
        transparent={true}
      />
    </mesh>
  )
}

// Section 1 - AI & Cloud Projects
interface ProjectSection1Props {
  position: [number, number, number]
}

export function ProjectSection1({ position }: ProjectSection1Props) {
  const sectionWidth = 1.2  // Match panel width
  const sectionHeight = 0.9 // Match panel height
  
  return (
    <group position={position}>
      {/* Section Border */}
      <SectionBorder 
        width={sectionWidth}
        height={sectionHeight}
        position={[0, 0, -0.001]}
      />
      
      {/* Section Title */}
      <Text
        position={[0, 0.25, 0]}
        fontSize={0.045}
        color="#FFFFFF"
        anchorX="center"
        anchorY="top"
        fontWeight="bold"
      >
        AI & Cloud Projects
      </Text>
      
      {/* Project 1 - Rice University AI Course Catalog */}
      <ProjectPanel1 position={[0, 0, 0]} />
    </group>
  )
}

// Section 2 - AWS & Cloud Projects
interface ProjectSection2Props {
  position: [number, number, number]
}

export function ProjectSection2({ position }: ProjectSection2Props) {
  const sectionWidth = 1.2  // Match panel width
  const sectionHeight = 0.9 // Match panel height
  
  return (
    <group position={position}>
      {/* Section Border */}
      <SectionBorder 
        width={sectionWidth}
        height={sectionHeight}
        position={[0, 0, -0.001]}
      />
      
      {/* Section Title */}
      <Text
        position={[0, 0.25, 0]}
        fontSize={0.045}
        color="#FFFFFF"
        anchorX="center"
        anchorY="top"
        fontWeight="bold"
      >
        AWS & Cloud Projects
      </Text>
      
      {/* Project 2 - AWS YouTube Trend Prediction */}
      <ProjectPanel2 position={[0, 0, 0]} />
    </group>
  )
}

// Section 3 - Data & Analytics Projects
interface ProjectSection3Props {
  position: [number, number, number]
}

export function ProjectSection3({ position }: ProjectSection3Props) {
  const sectionWidth = 1.2  // Match panel width
  const sectionHeight = 0.9 // Match panel height
  
  return (
    <group position={position}>
      {/* Section Border */}
      <SectionBorder 
        width={sectionWidth}
        height={sectionHeight}
        position={[0, 0, -0.001]}
      />
      
      {/* Section Title */}
      <Text
        position={[0, 0.25, 0]}
        fontSize={0.045}
        color="#FFFFFF"
        anchorX="center"
        anchorY="top"
        fontWeight="bold"
      >
        Data & Analytics Projects
      </Text>
      
      {/* Project 3 - Data Analysis Dashboard */}
      <ProjectPanel3 position={[0, 0, 0]} />
    </group>
  )
}

// Array of section components for scrolling
export const PROJECT_SECTIONS_ARRAY = [
  ProjectSection1,
  ProjectSection2,
  ProjectSection3,
]

// Keep old array for backwards compatibility if needed
export const PROJECT_PANELS = [
  ProjectPanel1,
  ProjectPanel2,
  ProjectPanel3,
]

