library(ggplot2)
library(palmerpenguins)

plot <- ggplot2::ggplot(
  palmerpenguins::penguins,
  ggplot2::aes(x = species)
) +
  ggplot2::geom_bar()

ggplot2::ggsave(
  filename = "src/stories/plots/bar/barplot.png",
  plot = plot,
  width = 1600,
  height = 1000,
  units = "px",
  dpi = 150
)
