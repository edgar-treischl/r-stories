import type { Story } from "../../types"

const story: Story = {
  id: "plots/scatter",
  title: "Scatter Plot",
  category: "Plots",
  description: "Different ways to create a scatter plot with ggplot2.",

  variants: [
    {
      id: "basic",
      title: "Basic",
      description: "A simple scatter plot.",
      code: `library(ggplot2)

ggplot(mtcars, aes(wt, mpg)) +
  geom_point()`,

      image: new URL("./plot.png", import.meta.url).href,
    },

    {
      id: "colored",
      title: "Colored",
      description: "Color points by cylinder count.",
      code: `library(ggplot2)

ggplot(mtcars, aes(wt, mpg, color = factor(cyl))) +
  geom_point()`,

      image: new URL("./plot.png", import.meta.url).href,
    },

    {
      id: "faceted",
      title: "Faceted",
      description: "Split the plot by cylinder count.",
      code: `library(ggplot2)

ggplot(mtcars, aes(wt, mpg)) +
  geom_point() +
  facet_wrap(~cyl)`,

      image: new URL("./plot.png", import.meta.url).href,
    },
  ],
}

export default story
