"use client"

import { useEffect, useState } from "react"

const WORDS = ["Skin conditioning", "Skin barrier support", "Skin Anti-aging"]

const CyclingWords = () => {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      // fade out, swap word, fade back in
      setVisible(false)
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length)
        setVisible(true)
      }, 350)
      return () => clearTimeout(swap)
    }, 2400)

    return () => clearInterval(interval)
  }, [])

  return (
    <span className="relative inline-block">
      {/* invisible sizer keeps layout stable as the word changes */}
      <span aria-hidden className="invisible whitespace-nowrap font-serif italic">
        Skin barrier support
      </span>
      <span
        className={`absolute inset-0 flex justify-center whitespace-nowrap font-serif italic text-clay transition-all duration-300 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        }`}
      >
        {WORDS[index]}
      </span>
    </span>
  )
}

export default CyclingWords
