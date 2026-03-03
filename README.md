# Unfurl---UI-only-Version


# 🌸 Unfurl
### A productivity app that grows with you.

**[View Demo →](https://tidy-piano-74202192.figma.site)**
> Demo showcases UI only — AI agent layer not included in prototype.

---

## What is Unfurl?

Unfurl is a productivity app designed to make task management feel calm and rewarding. Instead of cold to-do lists, your progress is visualised as a growing bouquet — every task you complete adds a flower to your vase.

The app uses AI to prioritise your tasks based on urgency, importance, and your own patterns, so you always know what to work on next without the overwhelm.

---

## What can you do in Unfurl?

- **Add tasks** — drop in anything on your mind, Unfurl handles the sorting
- **AI task prioritisation** — the app analyses your tasks and surfaces what matters most right now
- **Grow your bouquet** — completing a task adds a pixel-art flower to your in-app vase
- **Watch your vase fill up** — flowers are arranged inside a pixel-art glass vase, with stems visible above the rim and blooms layered at different positions
- **Focus mode** — a distraction-free view for when you're heads-down; the app's helper character hides so nothing pulls your attention
- **Dashboard** — overview of your tasks, bouquet progress, and a friendly pixel sprout mascot (PixelSprout) that lives at the bottom-left corner of the screen
- **PixelSprout helper** — hover or tap the little green sprout at the edge of the screen for a nudge; it stays out of your way while you're focusing

---

## Design

Unfurl was designed in **Figma** and made functional using **Figma Make**, with extensive AI prompting to match the original design specifications.

The aesthetic is **cottagecore tech** — pixel art, soft colours, and playful interactions that feel intentional rather than distracting.

Key design decisions:
- Pixel-art vase with a 3-layer z-index stack (rim behind → flowers middle → vase body in front) so stems naturally disappear behind the glass
- Flower placement algorithm using a golden angle with strict boundary clamping so every bloom stays inside the vase opening
- Speech bubbles and UI text use VT323, a monospace pixel font
- Focus page suppresses all ambient UI elements to keep the experience clean

---

## Status

| Layer | Status |
|---|---|
| UI / UX Design | ✅ Complete |
| Figma Make Prototype | ✅ Live |
| AI Agent Integration | 🔨 In progress |

---

## Built with

- Figma
- Figma Make
- AI prompting (design-to-functional prototype)

---

## Author

**Uchenna Ibeziako** — UI/UX Design Lead  
[LinkedIn](#) · [Email](mailto:ucibeziako@gmail.com)
