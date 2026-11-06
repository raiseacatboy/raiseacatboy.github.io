import type { ThemeConfig, ThemePresetName } from "./types";

export const themes: Record<string, ThemeConfig> = {
  "obsidian-red": {
    name: "obsidian-red" as ThemePresetName,
    label: "Site Theme",
    description: "Selected site theme",
    tokens: {
  "background": "40 40% 94%",
  "foreground": "0 0% 7%",
  "card": "40 40% 90%",
  "card-foreground": "0 0% 7%",
  "primary": "32 46% 42%",
  "primary-foreground": "0 0% 0%",
  "secondary": "40 40% 87%",
  "muted": "40 40% 89%",
  "muted-foreground": "0 0% 7%",
  "border": "40 40% 78%",
  "radius": ".75rem",
  "card-shadow": "0 18px 50px rgba(20, 20, 30, .1)",
  "hero-gradient": "radial-gradient(circle at 78% 14%, hsl(32 46% 42% / .2), transparent 36%)",
  "background-pattern": "linear-gradient(hsl(0 0% 7% / .04) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 7% / .04) 1px, transparent 1px)",
  "font-sans": "\"Source Sans 3\", ui-sans-serif, system-ui, sans-serif",
  "font-heading": "\"Source Serif 4\", Georgia, Cambria, serif",
  "heading-weight": "600",
  "heading-letter-spacing": "-0.02em"
},
  },
};
