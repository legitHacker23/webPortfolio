import React, { Suspense, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface EnvironmentProps {
  scale?: number | [number, number, number]
  position?: [number, number, number]
}

function EnvironmentModel({ scale = 1, position = [0, 0, 0] }: EnvironmentProps) {
  const { scene } = useGLTF('/assets/environment.glb')

  useEffect(() => {
    // Configure materials for proper lighting
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Ensure materials use proper encoding
        if (child.material) {
          const material = child.material as THREE.MeshStandardMaterial
          
          // Remove texture maps to show solid color
          material.map = null
          material.emissiveMap = null
          
          // Enable shadows if needed (currently disabled for performance)
          child.castShadow = false
          child.receiveShadow = false
          
          // Make environment white
          material.color.set('#FFFFFF')
          material.needsUpdate = true
        }
      }
    })
  }, [scene])

  return (
    <primitive 
      object={scene} 
      scale={scale}
      position={position}
    />
  )
}

export function Environment(props: EnvironmentProps) {
  return (
    <Suspense fallback={null}>
      <EnvironmentModel {...props} />
    </Suspense>
  )
}

// Preload the model
useGLTF.preload('/assets/environment.glb')

