#!/usr/bin/env node

import { marked } from 'marked';
import { resolve } from 'path';
import { getMermaidInitScript, createWalkTokens, parseArgs, initHighlighter, htmlToPdf as sharedHtmlToPdf, CSS_FONT_SIZES } from './pdf-utils.js';

class MarkdownToPdfConverter {
  constructor(options = {}) {
    this.options = {
      format: 'A4',
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
      displayHeaderFooter: false,
      printBackground: true,
      ...options
    };
    this.highlighter = null;
    this.markedConfigured = false;
  }

  async initHighlighter() {
    if (!this.highlighter) {
      this.highlighter = await initHighlighter();
    }
  }

  async convert(markdownPath, outputPath) {
    const { readFile, writeFile } = await import('fs/promises');
    const matter = (await import('gray-matter')).default;
    
    console.log(`Reading markdown file: ${markdownPath}`);
    const markdownContent = await readFile(resolve(markdownPath), 'utf8');
    console.log(`File size: ${markdownContent.length} characters`);
    
    const { data: frontMatter, content } = matter(markdownContent);
    console.log(`Content size after frontmatter: ${content.length} characters`);
    
    await this.initHighlighter();
    
    const html = await this.generateHtml(content, frontMatter);
    console.log(`Generated HTML size: ${html.length} characters`);
    
    const pdf = await this.htmlToPdf(html);
    console.log(`Generated PDF size: ${pdf.length} bytes`);
    
    await writeFile(resolve(outputPath), pdf);
    return resolve(outputPath);
  }

  async generateHtml(markdown, frontMatter = {}) {
    const highlighter = this.highlighter;
    
    // Configure marked only once to avoid stacking
    if (!this.markedConfigured) {
      const walkTokens = createWalkTokens(highlighter);
      marked.use({ walkTokens, gfm: true, breaks: false });
      this.markedConfigured = true;
    }
    
    const htmlContent = marked.parse(markdown);
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${frontMatter.title || 'Document'}</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    @page {
      size: A4 landscape;
      margin: 0.5in;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #222222;
      margin: 0;
      padding: 0;
      background: white;
      width: 100%;
      overflow-x: hidden;
    }
    
    .container {
      max-width: 100%;
      margin: 0 auto;
      padding: 0;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Inter', sans-serif;
      color: #1a1a1a;
      margin: 1.5em 0 0.5em 0;
      page-break-after: avoid !important;
      break-after: avoid-page !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    h1 { 
      font-size: 20pt; 
      font-weight: 700; 
      margin-top: 0; 
      page-break-before: auto;
    }
    h2 { 
      font-size: 16pt; 
      font-weight: 600; 
      color: #2d3748; 
      page-break-before: auto;
    }
    h3 { 
      font-size: 14pt; 
      font-weight: 600; 
      page-break-before: auto;
    }
    h4 { 
      font-size: 13pt; 
      font-weight: 500; 
    }
    
    p { 
      margin: 0 0 0.8em 0; 
      orphans: 3;
      widows: 3;
    }
    
    ul, ol { 
      margin: 0.5em 0; 
      padding-left: 1.2em; 
      page-break-inside: avoid;
    }
    li { 
      margin: 0.2em 0; 
      page-break-inside: avoid;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
      font-size: ${CSS_FONT_SIZES.table};
      page-break-inside: avoid;
    }
    
    th, td {
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      text-align: left;
      vertical-align: top;
    }
    
    th {
      background: #f7fafc;
      font-weight: 600;
    }
    
    /* Code blocks with syntax highlighting */
    pre.shiki {
      font-family: 'SF Mono', Monaco, Consolas, monospace;
      font-size: ${CSS_FONT_SIZES.codeBlock};
      padding: 0.8em;
      margin: 0.8em 0;
      border-radius: 4px;
      overflow-x: auto;
      white-space: pre-wrap;
      page-break-inside: avoid;
      break-inside: avoid;
      border: 1px solid #e2e8f0;
      /* Critical: preserve colors when printing to PDF */
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
    
    /* Inline code (not in pre blocks) */
    :not(pre) > code {
      font-family: 'SF Mono', Monaco, Consolas, monospace;
      font-size: ${CSS_FONT_SIZES.inlineCode};
      background: #f1f3f4;
      padding: 2px 4px;
      border-radius: 3px;
    }
    
    /* Inline code within headings should scale with heading size */
    h1 code, h2 code, h3 code, h4 code, h5 code, h6 code {
      font-size: 0.85em;
      background: #f1f3f4;
    }
    
    .mermaid {
      text-align: center;
      margin: 1.5em 0;
      padding: 1em;
      background: #f8f9fa;
      border-radius: 6px;
      overflow-x: auto;
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-before: avoid;
      max-height: 800px;
    }
    
    .mermaid svg {
      max-width: 100%;
      max-height: 750px;
      height: auto;
      display: block;
      margin: 0 auto;
    }
    
    /* Force maximum font size in Mermaid diagrams */
    .mermaid svg text,
    .mermaid svg tspan,
    .mermaid svg foreignObject {
      font-size: ${CSS_FONT_SIZES.mermaid} !important;
      max-font-size: ${CSS_FONT_SIZES.mermaid} !important;
    }
   
    strong { font-weight: 600; }
    em { font-style: italic; }
    
    /* Blockquote: Subtle gray for documents (slides use blue accent + italic for prominence) */
    blockquote {
      border-left: 4px solid #e2e8f0;
      padding-left: 1em;
      margin: 1em 0;
      color: #666;
      page-break-inside: avoid;
    }
    
    /* Better page break handling */
    .page-break {
      page-break-before: always;
      break-before: page;
    }
    
    /* Avoid orphans and widows */
    p, li {
      orphans: 3;
      widows: 3;
    }
    
    /* Ensure content doesn't break awkwardly */
    :is(h1,h2,h3,h4,h5,h6) {
      break-after: avoid-page !important;
      break-inside: avoid !important;
    }

    :is(h1,h2,h3,h4,h5,h6)
      + :is(p, ul, ol, pre, table, blockquote, .mermaid) {
      break-before: avoid-page !important;
    }

    /* Ensure proper spacing between sections */
    h1, h2, h3, h4, h5, h6 {
      clear: both;
    }
  </style>
</head>
<body>
  <div class="container">
    ${htmlContent}
  </div>
  <script>${getMermaidInitScript('better settings for A4 landscape')}
  </script>
</body>
</html>`;
  }

  async htmlToPdf(html) {
    return await sharedHtmlToPdf(html, {
      viewportWidth: 1123,
      viewportHeight: 794,
      landscape: true,
      margin: this.options.margin,
      displayHeaderFooter: this.options.displayHeaderFooter,
      printBackground: this.options.printBackground,
      logMessage: 'Generating clean A4 landscape PDF...'
    });
  }
}

// Main execution
async function main() {
  try {
    const { inputPath, outputPath } = parseArgs('md-to-pdf-landscape-puppeteer.js');
    
    console.log(`Converting: ${inputPath} -> ${outputPath}`);
    
    const converter = new MarkdownToPdfConverter({
      format: 'A4',
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
      displayHeaderFooter: false,
      printBackground: true
    });
    
    const resultPath = await converter.convert(inputPath, outputPath);
    console.log(`✅ Successfully converted to PDF: ${resultPath}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Always run main when script is executed
main();


