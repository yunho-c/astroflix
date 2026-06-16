import { fonts, type FontFace, type FontFaceSource, type FontLink, type FontStack } from '../data/fonts';

const genericFontFamilies = new Set([
  'cursive',
  'emoji',
  'fangsong',
  'fantasy',
  'math',
  'monospace',
  'sans-serif',
  'serif',
  'system-ui',
  'ui-monospace',
  'ui-rounded',
  'ui-sans-serif',
  'ui-serif',
]);

export function getFontLinks(): FontLink[] {
  return fonts.links;
}

export function resolveFontLanguage(language = fonts.defaultLanguage) {
  const normalized = normalizeLanguage(language);
  if (fonts.stacks[normalized]) {
    return normalized;
  }

  const baseLanguage = normalized.split('-')[0];
  if (baseLanguage && fonts.stacks[baseLanguage]) {
    return baseLanguage;
  }

  return fonts.defaultLanguage;
}

export function getFontCss() {
  return [
    ...fonts.fontFaces.map(fontFaceToCss),
    stackToCss(':root', fonts.stacks[fonts.defaultLanguage]),
    ...Object.entries(fonts.stacks).map(([language, stack]) =>
      stackToCss(`html[data-font-language="${escapeCssString(language)}"]`, stack),
    ),
  ]
    .filter(Boolean)
    .join('\n\n');
}

function normalizeLanguage(language: string) {
  return language.trim().toLowerCase() || fonts.defaultLanguage;
}

function stackToCss(selector: string, stack: FontStack) {
  const body = fontStackToCss(stack.body);
  const ui = fontStackToCss(stack.ui ?? stack.body);
  const heading = fontStackToCss(stack.heading ?? stack.ui ?? stack.body);
  const article = fontStackToCss(stack.article ?? stack.body);

  return `${selector} {
  --font-body: ${body};
  --font-ui: ${ui};
  --font-heading: ${heading};
  --font-article: ${article};
}`;
}

function fontStackToCss(stack: string[]) {
  return stack.map(fontFamilyToCss).join(', ');
}

function fontFamilyToCss(family: string) {
  if (family.startsWith('var(') || family.startsWith('"') || family.startsWith("'")) {
    return family;
  }

  if (genericFontFamilies.has(family.toLowerCase())) {
    return family;
  }

  return `"${escapeCssString(family)}"`;
}

function fontFaceToCss(fontFace: FontFace) {
  return `@font-face {
  font-family: "${escapeCssString(fontFace.family)}";
  src: ${fontFaceSourcesToCss(fontFace.source)};
  font-display: ${fontFace.display ?? 'swap'};${optionalCssDeclaration('font-weight', fontFace.weight)}${optionalCssDeclaration(
    'font-style',
    fontFace.style,
  )}${optionalCssDeclaration('unicode-range', fontFace.unicodeRange)}
}`;
}

function fontFaceSourcesToCss(source: FontFaceSource | FontFaceSource[]) {
  const sources = Array.isArray(source) ? source : [source];
  return sources.map(fontFaceSourceToCss).join(', ');
}

function fontFaceSourceToCss(source: FontFaceSource) {
  if (typeof source === 'string') {
    return `url("${escapeCssString(source)}")`;
  }

  return [`url("${escapeCssString(source.url)}")`, source.format ? `format("${escapeCssString(source.format)}")` : '']
    .filter(Boolean)
    .join(' ');
}

function optionalCssDeclaration(property: string, value?: string) {
  return value ? `\n  ${property}: ${value};` : '';
}

function escapeCssString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\a ');
}
