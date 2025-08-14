"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Button } from "@/components/ui/button"

// This component loads and displays your 3D model
function ModelViewer() {
  // This line now points to your uploaded .glb file
  const { scene } = useGLTF("/models/hero-model.glb")
  
  // You can adjust the scale and position to fit your scene perfectly
  return <primitive object={scene} scale={1.8} position={[0, -1.5, 0]} />
}

// Preload the model for faster loading times
useGLTF.preload("/models/hero-model.glb")


export default function MrCriminalHero() {
  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-[#050807] text-white">
      {/* Background grid/glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(1200px 600px at 80% 20%, rgba(0,255,136,0.15), transparent 60%), radial-gradient(800px 400px at 20% 80%, rgba(0,255,136,0.08), transparent 60%)",
          }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Grid layout for text and 3D model */}
      <div className="relative z-10 mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
        
        {/* Left Column: Text Content */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Hunt Bugs Like a <span className="text-primary-green animate-pulse">Cyber Warrior</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-primary-green/80">
            Discover vulnerabilities with AI-powered scanning, real-time analysis, and gamified learning. Join thousands
            of security professionals advancing their skills.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Button asChild className="cyber-button">
              <a href="/dashboard">Start Bug Hunting</a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-primary-green/40 text-primary-green hover:border-vibrant-green hover:text-vibrant-green bg-transparent"
            >
              <a href="/learn">Learn More</a>
            </Button>
          </div>
        </div>

        {/* Right Column: 3D Animation Canvas */}
        <div className="h-full w-full min-h-[400px] md:min-h-0 cursor-grab active:cursor-grabbing">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            {/* Lighting for the scene to make the model visible and look good */}
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={200} color="#00ff55" />
            <pointLight position={[-10, -10, -10]} intensity={100} color="#ffffff" />
            
            <Suspense fallback={null}>
              <ModelViewer />
            </Suspense>
            
            {/* Controls allow users to rotate and zoom with their mouse */}
            <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.8} />
          </Canvas>
        </div>
        
      </div>
    </section>
  )
}
