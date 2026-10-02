---
id: plots/barplot
title: Bar Plot
category: Plots
description: Different ways to create a bar plot with ggplot2.
---

## Basic

A simple bar plot.

```r
library(ggplot2)

ggplot(mtcars, aes(wt, mpg)) +
  geom_point()
```

![](barplot.png)

## Colored

Color points by cylinder count.

```r
library(ggplot2)

ggplot(mtcars, aes(wt, mpg, color = factor(cyl))) +
  geom_point()
```

![](./barplot.png)

## Faceted

Split the plot by cylinder count.

```r
library(ggplot2)

ggplot(mtcars, aes(wt, mpg)) +
  geom_point() +
  facet_wrap(~cyl)
```

![](./barplot.png)
