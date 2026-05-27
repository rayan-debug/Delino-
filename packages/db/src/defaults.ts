// Default content used to seed the database. Mirrors the Luxora design from the brief.

export const DEFAULT_SITE = {
  brandName: 'LUXORA',
  brandTagline: 'CREATIVE STUDIO',
  brandLogoUrl: null as string | null,
  themeBg: '#0a0a0a',
  themeSurface: '#141414',
  themeAccent: '#c9a86a',
  themeAccentSoft: '#d9bf85',
  themeText: '#f5f1ea',
  themeMuted: '#9a958e',
  themeLine: 'rgba(245, 241, 234, 0.12)',
  fontSerif: 'Playfair Display',
  fontSans: 'Inter',
  footerNote: 'A creative studio for luxury hospitality. Paris · Milan · Dubai.',
  footerCopyright: '© Luxora Creative Studio',
};

export const DEFAULT_HERO = {
  eyebrow: 'WE CREATE. YOU INSPIRE.',
  headlineLines: ['Digital Experiences.', 'Iconic Stories.', 'Timeless Hospitality.'],
  description:
    "A creative studio combining Web Development, Graphic Design, Media Management, and F&B Video Photo Production for the world's most luxurious hotels.",
  image:
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=2200&q=85&auto=format&fit=crop',
  trustBadge: 'TRUSTED BY LUXURY BRANDS WORLDWIDE',
  primaryCta: 'View Our Work',
  secondaryCta: 'Play Showreel',
};

export const DEFAULT_SERVICES = [
  {
    icon: 'monitor',
    title: 'Web Development',
    description:
      'Bespoke, responsive websites designed to reflect luxury, performance, and seamless user experience.',
    order: 1,
  },
  {
    icon: 'pen',
    title: 'Graphic Design',
    description:
      'Elegant branding and visual design that communicate exclusivity and elevate your identity.',
    order: 2,
  },
  {
    icon: 'play',
    title: 'Media Management',
    description:
      'Strategic content management across platforms to engage, inspire, and build lasting connections.',
    order: 3,
  },
  {
    icon: 'camera',
    title: 'F&B Video Photo Production',
    description:
      'Cinematic photo and video production that brings your culinary experiences to life.',
    order: 4,
  },
];

export const DEFAULT_PROJECTS = [
  {
    slug: 'grand-luxe-resort',
    title: 'Grand Luxe Resort',
    category: 'Website Development',
    description:
      'A bespoke digital flagship for a Mediterranean cliffside retreat — booking, journal, and immersive gallery.',
    year: '2025',
    client: 'Grand Luxe Group',
    image:
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&q=85&auto=format&fit=crop',
    tags: ['Web', 'Booking', 'CMS'],
    featured: true,
    order: 1,
  },
  {
    slug: 'azure-palace-hotel',
    title: 'Azure Palace Hotel',
    category: 'Branding & Graphic Design',
    description:
      'Identity, stationery, and signage for a heritage palace property — a refined system of marks and monograms.',
    year: '2024',
    client: 'Azure Palace',
    image:
      'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=1600&q=85&auto=format&fit=crop',
    tags: ['Identity', 'Print', 'Signage'],
    featured: true,
    order: 2,
  },
  {
    slug: 'celestial-hotel-group',
    title: 'Celestial Hotel Group',
    category: 'Media Management',
    description:
      'An always-on content engine across five flagship properties, blending editorial and lifestyle storytelling.',
    year: '2025',
    client: 'Celestial',
    image:
      'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=1600&q=85&auto=format&fit=crop',
    tags: ['Social', 'Content', 'Strategy'],
    featured: true,
    order: 3,
  },
  {
    slug: 'epicure-by-the-sea',
    title: 'Epicure by the Sea',
    category: 'F&B Photo & Video Production',
    description:
      'A cinematic campaign celebrating coastal gastronomy — slow food, golden light, and quiet rituals.',
    year: '2024',
    client: 'Epicure Collection',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=85&auto=format&fit=crop',
    tags: ['Video', 'Photo', 'F&B'],
    featured: true,
    order: 4,
  },
  {
    slug: 'luxora-hospitality',
    title: 'Luxora Hospitality',
    category: 'Full Creative Solution',
    description:
      'End-to-end identity, digital, and content systems for a new wave luxury hospitality brand.',
    year: '2025',
    client: 'Luxora Group',
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=85&auto=format&fit=crop',
    tags: ['Identity', 'Web', 'Content'],
    featured: true,
    order: 5,
  },
  {
    slug: 'maison-du-soleil',
    title: 'Maison du Soleil',
    category: 'Website Development',
    description:
      'A villa rental platform with motion-rich storytelling, multilingual support, and concierge integration.',
    year: '2024',
    client: 'Maison du Soleil',
    image:
      'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=1600&q=85&auto=format&fit=crop',
    tags: ['Web', 'Multilingual', 'CMS'],
    featured: false,
    order: 6,
  },
];

export const DEFAULT_ABOUT = {
  eyebrow: 'OUR PHILOSOPHY',
  headline: 'A studio built on craft, restraint, and quiet luxury.',
  body:
    'We are a multidisciplinary creative studio working exclusively with luxury hospitality brands. From identity to digital, from still life to motion, we craft considered work that honors heritage and embraces what is next. Every project begins with listening — and ends with something that feels inevitable.',
  image:
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1600&q=85&auto=format&fit=crop',
  stats: [
    { label: 'Properties served', value: '120+', order: 1 },
    { label: 'Countries', value: '28', order: 2 },
    { label: 'Awards', value: '47', order: 3 },
    { label: 'Years of craft', value: '12', order: 4 },
  ],
  values: [
    { title: 'Restraint', text: 'We say less, with care. Negative space is a discipline.', order: 1 },
    { title: 'Craft', text: 'Every pixel, every frame, every word — built with intention.', order: 2 },
    { title: 'Partnership', text: 'We embed with our clients. We protect their brand like our own.', order: 3 },
    { title: 'Timelessness', text: 'We design for the next decade, not the next trend.', order: 4 },
  ],
};

export const DEFAULT_CONTACT = {
  headline: 'Let us create something timeless.',
  email: 'studio@luxora.com',
  phone: '+33 1 84 88 22 14',
  address: '14 rue Saint-Honoré, 75001 Paris',
  studios: [
    { city: 'Paris', address: '14 rue Saint-Honoré', order: 1 },
    { city: 'Milan', address: 'Via Montenapoleone 8', order: 2 },
    { city: 'Dubai', address: 'DIFC Gate Village 4', order: 3 },
  ],
  socials: [
    { label: 'Instagram', href: '#', order: 1 },
    { label: 'Behance', href: '#', order: 2 },
    { label: 'LinkedIn', href: '#', order: 3 },
    { label: 'Vimeo', href: '#', order: 4 },
  ],
};

export const FONT_OPTIONS: Record<string, string> = {
  'Playfair Display': "'Playfair Display', serif",
  'Cormorant Garamond': "'Cormorant Garamond', serif",
  Cinzel: "'Cinzel', serif",
  Italiana: "'Italiana', serif",
  Marcellus: "'Marcellus', serif",
  Inter: "'Inter', system-ui, sans-serif",
};

export const ICON_OPTIONS = [
  'monitor',
  'pen',
  'play',
  'camera',
  'sparkles',
  'compass',
  'layers',
  'briefcase',
];
