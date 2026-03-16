"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const EASE = [0.16, 1, 0.3, 1] // expo out — Vercel's signature easing

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
}

/** Fades + slides up when scrolled into view */
export function FadeIn({ children, className, delay = 0, duration = 0.7, y = 24 }: FadeInProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  initialDelay?: number
}

/** Stagger-animates direct children into view */
export function Stagger({ children, className, staggerDelay = 0.08, initialDelay = 0 }: StaggerProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: staggerDelay, delayChildren: initialDelay } },
      }}
    >
      {children}
    </motion.div>
  )
}

/** Item used as direct child of <Stagger> */
export function StaggerItem({ children, className, y = 24 }: { children: React.ReactNode; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}

/** Nav slide-down on initial page load (not scroll-triggered) */
export function NavReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
