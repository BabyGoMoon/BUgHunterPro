"use client"

import { Suspense, useRef } from "react"
import { Canvas } from "@react-three-fiber/fiber"
import { useGLTF, Environment, OrbitControls, Bounds } from "@react-three/drei"
import { motion } from "framer-motion-3d"
import { useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"

// This component loads and displays your 3D model
function ModelViewer() {
  const { scene } = useGLTF("/models/hero-model.glb")
  return <primitive object={scene} />
}

// Preload the model for faster loading times
useGLTF.preload("/models/hero-model.glb")


// This component contains the 3D scene and the scroll animation logic
function Scene() {
  const sceneRef = useRef(null)
  
  // Use Framer Motion's useScroll to track scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"], // Track from when bottom of viewport hits top of section, to when top of viewport hits bottom of section
  })

  // Create transformed values based on scroll progress
  // Model moves up as user scrolls down
  const y = useTransform(scrollYProgress, [0, 1], [0, 2.5])
  // Model scales down slightly as user scrolls down
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.7])
  // Model fades out as it moves out of view
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0])

  return (
    <motion.group ref={sceneRef} position-y={y} scale={scale} opacity={opacity}>
      {/* Bounds will auto-center and scale your model to fit the view */}
      <Bounds fit clip observe margin={1.2}>
        <ModelViewer />
      </Bounds>
    </motion.group>
  )
}


export default function MrCriminalHero() {
  return (
    <section id="hero" className="relative w-full overflow-hidden bg-[#050807] text-white">
      {/* Background is fixed and will not interfere with scrolling */}
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
            {/* Improved lighting */}
            <ambientLight intensity={0.5} />
            <Environment preset="city" />
            
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
            
            {/* OrbitControls allow users to interact with the model */}
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
        </div>
      </div>
    </section>
  )
}
