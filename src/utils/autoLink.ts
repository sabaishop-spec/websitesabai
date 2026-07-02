export const SEO_KEYWORDS = [
  { term: 'bàn chải kẽ', link: '/products' },
  { term: 'fluocaril', link: '/products' },
  { term: 'sáp nha khoa', link: '/products' },
  { term: 'chăm sóc răng niềng', link: '/products' },
  { term: 'chỉnh nha', link: '/blog' },
  { term: 'nha khoa', link: '/blog' }
];

export function autoLinkKeywords(html: string) {
  if (!html) return html;
  
  // Split HTML into tokens: tags and text nodes
  const tokens = html.split(/(<[^>]+>)/g);
  
  // Sort keywords by length descending so "bàn chải kẽ" matches before "bàn chải"
  const sortedKeywords = [...SEO_KEYWORDS].sort((a, b) => b.term.length - a.term.length);
  
  let inAnchor = false;
  
  const processedTokens = tokens.map(token => {
    // If it's an anchor tag opening
    if (token.match(/^<a\b/i)) {
      inAnchor = true;
      return token;
    }
    // If it's an anchor tag closing
    if (token.match(/^<\/a>/i)) {
      inAnchor = false;
      return token;
    }
    // If it's any other tag, leave it as is
    if (token.startsWith('<') && token.endsWith('>')) {
      return token;
    }
    
    // If we're inside an anchor tag, don't replace
    if (inAnchor) {
      return token;
    }
    
    // It's a text node outside of an anchor. Replace keywords.
    let text = token;
    sortedKeywords.forEach(({ term, link }) => {
      // Create regex for the term, case insensitive, word boundaries
      // Note: \b doesn't always work perfectly with Vietnamese accents, so we use a custom boundary check.
      // JS doesn't support unicode boundaries natively in \b.
      const regex = new RegExp(`(^|\\s|\\p{P})(${term})(\\s|\\p{P}|$)`, 'giu');
      text = text.replace(regex, `$1<a href="${link}" class="text-brand-600 font-medium hover:underline">$2</a>$3`);
    });
    
    return text;
  });
  
  return processedTokens.join('');
}
