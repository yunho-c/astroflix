---
title: Recommendation rails without tracking
subtitle: Related content can be useful even when it is transparent, local, and deterministic.
description: Simple tag and category scoring can power helpful recommendation rails while keeping the static site private by default.
pubDate: 2026-02-18
author: maya-chen
category: Discovery
tags:
  - recommendations
  - privacy
  - metadata
image:
  url: https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=80
  alt: Abstract architectural facade with geometric shapes
featured: false
---

Recommendation systems do not have to start with user profiles. For many editorial sites, the useful version is deterministic: same category, overlapping tags, recent enough to feel current.

That approach has two advantages. It is easy to explain, and it works at build time. No hidden behavior is required to say, "If you liked this topic, here are three nearby stories."

## Score what editors control

Tags and categories are editorial tools. When recommendations use them directly, the team can shape the experience by improving metadata instead of tuning opaque rules.

## Keep rails readable

Recommendation cards should be smaller than primary cards but not throwaway. A reader finishing an article is in a calmer mode, so the rail should offer confident next steps without shouting.
