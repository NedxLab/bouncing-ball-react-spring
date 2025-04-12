import React, { useEffect, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'

const GROUND = 400 // Y position of the ground
const GRAVITY = 0.98 // Gravity acceleration
const DAMPING = 0.95 // Energy loss factor

export default function RealisticBouncingBall() {
  const velocity = useRef(0)
  const position = useRef(0)
  const animationFrame = useRef<number | null>(null)
  const isBouncing = useRef(true)

  const [{ y }, api] = useSpring(() => ({
    y: 0,
    config: { duration: 0 }, // No interpolation delay, we control timing
  }))

  useEffect(() => {
    const update = () => {
      if (!isBouncing.current) return

      velocity.current += GRAVITY
      position.current += velocity.current

      // Bounce
      if (position.current >= GROUND) {
        position.current = GROUND
        velocity.current = -velocity.current * DAMPING

        // Stop bouncing if velocity too low
        if (Math.abs(velocity.current) < 1) {
          isBouncing.current = false
          position.current = GROUND
          velocity.current = 0
        }
      }

      // Animate to new position
      api.set({ y: position.current })

      animationFrame.current = requestAnimationFrame(update)
    }

    animationFrame.current = requestAnimationFrame(update)

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
    }
  }, [api])

  return (
    <div
      style={{
        position: 'relative',
        height: GROUND + 50,
        background: '#f0f0f0',
        border: '1px solid #ccc',
      }}>
      <animated.div
        style={{
          position: 'absolute',
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: 'hotpink',
          transform: 'translateX(-50%)',
          left: '50%',
          y,
        }}
      />
    </div>
  )
}
