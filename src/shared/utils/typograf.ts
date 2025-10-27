import Typograf from 'typograf';

// Typographer for plain text (no HTML entities)
const tpText = new Typograf({
  locale: ['ru', 'en-US'],
  htmlEntity: { type: 'default' }, // Use default entities that can be easily decoded
});

tpText.enableRule('common/nbsp/*');
tpText.enableRule('common/space/*');
tpText.enableRule('common/punctuation/*');
tpText.enableRule('common/dash/*');
tpText.enableRule('common/symbols/*');

/**
 * Decode HTML entities to actual characters
 */
function decodeHtmlEntities(text: string): string {
  // Check if running in browser environment
  if (typeof document === 'undefined') {
    // In SSR, return text as-is or use a simple decode
    return text.replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–');
  }

  const textarea = document.createElement('textarea');

  textarea.innerHTML = text;

  return textarea.value;
}

// Typographer for HTML content
const tpHTML = new Typograf({
  locale: ['ru', 'en-US'],
  htmlEntity: { type: 'digit' },
});

tpHTML.enableRule('common/nbsp/*');
tpHTML.enableRule('common/space/*');
tpHTML.enableRule('common/punctuation/*');
tpHTML.enableRule('common/dash/*');
tpHTML.enableRule('common/symbols/*');
tpHTML.enableRule('html/escape');

/**
 * Apply typography to plain text content (returns plain text, no HTML entities)
 * @param text - Text to process
 * @returns Typografically improved text
 */
export const applyTypograf = (text: string): string => {
  if (!text) {
    return text;
  }

  // Apply typographer
  const result = tpText.execute(text);

  // Decode HTML entities back to actual characters
  return decodeHtmlEntities(result);
};

/**
 * Apply typography to HTML content (returns HTML with entities)
 * @param html - HTML string to process
 * @returns Typografically improved HTML
 */
export const applyTypografToHTML = (html: string): string => {
  if (!html) {
    return html;
  }

  return tpHTML.execute(html);
};
