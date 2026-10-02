import type { Story } from "./types"
import { parseMarkdownStory } from "./parseMarkdownStory"

// Load markdown files using new Vite glob syntax
const markdownModules = import.meta.glob("./**/story.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>

// Load all story images eagerly as URLs. Vite can only statically resolve
// `new URL(..., import.meta.url)` for string literals, so a glob map is
// required to look up images by their dynamic relative path.
const imageModules = import.meta.glob(
  "./**/*.{png,jpg,jpeg,gif,svg}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>

export const stories = Object.entries(markdownModules)
  .map(([path, content]) => {
    // Extract base directory from path (e.g., "./plots/scatter/story.md" -> "plots/scatter")
    const basePath = path.replace(/\/story\.md$/, "")

    // Resolve an image name relative to this story's directory
    const imagePath = (imageName: string) => {
      const key = `${basePath}/${imageName}`
      const url = imageModules[key]

      if (!url) {
        console.warn(`Story image not found: ${key}`)
        return ""
      }

      return url
    }

    return parseMarkdownStory(content, imagePath)
  })
  .filter((story) => story !== null) as Story[]
