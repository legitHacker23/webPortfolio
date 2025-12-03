// src/scene/ExperienceContent.tsx
import React, { Suspense } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

// Experience data
export const EXPERIENCE_SECTIONS = [
  {
    role: 'AI/ML Full-Stack Software Engineer',
    company: 'MIT & Harvard',
    date: 'May 2025 - Present',
    description:
      'As an undergraduate researcher with the MantisAI group, I contributed to the MantisAI group to support their mission of building intelligent human-centered systems that enhance annalysius, understanding, and decision-making. My work focused on devloping interactive software tools, refining data workflows, and contributing to AI-driven interfaces designed to help teams manage complex research tasks more efficientlyt.',
    image: '/assets/mitcsail.png'
  },
  {
    role: 'Software Engineer Intern',
    company: 'SouthHampton Medical Imaging',
    date: 'May 2025 - August 2025',
    description:
      'Designed, built, and shipped a modern, responsive website for South Hampton Medical Imaging.',
    image: '/assets/southHampton.png'
  },
  {
    role: 'Software Engineer Intern',
    company: 'Texchange Unbrokered',
    date: 'August 2025 - October 2025',
    description:
      'Worked with the product team to design and improve core features as well as key UI workflows across TexChange\'s B2B SaaS web and mobile application.',
    image: '/assets/texchange.png'
  },
  {
    role: 'SQL & Python Trainee',
    company: 'Global Career Accelerator',
    date: 'January 2025 - May 2025',
    description:
      'Analyzed real-world datasets with Python and SQL while collaborating with a global team to deliver clear, actionable insights.',
    image: '/assets/globalcareeraccelerator.png'
  }
]

// Screenshot component reused for experience panels
function ExperienceScreenshotInternal({
  imagePath,
  position,
  width = 1,
  height = 1
}: {
  imagePath: string
  position: [number, number, number]
  width?: number
  height?: number
}) {
  const texture = useTexture(imagePath)
  const material = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uFadeStart: { value: 1 },
        uFadeEnd: { value: 0.3 },
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
          float radius = 0.06;
          vec2 p = vUv - 0.5;
          vec2 halfSize = vec2(0.5, 0.5) - radius;
          vec2 d = abs(p) - halfSize;
          float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
          if (dist > 0.0) discard;
          
          vec4 texColor = texture2D(uTexture, vUv);
          float fadeFactor = smoothstep(uFadeEnd, uFadeStart, vUv.y);
          vec3 finalColor = mix(vec3(0.0, 0.0, 0.0), texColor.rgb, fadeFactor);
          gl_FragColor = vec4(finalColor, texColor.a);
        }
      `
    })
  }, [texture])

  React.useEffect(() => {
    if (texture && texture.image) {
      const imageAspect = texture.image.width / texture.image.height
      const panelAspect = width / height

      if (imageAspect > panelAspect) {
        const scale = imageAspect / panelAspect
        texture.repeat.set(scale, 1)
        const xOffset = (1 - scale) / 2
        texture.offset.set(xOffset, 0)
      } else {
        const scale = panelAspect / imageAspect
        texture.repeat.set(1, scale)
        const centerOffset = (1 - 1 / scale) / 2
        texture.offset.set(0, centerOffset)
      }

      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      texture.needsUpdate = true
    }
  }, [texture, width, height, imagePath])
  
  React.useEffect(() => {
    if (material && texture) {
      material.uniforms.uTexture.value = texture
    }
  }, [material, texture])

  return (
    <mesh position={position} castShadow>
      <planeGeometry args={[width, height]} />
      <primitive object={material} />
    </mesh>
  )
}

function ExperienceScreenshot({
  imagePath,
  position,
  width = 1,
  height = 0.3
}: {
  imagePath: string
  position: [number, number, number]
  width?: number
  height?: number
}) {
  return (
    <Suspense fallback={null}>
      <ExperienceScreenshotInternal
        imagePath={imagePath}
        position={position}
        width={width}
        height={height}
      />
    </Suspense>
  )
}

interface ExperiencePanelProps {
  position: [number, number, number]
  sectionIndex: number
}

export function ExperiencePanel({ position, sectionIndex }: ExperiencePanelProps) {
  const section = EXPERIENCE_SECTIONS[sectionIndex]

  return (
    <group position={position}>
      {section.image && (
        <ExperienceScreenshot
          imagePath={section.image}
          position={[0, 0, -0.01]}
          width={1.2}
          height={0.9}
        />
      )}

      {/* Role - Top */}
      <Text
        position={[-0.5, -0.05, 0.02]}
        fontSize={0.035}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        fontWeight="bold"
        maxWidth={0.8}
      >
        {section.role}
      </Text>

      {/* Company - Second */}
      <Text
        position={[-0.5, -0.1, 0.02]}
        fontSize={0.028}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        maxWidth={0.8}
      >
        {section.company}
      </Text>

      {/* Date - Third */}
      {section.date && (
        <Text
          position={[-0.5, -0.15, 0.02]}
          fontSize={0.022}
          color="#CCCCCC"
          anchorX="left"
          anchorY="top"
          maxWidth={0.8}
        >
          {section.date}
        </Text>
      )}

      {/* Description - Bottom */}
      <Text
        position={[-0.5, -0.22, 0.02]}
        fontSize={0.024}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        maxWidth={1}
        lineHeight={1.3}
        textAlign="left"
      >
        {section.description}
      </Text>
    </group>
  )
}

interface ExperiencePanel1Props {
  position: [number, number, number]
}
export function ExperiencePanel1({ position }: ExperiencePanel1Props) {
  return <ExperiencePanel position={position} sectionIndex={0} />
}

interface ExperiencePanel2Props {
  position: [number, number, number]
}
export function ExperiencePanel2({ position }: ExperiencePanel2Props) {
  return <ExperiencePanel position={position} sectionIndex={1} />
}

interface ExperiencePanel3Props {
  position: [number, number, number]
}
export function ExperiencePanel3({ position }: ExperiencePanel3Props) {
  return <ExperiencePanel position={position} sectionIndex={2} />
}

interface ExperiencePanel4Props {
  position: [number, number, number]
}
export function ExperiencePanel4({ position }: ExperiencePanel4Props) {
  return <ExperiencePanel position={position} sectionIndex={3} />
}



