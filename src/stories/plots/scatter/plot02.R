library(ggplot2)
library(palmerpenguins)

ggplot(penguins, aes(bill_length_mm, bill_depth_mm, color = species)) +
  geom_point()


ggplot2::ggsave(
  filename = "src/stories/plots/scatter/plot02.png",
  width = 1600,
  height = 1000,
  units = "px",
  dpi = 150
)
