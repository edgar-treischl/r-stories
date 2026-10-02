library(dplyr)
library(tidyr)
library(ggplot2)
library(scales)


waffle_data <- tibble::tribble(
  ~SART,                    ~ANT,
  "Grundschule",            0.31,
  "Gymnasium",              0.27,
  "Realschule",             0.16,
  "Hauptschule",            0.08,
  "Gesamtschule",           0.12,
  "Sonstige",               0.06
)


waffle_colors <- c(
  "Grundschule"  = "#1b9e77",
  "Gymnasium"    = "#d95f02",
  "Realschule"   = "#7570b3",
  "Hauptschule"  = "#e7298a",
  "Gesamtschule" = "#66a61e",
  "Sonstige"     = "#e6ab02"
)


# Prepare 100-tile waffle data

waffle_dat <-
  waffle_data |>
  arrange(desc(ANT)) |>
  mutate(
    SART = factor(SART, levels = SART),
    exact = ANT * 100,
    tiles = floor(exact),
    remainder = exact - tiles
  )

# Allocate remaining tiles using largest remainder method

missing_tiles <- 100 - sum(waffle_dat$tiles)

if (missing_tiles > 0) {
  waffle_dat <-
    waffle_dat |>
    mutate(
      extra = row_number() %in%
        order(-remainder)[seq_len(missing_tiles)],
      tiles = tiles + extra
    )
} else {
  waffle_dat <- waffle_dat |> mutate(extra = FALSE)
}


# Create 10 × 10 grid

waffle_grid <-
  waffle_dat |>
  select(SART, tiles) |>
  uncount(tiles) |>
  mutate(
    id = row_number(),
    x = (id - 1) %% 10 + 1,
    y = (id - 1) %/% 10 + 1
  )


# Legend labels

legend_labels <-
  waffle_dat |>
  transmute(
    SART,
    label = paste0(
      SART,
      " (",
      percent(ANT, accuracy = 0.1),
      ")"
    )
  ) |>
  tibble::deframe()

ggplot(waffle_grid, aes(x, y, fill = SART)) +
  geom_tile(
    colour = "white",
    linewidth = 0.4
  ) +
  scale_fill_manual(
    values = waffle_colors,
    labels = legend_labels,
    name = NULL
  ) +
  coord_equal() +
  scale_y_reverse() +
  scale_x_continuous(expand = c(0, 0)) +
  scale_y_continuous(expand = c(0, 0)) +
  labs(
    title = "Students by school type",
    subtitle = "Each square represents 1%",
    caption = "Source: Your data"
  ) +
  theme_void(base_size = 12) +
  theme(
    legend.position = "bottom"
  )


ggplot2::ggsave(
  filename = "src/stories/plots/waffle/01_waffle.png",
  width = 1600,
  height = 1000,
  units = "px",
  dpi = 150
)
