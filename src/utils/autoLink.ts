export const SEO_KEYWORDS = [
  // Primary target keywords
  { term: 'kem đánh răng cho người niềng răng', link: '/products' },
  { term: 'kem đánh răng niềng răng', link: '/products' },
  { term: 'kem đánh răng cho người niềng', link: '/products' },
  // Brand keyword
  { term: 'furano', link: '/' },
  // Product keywords
  { term: 'bàn chải kẽ', link: '/products' },
  { term: 'nước súc miệng', link: '/products' },
  { term: 'sáp nha khoa', link: '/products' },
  { term: 'fluocaril', link: '/products' },
  { term: 'kem đánh răng', link: '/products' },
  // Topic keywords
  { term: 'chăm sóc răng niềng', link: '/products' },
  { term: 'răng niềng', link: '/products' },
  { term: 'chỉnh nha', link: '/blog' },
  { term: 'nha khoa', link: '/blog' },
  { term: 'niềng răng', link: '/blog' },
];

export function autoLinkKeywords(html: string) {
  if (!html) return html;
  
  // Split HTML into tokens: tags and text nodes
  const tokens = html.split(/(<[^>]+>)/g);
  
  // Sort keywords by length descending so longer phrases match first
  const sortedKeywords = [...SEO_KEYWORDS].sort((a, b) => b.term.length - a.term.length);
  
  // Track which keywords have already been linked (only link each keyword once per article)
  const linkedTerms = new Set<string>();
  
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
    
    // It's a text node outside of an anchor. Replace keywords (only first occurrence).
    let text = token;
    sortedKeywords.forEach(({ term, link }) => {
      // Skip if we already linked this term
      if (linkedTerms.has(term)) return;
      
      const regex = new RegExp(`(^|\\s|\\p{P})(${term})(\\s|\\p{P}|$)`, 'iu');
      if (regex.test(text)) {
        text = text.replace(regex, `$1<a href="${link}" class="text-brand-600 font-medium hover:underline" title="${term}">$2</a>$3`);
        linkedTerms.add(term);
      }
    });
    
    return text;
  });
  
  return processedTokens.join('');
}
