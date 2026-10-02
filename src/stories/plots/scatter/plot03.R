library(ggplot2)
library(palmerpenguins)

ggplot(penguins, aes(bill_length_mm, bill_depth_mm)) +
  geom_point() +
  facet_wrap(~species)


ggplot2::ggsave(
  filename = "src/stories/plots/scatter/plot03.png",
  width = 1600,
  height = 1000,
  units = "px",
  dpi = 150
)
