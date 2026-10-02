import type { Story, StoryVariant } from "./types"

interface MarkdownFrontmatter {
  id: string
  title: string
  category: string
  description?: string
}

/**
 * Parses a markdown story file with frontmatter and variant sections.
 * 
 * Format:
 * ```
 * ---
 * id: plots/scatter
 * title: Scatter Plot
 * category: Plots
 * description: Optional description
 * ---
 * 
 * ## Basic
 * 
 * Optional variant description here.
 * 
 * ```r
 * library(ggplot2)
 * ggplot(mtcars, aes(wt, mpg)) +
 *   geom_point()
 * ```
 * 
 * ![](./scatter-basic.png)
 * 
 * ## Colored
 * 
 * ...
 * ```
 */
export function parseMarkdownStory(
  content: string,
  imagePath: (imageName: string) => string,
): Story | null {
  // Extract frontmatter
  const frontmatterMatch = content.match(
    /^---\n([\s\S]*?)\n---\n([\s\S]*)$/,
  )

  if (!frontmatterMatch) {
    console.warn("Story markdown missing frontmatter")
    return null
  }

  const frontmatterText = frontmatterMatch[1]
  const bodyText = frontmatterMatch[2]

  // Parse YAML-like frontmatter
  const frontmatter = parseFrontmatter(frontmatterText)

  if (
    !frontmatter.id ||
    !frontmatter.title ||
    !frontmatter.category
  ) {
    console.warn(
      "Story frontmatter missing required fields: id, title, category",
    )
    return null
  }

  // Extract variants from h2 sections
  const variants: StoryVariant[] = []
  const variantSections = bodyText.split(/\n## /);
  
  // First section might be intro text, skip it
  const startIdx = bodyText.startsWith("## ") ? 0 : 1

  for (let i = startIdx; i < variantSections.length; i++) {
    const section = variantSections[i]
    const variant = parseVariantSection(section, imagePath)
    if (variant) {
      variants.push(variant)
    }
  }

  if (variants.length === 0) {
    console.warn(
      `Story "${frontmatter.id}" has no variants with code blocks`,
    )
    return null
  }

  return {
    id: frontmatter.id,
    title: frontmatter.title,
    category: frontmatter.category,
    description: frontmatter.description,
    variants,
  }
}

function parseFrontmatter(text: string): Partial<MarkdownFrontmatter> {
  const result: Partial<MarkdownFrontmatter> = {}

  const lines = text.split("\n")
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/)
    if (match) {
      const [, key, value] = match
      result[key as keyof MarkdownFrontmatter] = value.trim()
    }
  }

  return result
}

function parseVariantSection(
  section: string,
  imagePath: (imageName: string) => string,
): StoryVariant | null {
  // Extract title (first line, removing ## if present)
  const lines = section.split("\n")
  const titleLine = lines[0].replace(/^#+\s*/, "")

  if (!titleLine) {
    return null
  }

  // Extract description (lines before code block)
  const descriptionLines: string[] = []
  let codeBlockStart = -1

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].startsWith("```")) {
      codeBlockStart = i
      break
    }
    if (lines[i].trim()) {
      descriptionLines.push(lines[i])
    }
  }

  if (codeBlockStart === -1) {
    return null // No code block found
  }

  // Extract code block
  let codeBlockEnd = -1

  for (let i = codeBlockStart + 1; i < lines.length; i++) {
    if (lines[i].startsWith("```")) {
      codeBlockEnd = i
      break
    }
  }

  if (codeBlockEnd === -1) {
    return null // Unclosed code block
  }

  const codeLines = lines.slice(codeBlockStart + 1, codeBlockEnd)
  const code = codeLines.join("\n").trim()

  // Extract image reference
  let imageUrl = ""
  for (let i = codeBlockEnd + 1; i < lines.length; i++) {
    const imgMatch = lines[i].match(/!\[\]\((.+?)\)/)
    if (imgMatch) {
      const imageName = imgMatch[1].replace(/^\.\//, "") // Strip leading ./
      imageUrl = imagePath(imageName)
      break
    }
  }

  if (!imageUrl) {
    return null // No image found
  }

  return {
    id: titleLine.toLowerCase().replace(/\s+/g, "-"),
    title: titleLine,
    description: descriptionLines.length > 0 
      ? descriptionLines.join("\n").trim()
      : undefined,
    code,
    image: imageUrl,
  }
}
