import { useEffect, useRef, useState } from "react"

/**
 * A hook that provides keyboard shortcuts for search functionality.
 * Supported shortcuts:
 * - CMD+K (Mac) or CTRL+K (Windows/Linux) to focus
 * - '/' to focus (when not inside an input)
 * - 'Esc' to blur
 * 
 * @returns {Object} An object containing:
 * - inputRef: A ref to be attached to the input element
 * - isMac: A boolean indicating if the user is on a Mac (useful for UI indicators)
 */
export function useSearchShortcut() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isMac, setIsMac] = useState(true)

  useEffect(() => {
    // Detect OS for shortcut indicator
    if (typeof navigator !== "undefined") {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform))
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+K on Mac, CTRL+K on others
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }

      // '/' shortcut (only if not already in an input)
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault()
        inputRef.current?.focus()
      }

      // 'Esc' to blur
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return { inputRef, isMac }
}
