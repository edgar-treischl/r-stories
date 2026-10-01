import type { Story } from "./types"

const modules = import.meta.glob("./**/story.ts", {
  eager: true,
  import: "default",
}) as Record<string, Story>

export const stories = Object.values(modules)
