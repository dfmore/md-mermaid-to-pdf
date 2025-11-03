#!/usr/bin/env node

import { marked } from 'marked';
import { resolve } from 'path';
import { getMermaidInitScript, createWalkTokens, parseArgs, initHighlighter, htmlToPdf as sharedHtmlToPdf, CSS_FONT_SIZES } from './pdf-utils.js';

class MarkdownToPptConverter {
  constructor(options = {}) {
    this.options = {
      format: 'A4',
      landscape: true,
      margin: { top: '0.2in', right: '0.35in', bottom: '0.2in', left: '0.35in' },
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
    
    // Split content by --- to create slides
    const slides = markdown.split(/^---+$/m).map(slide => slide.trim()).filter(slide => slide.length > 0);
    console.log(`Found ${slides.length} slides`);
    
    // Configure marked only once to avoid stacking
    if (!this.markedConfigured) {
      const walkTokens = createWalkTokens(highlighter);
      marked.use({ walkTokens, gfm: true, breaks: false });
      this.markedConfigured = true;
    }
    
    // Convert each slide to HTML
    const slideHtmls = slides.map(slide => {
      const htmlContent = marked.parse(slide);
      return `<div class="slide">${htmlContent}</div>`;
    });
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${frontMatter.title || 'Presentation'}</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    @page {
      size: A4 landscape;
      margin: 0.2in 0.35in;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13pt;
      line-height: 1.5;
      color: #222222;
      margin: 0;
      padding: 0;
      background: white;
      width: 100%;
      overflow-x: hidden;
    }
    
    .slide {
      width: 100%;
      min-height: 100vh;
      padding: 0.75em 1em;
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    
    .slide:last-child {
      page-break-after: auto;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Inter', sans-serif;
      color: #1a1a1a;
      margin: 0.5em 0 0.5em 0;
      page-break-after: avoid !important;
      break-after: avoid-page !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    h1 { 
      font-size: 31pt; 
      font-weight: 700; 
      margin-top: 0;
      color: #0066cc;
    }
    h2 { 
      font-size: 23pt; 
      font-weight: 600; 
      color: #2d3748; 
    }
    h3 { 
      font-size: 19pt; 
      font-weight: 600; 
    }
    h4 { 
      font-size: 15pt; 
      font-weight: 500; 
    }
    
    p { 
      margin: 0 0 1em 0; 
      font-size: 13pt;
    }
    
    ul, ol { 
      margin: 0.5em 0; 
      padding-left: 1.5em; 
      page-break-inside: avoid;
    }
    li { 
      margin: 0.4em 0; 
      page-break-inside: avoid;
      font-size: 13pt;
    }
    
    /* Tables: Larger font and padding for slides (presentation readability) */
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
      font-size: ${CSS_FONT_SIZES.tableSlides};
      page-break-inside: avoid;
    }
    
    th, td {
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      text-align: left;
      vertical-align: top;
    }
    
    th {
      background: #f7fafc;
      font-weight: 600;
    }
    
    /* Code blocks: Larger font, padding, and border-radius for slides (presentation readability) */
    pre.shiki {
      font-family: 'SF Mono', Monaco, Consolas, monospace;
      font-size: ${CSS_FONT_SIZES.codeBlockSlides};
      padding: 1em;
      margin: 1em 0;
      border-radius: 6px;
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
    
    /* Inline code: Larger font and padding for slides (presentation readability) */
    :not(pre) > code {
      font-family: 'SF Mono', Monaco, Consolas, monospace;
      font-size: ${CSS_FONT_SIZES.inlineCodeSlides};
      background: #f1f3f4;
      padding: 2px 6px;
      border-radius: 3px;
    }
    
    /* Inline code within headings should scale with heading size */
    h1 code, h2 code, h3 code, h4 code, h5 code, h6 code {
      font-size: 0.85em;
      background: #f1f3f4;
    }
    
    /* Mermaid: Smaller max-height for slides to fit on slide page */
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
      max-height: 600px;
    }
    
    .mermaid svg {
      max-width: 100%;
      max-height: 550px;
      height: auto;
      display: block;
      margin: 0 auto;
    }
    
    /* Force maximum font size in Mermaid diagrams */
    /* Note: Standardized to 8pt (same as portrait/landscape) for consistency */
    .mermaid svg text,
    .mermaid svg tspan,
    .mermaid svg foreignObject {
      font-size: ${CSS_FONT_SIZES.mermaid} !important;
      max-font-size: ${CSS_FONT_SIZES.mermaid} !important;
    }
   
    strong { font-weight: 600; }
    em { font-style: italic; }
    
    /* Blockquote: Blue accent color and italic style for slides (more prominent/presentation style) */
    blockquote {
      border-left: 4px solid #0066cc;
      padding-left: 1em;
      margin: 1em 0;
      color: #666;
      page-break-inside: avoid;
      font-style: italic;
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
  </style>
</head>
<body>
  ${slideHtmls.join('\n')}
  <script>${getMermaidInitScript('settings for landscape slides')}
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
      logMessage: 'Generating landscape PDF for slides...'
    });
  }
}

// Main execution
async function main() {
  try {
    const { inputPath, outputPath } = parseArgs('md-to-ppt-puppeteer.js', 'Slides are separated by --- in the markdown file');
    
    console.log(`Converting to landscape PDF: ${inputPath} -> ${outputPath}`);
    
    const converter = new MarkdownToPptConverter({
      format: 'A4',
      landscape: true,
      margin: { top: '0.2in', right: '0.35in', bottom: '0.2in', left: '0.35in' },
      displayHeaderFooter: false,
      printBackground: true
    });
    
    const resultPath = await converter.convert(inputPath, outputPath);
    console.log(`✅ Successfully converted to landscape PDF: ${resultPath}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Always run main when script is executed
main();

