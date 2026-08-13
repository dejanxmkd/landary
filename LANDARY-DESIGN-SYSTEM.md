# Landary Design System

Landary uses a warm, confident visual language built around a cream canvas, coffee-dark typography, and a single orange conversion accent.

## Core colors

- Primary: `#ff4f00`
- On primary: `#fffefb`
- Ink: `#201515`
- Ink soft: `#2f2a26`
- Body: `#605d52`
- Body mid: `#939084`
- Mute: `#c5c0b1`
- Canvas: `#fffefb`
- Canvas soft: `#f8f4f0`

## Typography

Use Inter as the current system font. Display headlines use medium weight and sentence case. Body, buttons, labels, and utility text use Inter with clear role separation.

## Shape

- Small radius: 6px
- Standard card/button radius: 12px
- Pills only for metadata/status tags

## Spacing

Base unit: 4px.

- 4px
- 8px
- 12px
- 16px
- 24px
- 32px
- 48px
- 64px

## Rules

- Warm cream, never pure white as the default canvas.
- Coffee ink, never pure black as the default text color.
- Orange is the single chromatic accent.
- Primary CTA uses orange.
- Secondary CTA uses coffee ink.
- Cards and buttons use 12px radius.
- Avoid unnecessary shadows; prefer surface contrast and hairline borders.
- Keep motion subtle and functional.
- No CSS overrides, no `!important`, no arbitrary one-off fixes.
- New variants must reuse tokens. If a variation needs many exceptions, create a new pattern instead.

## Landary components

The same system applies across the Library, section pattern pages, configurator, page builder, previews, and generated landing pages.