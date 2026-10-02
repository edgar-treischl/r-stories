---
id: plots/scatter
title: Scatter Plot
category: Plots
description: Different ways to create a scatter plot with ggplot2.
---

## Basic

A simple scatter plot.

```r
library(ggplot2)

ggplot(mtcars, aes(wt, mpg)) +
  geom_point()
```

![](plot.png)

## Colored

Color points by cylinder count.

```r
library(ggplot2)

ggplot(mtcars, aes(wt, mpg, color = factor(cyl))) +
  geom_point()
```

![](./plot.png)

## Faceted

Split the plot by cylinder count.

```r
library(ggplot2)

ggplot(mtcars, aes(wt, mpg)) +
  geom_point() +
  facet_wrap(~cyl)
```

![](./plot.png)
