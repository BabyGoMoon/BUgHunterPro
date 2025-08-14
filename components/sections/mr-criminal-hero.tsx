"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, Bounds, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"

// This is the new loading indicator component
function ModelLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center text-primary-green">
        <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 font-mono text-sm">Loading Model...</p>
      </div>
    </Html>
  )
}

// This component loads and displays your 3D model
function ModelViewer() {
  const { scene } = useGLTF("/models/hero-model.glb")
  return <primitive object={scene} />
}

// Preload the model for faster loading times
useGLTF.preload("/models/hero-model.glb")


export default function MrCriminalHero() {
  return (
    <section id="hero" className="relative w-full overflow-hidden bg-[#050807] text-white">
      {/* Background is now fixed and will not interfere with scrolling */}
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

      {/* Main content area that allows scrolling */}
      <div className="relative z-10 mx-auto grid min-h-screen grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
        
        {/* Left Column: Text Content */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Hunt Bugs Like a <span className="text-primary-green animate-pulse">Cyber Warrior</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-primary-green/80">
            Discover vulnerabilities with AI-powered scanning, real-time analysis, and gamified learning.
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

        {/* Right Column: 3D Model in a "Box" */}
        <div className="h-[60vh] w-full rounded-2xl border border-primary-green/20 bg-black/20 backdrop-blur-sm p-2">
          <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
            {/* Improved lighting for better model appearance */}
            <ambientLight intensity={0.5} />
            <Environment preset="city" />
            
            {/* Suspense shows the loader while the model is loading */}
            <Suspense fallback={<ModelLoader />}>
              <Bounds fit clip observe margin={1.2}>
                <ModelViewer />
              </Bounds>
            </Suspense>
            
            {/* Controls now have autoRotate enabled */}
            <OrbitControls 
              enableZoom={true} 
              enablePan={false} 
              autoRotate 
              autoRotateSpeed={0.8} 
            />
          </Canvas>
        </div>
        
      </div>
    </section>
  )
}
