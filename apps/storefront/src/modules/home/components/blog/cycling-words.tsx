"use client"

import { useEffect, useState } from "react"

const WORDS = ["Skincare routines", "Ingredient notes", "Anti-aging tips"]

const CyclingWords = () => {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
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
      <span aria-hidden className="invisible whitespace-nowrap font-serif italic">
        Ingredient notes
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
