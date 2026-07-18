export type FontLink = {
  rel: 'preconnect' | 'preload' | 'stylesheet';
  href: string;
  as?: 'font' | 'style';
  crossorigin?: 'anonymous' | 'use-credentials';
  type?: string;
};

export type FontFaceSource =
  | string
  | {
      url: string;
      format?: string;
    };

export type FontFace = {
  family: string;
  source: FontFaceSource | FontFaceSource[];
  weight?: string;
  style?: string;
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  unicodeRange?: string;
};

export type FontStack = {
  body: string[];
  ui?: string[];
  heading?: string[];
  article?: string[];
};

export type FontConfig = {
  defaultLanguage: string;
  links: FontLink[];
  fontFaces: FontFace[];
  stacks: Record<string, FontStack>;
};

const titilliumStack = ['Titillium Web', 'Helvetica Neue', 'Helvetica', 'sans-serif'];

export const fonts: FontConfig = {
  defaultLanguage: site.language,
  links: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;600;700;900&display=swap',
    },
  ],
  fontFaces: [],
  stacks: {
    en: {
      body: titilliumStack,
      ui: titilliumStack,
      heading: titilliumStack,
      article: titilliumStack,
    },
  },
};
import { site } from './site';
