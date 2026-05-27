export type ColorTheme = {
  bg: string;
  surface: string;
  accent: string;
  accentSoft: string;
  text: string;
  muted: string;
  line: string;
};

export type SiteContent = {
  brand: { name: string; tagline: string; logoUrl: string | null };
  theme: ColorTheme & { serif: string; sans: string };
  footer: { note: string; copyright: string };
};
