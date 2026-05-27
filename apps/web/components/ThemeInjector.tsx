import { FONT_FAMILIES } from '@/lib/fonts';

type SiteLike = {
  themeBg: string;
  themeSurface: string;
  themeAccent: string;
  themeAccentSoft: string;
  themeText: string;
  themeMuted: string;
  themeLine: string;
  fontSerif: string;
  fontSans: string;
};

export default function ThemeInjector({ site }: { site: SiteLike }) {
  const css = `:root {
    --c-bg: ${site.themeBg};
    --c-surface: ${site.themeSurface};
    --c-accent: ${site.themeAccent};
    --c-accent-soft: ${site.themeAccentSoft};
    --c-text: ${site.themeText};
    --c-muted: ${site.themeMuted};
    --c-line: ${site.themeLine};
    --font-serif: ${FONT_FAMILIES[site.fontSerif] ?? FONT_FAMILIES['Playfair Display']};
    --font-sans: ${FONT_FAMILIES[site.fontSans] ?? FONT_FAMILIES['Inter']};
  }`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
