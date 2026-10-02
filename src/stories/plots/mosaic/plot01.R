library(ggplot2)
library(ggmosaic2)

# Built-in Titanic data
titanic_df <- as.data.frame(Titanic)

plot_df <- aggregate(
  Freq ~ Sex + Survived,
  data = titanic_df,
  FUN = sum
)

ggplot(plot_df) +
  geom_mosaic(
    aes(
      x = product(Sex),
      fill = Survived,
      weight = Freq
    )
  ) +
  scale_fill_manual(
    values = c(
      "No" = "#08519c",
      "Yes" = "#6baed6"
    )
  ) +
  labs(
    x = "Sex",
    y = "Proportion",
    fill = "Survival",
    title = "Survival by Sex on the Titanic"
  ) +
  theme_minimal()

