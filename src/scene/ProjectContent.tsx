// src/scene/ProjectContent.tsx
import React, { Suspense } from 'react'
import { Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Project data
export const PROJECT_SECTIONS = [
  {
    title: 'Rice University AI Course Catalog',
    description: 'Built an AI course search platform by web scraping 1,000+ Rice university courses and implementing a FAISS vector retrieval with an OpenAI and Websocket RAG pipeline to answer real time academic questions for 1000+ incoming Rice students.',
    image: '/assets/rice.png'
  },
  {
    title: 'Posture Detection Application',
    description: 'Developed a real-time posture monitoring MacOS application by collecting 30,000+ posture data samples, training a Decision Tree Regressor model achieving 98% accuracy, and deploying CoreML inference with Vision pose detection. Tech Stack: Swift, Python, Scikit-learn, Pandas',
    image: '/assets/postureproject.png'
  },
  {
    title: 'Smart Mirror',
    description: 'Designed a voice-activated smart mirror featuring a modern, responsive UI that uses speech recognition and Gemini 2.0 Flash to answer real-time questions about weather, calendar events, and stock prices. Tech Stack: React, Flask',
    image: '/assets/magicMirror.png'
  },
  {
    title: 'Youtube Smart Clipping Pipeline',
    description: ''
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
  
  // Adjust texture to fill the panel properly (cover mode - fills entire panel)
  React.useEffect(() => {
    if (texture && texture.image) {
      const imageAspect = texture.image.width / texture.image.height
      const panelAspect = width / height
      
      // Check if this is the posture project image
      const isPostureProject = imagePath.includes('postureproject')
      
      // Always fill the entire panel - use cover mode
      if (imageAspect > panelAspect) {
        // Image is wider than panel - fit height (fill vertical), crop sides
        const scale = imageAspect / panelAspect
        texture.repeat.set(scale, 1)
        const xOffset = (1 - scale) / 2
        // For posture project, shift up by adjusting Y offset (positive = show more top)
        const yOffset = isPostureProject ? 0.2 : 0
        texture.offset.set(xOffset, yOffset)
      } else {
        // Image is taller than panel - fit width (fill horizontal), crop top/bottom
        // Scale to fill width, which means scaling up vertically
        const scale = panelAspect / imageAspect
        texture.repeat.set(1, scale)
        // Offset to center vertically
        let centerOffset = (1 - 1/scale) / 2
        // For posture project, shift up (add to offset to show more top)
        if (isPostureProject) {
          centerOffset += 0.2  // Positive offset shows more of the top
        }
        texture.offset.set(0, centerOffset)
      }
      
      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      texture.needsUpdate = true
    }
  }, [texture, width, height, imagePath])
  
  // Check if this is the posture project for shader adjustment
  const isPostureProject = imagePath.includes('postureproject')
  
  // Shader material with image and bottom fade gradient
  const material = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uFadeStart: { value: 1 }, // Start fade at 30% from bottom
        uFadeEnd: { value: 0.0 },    // Full black at bottom
        uVerticalShift: { value: isPostureProject ? -0.025 : 0.0 }  // Shift for posture project
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
        uniform float uVerticalShift;
        varying vec2 vUv;
        
        void main() {
          // Simple rounded corners - proper rounded rectangle distance
          float radius = 0.06;
          
          // Convert UV to center-origin (ranges from -0.5 to 0.5)
          vec2 p = vUv - 0.5;
          vec2 halfSize = vec2(0.5, 0.5) - radius;
          
          // Calculate distance to rounded rectangle
          vec2 d = abs(p) - halfSize;
          float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
          
          // Discard pixels outside rounded rectangle
          if (dist > 0.0) {
            discard;
          }
          
          // Adjust UV coordinates to shift image up (positive shift shows more top)
          vec2 adjustedUv = vec2(vUv.x, vUv.y + uVerticalShift);
          // Clamp to valid UV range
          adjustedUv.y = clamp(adjustedUv.y, 0.0, 1.0);
          
          vec4 texColor = texture2D(uTexture, adjustedUv);
          
          // Calculate fade based on vertical position (vUv.y: 0 = bottom, 1 = top)
          float fadeFactor = smoothstep(uFadeEnd, uFadeStart, vUv.y);
          
          // Apply black fade at bottom
          vec3 finalColor = mix(vec3(0.0, 0.0, 0.0), texColor.rgb, fadeFactor);
          
          gl_FragColor = vec4(finalColor, texColor.a);
        }
      `
    })
  }, [texture, isPostureProject])
  
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
        position={[0, 0, -0.01]}
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
        position={[-0.5, -0.25, 0.02]}
        fontSize={0.024}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        maxWidth={0.8}
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
      {/* Image on the right - behind text */}
      <ProjectScreenshot
        imagePath={section.image!}
        position={[0, 0, -0.01]}
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
        position={[-0.5, -0.25, 0.02]}
        fontSize={0.024}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        maxWidth={0.8}
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
      {/* Image on the right - behind text */}
      {section.image && (
        <ProjectScreenshot
          imagePath={section.image}
          position={[0, 0, -0.01]}
          width={1.2}
          height={0.9}
        />
      )}
      
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
        position={[-0.5, -0.25, 0.02]}
        fontSize={0.024}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        maxWidth={0.8}
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

