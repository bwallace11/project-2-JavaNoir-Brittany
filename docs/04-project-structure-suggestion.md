# Suggested Project Structure

Use this structure unless your instructor approves a different organization.

```text
lost-in-the-scroll/
├── index.html
├── reflection.html (optional — reflection content can live in README.md)
├── styles/
│   ├── tokens.css
│   ├── styles.css
│   └── animations.css (if needed)
├── scripts/
│   └── main.js
├── assets/
│   ├── svg/
│   └── images/
└── README.md
```

## Notes

- Required reflection content (metaphor summary, proudest section, bug solved, accessibility decision, what to improve) belongs in **README.md**. A separate `reflection.html` page is optional.
- Load `tokens.css` before other style files.
- Keep all GSAP + ScrollTrigger + ScrollSmoother logic in `scripts/main.js`.
- Keep asset file names clean and predictable (`chapter-01.svg`, `hero-bg.webp`, etc.).
