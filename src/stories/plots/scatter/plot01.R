library(ggplot2)
library(palmerpenguins)

ggplot(penguins, aes(x = bill_length_mm, y = bill_depth_mm)) +
  geom_point()


library(ggplot2)
library(palmerpenguins)

ggplot(penguins, aes(bill_length_mm, bill_depth_mm, color = species)) +
  geom_point(size = 2.5, alpha = 0.7) +
  geom_smooth(method = "lm", se = FALSE, linewidth = 1) +
  scale_color_manual(values = c(
    "Adelie" = "#E69F00",
    "Chinstrap" = "#56B4E9",
    "Gentoo" = "#009E73"
  )) +
  labs(
    x = "Bill length (mm)",
    y = "Bill depth (mm)",
    color = "Species"
  ) +
  theme_minimal(base_size = 13) +
  theme(
    legend.position = "top",
    panel.grid.minor = element_blank()
  )
